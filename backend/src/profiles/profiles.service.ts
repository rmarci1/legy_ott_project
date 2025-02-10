import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { defaultProfilePicUrl } from '../constants';
import { extractPublicId } from 'cloudinary-build-url';
import { Readable } from 'stream';

@Injectable()
export class ProfilesService {

  constructor(private readonly db: PrismaService, private readonly cloudinary: CloudinaryService){}

  async create(createProfileDto: CreateProfileDto) {
    createProfileDto.profileImg = defaultProfilePicUrl;
    console.log(createProfileDto.profileImg)
    return this.db.profile.create({
        data: createProfileDto
      }
    );
  }

  async findAll() {
    return this.db.profile.findMany();
  }

  async findOne(username: string) {
    try{
      return await this.db.profile.findUnique({
        where:{
          username
        }
      });
    }
    catch{
      throw new NotFoundException("Nem létezik ilyen profil");
    }
  }

  async update(username: string, updateProfileDto: UpdateProfileDto) {
    try{
      if(updateProfileDto.newProfilePic){
        console.log(updateProfileDto.newProfilePic)
        const readStream = Readable.from(updateProfileDto.newProfilePic)
        const profile = await this.db.profile.findUnique({
          where: {username},  
          select: {
            profileImg: true
          }
        })
        if(updateProfileDto.profileImg != defaultProfilePicUrl){
          const publicId = extractPublicId(profile.profileImg);
          await this.cloudinary.destroyImage(publicId);
        }
        const newPicUrl = await this.cloudinary.uploadImage(readStream);
        updateProfileDto.profileImg = newPicUrl.url;
      }
      return await this.db.profile.update({
        where:{
          username
        },
        data: updateProfileDto
      });
    }catch(err){
      throw new Error("Error:" + err);
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
