import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { defaultProfilePicUrl } from 'src/constants';
import { extractPublicId } from 'cloudinary-build-url';

@Injectable()
export class ProfilesService {

  constructor(private readonly db: PrismaService, private readonly cloudinary: CloudinaryService){}

  async create(createProfileDto: CreateProfileDto) {
    createProfileDto.profileImg = defaultProfilePicUrl;
    console.log(createProfileDto.profileImg)
    return await this.db.profile.create({
      data: createProfileDto
    }
  )
  }

  async findAll() {
    return await this.db.profile.findMany();
  }

  async findOne(username: string) {
    try{
      return await this.db.profile.findUnique({
        where:{
          username
        }
      });
    }
    catch(err){
      throw new NotFoundException("Nem létezik ilyen profil: " + username);
    }
  }

  async update(username: string, updateProfileDto: UpdateProfileDto) {
    try{
      if(updateProfileDto.newProfilePic){
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

        const newPicUrl = await this.cloudinary.uploadImage(updateProfileDto.newProfilePic)
        
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
    catch(err){
      throw new error("Error:", err)
    }
  }
}
