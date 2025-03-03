import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.db.profile.create({
        data: createProfileDto
      }
    );
  }

  async findAll() {
    return this.db.profile.findMany();
  }

  async findOneProfileView(username: string) {
    try{
      return await this.db.profile.findUnique({
        where:{
          username
        },
        select:{
          name: true,
          username: true,
          reviews: true,
          description: true,
          advertiser: true,
          profileImg: true
        }
      });
    }
    catch{
      throw new NotFoundException("Nem létezik ilyen profil");
    }
  }
  async update(username: string, updateProfileDto: UpdateProfileDto): Promise<{access_token: string, refresh_token: string}> {
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
        })
      };
    }catch(err){
      throw new Error("Error:" + err);
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

}
