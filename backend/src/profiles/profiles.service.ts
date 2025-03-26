import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { defaultProfilePicUrl } from '../constants';
import { extractPublicId } from 'cloudinary-build-url';
import {Readable} from 'stream';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProfilesService {

  constructor(private readonly db: PrismaService, private readonly cloudinary: CloudinaryService, private jwtService: JwtService){}

  async create(createProfileDto: CreateProfileDto) {
    createProfileDto.profileImg = defaultProfilePicUrl;
    createProfileDto.created = new Date();
    if (
      await this.db.profile.findFirst({
        where: {
          OR: [
            { username: createProfileDto.username },
            {email: createProfileDto.email}
          ],
        },
      })
      != null){
      throw new HttpException('Már létezik ilyen profil!', HttpStatus.BAD_REQUEST)
    }
    return this.db.profile.create({
        data: createProfileDto
      }
    );
  }

  async findAll() {
    return this.db.profile.findMany({
      select:{
        id: true,
        name: true,
        username: true,
        reviews: true,
        description: true,
        isAdmin: true,
        profileImg: true
      }
    });
  }

  async findOneProfileView(username: string) {
    const profile = await this.db.profile.findUnique({
      where:{
        username
      },
      select:{
        name: true,
        username: true,
        reviews: true,
        description: true,
        isAdmin: true,
        profileImg: true
      }
    });
    if(profile != null){
      return profile
    }

    throw new NotFoundException("Nem létezik ilyen profil");
  }
  async update(username: string, updateProfileDto: UpdateProfileDto): Promise<{access_token: string, refresh_token: string, profile}> {
    try{
      const profile = await this.db.profile.update({
        where:{
          username
        },
        data: updateProfileDto
      });

      profile.password = null;

      return {
        access_token: await this.jwtService.signAsync(profile, {
          secret: `${process.env.jwt_secret}`,
          expiresIn: '1h'
        }),
        refresh_token: this.jwtService.sign(profile, {
          expiresIn: '1d',
          secret: `${process.env.refresh_secret}`,
        }),
        profile: profile
      };
    }catch(err){
      throw new Error("Nem létezik ilyen profil!");
    }
  }

  async uploadProfilePic(username: string, file: Buffer): Promise<{access_token: string, refresh_token: string}> {
    try{
        const readStream = Readable.from(file)
        const profile = await this.db.profile.findUnique({
          where: {username},
          select: {
            profileImg: true
          }});

        if(profile.profileImg != defaultProfilePicUrl){
          const publicId = extractPublicId(profile.profileImg);
          await this.cloudinary.destroyImage(publicId);
        }
        const newPicUrl = await this.cloudinary.uploadImage(readStream);
        const update = this.update(username,{profileImg: newPicUrl.url});
        return update;
      }
    catch (err) {
      throw new Error("Error: " + err);
    }
  }

  async remove(username: string) {
    try{
      return await this.db.profile.delete({
        where:{
          username
        }
      });
    }
    catch{
      throw new Error("Nem létezik ilyen profil")
    }
  } 
  async getDashBoardData(){
    try{
      const currentDate = new Date();

      const pastWeek = new Date();
      pastWeek.setDate(currentDate.getDate() - 7);

      const userCount = await this.db.profile.count();
      const jobCount = await this.db.job.count();

      const jobCountPastWeek = await this.db.job.count({
        where:{
          created: {gt: pastWeek}
        }
      });
      currentDate.setHours(0,0,0,0);

      const weekdailyCounts = [];
      let thisWeekUserCount = 0;
      let pastWeekUserCount = 0;

      // checking this month
      const monthCheck = new Date();
      monthCheck.setDate(currentDate.getDate() - 30);
      const thisMonthUserCount = await this.db.profile.count({
        where: {
          created : {lte : currentDate, gte: monthCheck}
        }
      });
      const thisMonthJobCount = await this.db.job.count({
        where: {
          created : {lte : currentDate, gte: monthCheck}
        }
      });
      const thisMonthClosedJobs = await this.db.job.count({
        where: {
          date: { lte: currentDate, gte: monthCheck}
        }
      })
      // checking past month
      const pastMonthCheck = new Date();
      pastMonthCheck.setDate(currentDate.getDate() - 30);
      monthCheck.setDate(monthCheck.getDate() - 30);
      const pastMonthUserCount = await this.db.profile.count({
        where: {
          created : { gte:monthCheck, lt : pastMonthCheck }
        }
      });
      const pastMonthJobCount = await this.db.job.count({
        where: {
          created : { gte:monthCheck, lt : pastMonthCheck }
        }
      });
      const pastMonthClosedJobs = await this.db.job.count({
        where: {
          date: { gte:monthCheck, lt : pastMonthCheck }
        }
      })
      const daysOfTheWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      for (let index = 0; index < 7; index++) {

        // this week
        const startOfDay = new Date(currentDate);
        startOfDay.setDate(currentDate.getDate() - index)

        let endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);
        const count = await this.db.profile.count({
          where: {
              created: {
                  gte: startOfDay,
                  lte: endOfDay,
              },
          },
        });
        thisWeekUserCount += count;
        startOfDay.setDate(currentDate.getDate() - 5 - index)

        endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59 , 59, 999);

        const pastDayCount = await this.db.profile.count({
          where: {
              created: {
                  gte: startOfDay,
                  lte: endOfDay,
              },
          },
        });
        pastWeekUserCount+=pastDayCount;
        weekdailyCounts.push({ day: daysOfTheWeek[6-startOfDay.getDay()], thisWeek: count, pastWeek: pastDayCount});
      }

      return {jobCount, jobCountPastWeek, userCount, pastMonthJobCount, thisMonthJobCount,thisMonthClosedJobs,pastMonthClosedJobs, thisWeekUserCount, pastWeekUserCount, thisMonthUserCount, pastMonthUserCount : pastMonthUserCount > 0 ? pastMonthUserCount : 1, weekDailyCounts : weekdailyCounts}
    }
    catch(error){
      throw new Error(error.message);
    }
  }

}
