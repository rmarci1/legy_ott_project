import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma.service';
import { error } from 'console';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProfilesService {

  constructor(private readonly db: PrismaService, private readonly cloudinary: CloudinaryService){}

  async create(createProfileDto: CreateProfileDto) {
    const upload =  await this.cloudinary.uploadImage().catch((err) => {
      throw new Error("error:" + err.message)
    })
    createProfileDto.profileImg = upload.url;
    console.log(createProfileDto.profileImg)
    return await this.db.profile.create({
      data: createProfileDto
    }
  )
  }

  async findAll() {
    return await this.db.profile.findMany();
  }

  async findOne(id: number) {
    try{
      return await this.db.profile.findUnique({
        where:{
          id
        }
      });
    }
    catch(err){
      throw new NotFoundException("Nem létezik ilyen id-val profil" + id);
    }
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    try{
      return await this.db.profile.update({
        where:{
          id 
        },
        data: updateProfileDto
      });
    }catch(err){
      throw new error("Error:", err);
    }
  }

  async remove(id: number) {
    try{
      return await this.db.profile.delete({
        where:{
          id
        }
      });
    }
    catch(err){
      throw new error("Error:", err)
    }
  }
}
