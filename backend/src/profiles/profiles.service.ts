import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma.service';
import { error } from 'console';
import convertImg from 'src/fileConverter/convert';

@Injectable()
export class ProfilesService {

  constructor(private readonly db: PrismaService){}

  async create(createProfileDto: CreateProfileDto) {
    let converted = await convertImg('profile.jpg')
    createProfileDto.profileImg = converted;
    await this.db.profile.create({
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

  async handleImage() {
      try {
        const base64String = await convertImg('profile.jpg');
        console.log(convertImg('profile.jpg'))
        return base64String
      } catch (err) {
        console.error(err);
      }
  }
}
