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
      const profile = await this.db.profile.findFirst({
        where: {
          OR: [
            {username: updateProfileDto.username},
            {email: updateProfileDto.email}
          ]
        }
      })
      if(profile != null){
        throw new HttpException("Már foglalt email cím vagy felhasználónév!", HttpStatus.CONFLICT);
      }
      const updatedProfile = await this.db.profile.update({
        where:{
          username
        },
        data: updateProfileDto
      });

      updatedProfile.password = null;

      return {
        access_token: await this.jwtService.signAsync(updatedProfile, {
          secret: `${process.env.jwt_secret}`,
          expiresIn: '1h'
        }),
        refresh_token: this.jwtService.sign(updatedProfile, {
          expiresIn: '1d',
          secret: `${process.env.refresh_secret}`,
        }),
        profile: updatedProfile
      };
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


}
