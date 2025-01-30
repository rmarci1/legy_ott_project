import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from 'src/prisma.service';
import convertImg from 'src/fileConverter/convert';
import { error } from 'console';

@Injectable()
export class JobsService {

  constructor(private readonly db: PrismaService){}


  async create(createJobDto: CreateJobDto) {
    let converted = await convertImg('profile.jpg')
        console.log(createJobDto)
        console.log('received DTO:', createJobDto)
        try{
          createJobDto.img = "";
          await this.db.job.create({
            data: createJobDto
          })
        }catch(err){
          throw new error("error:", err)
        }
  }

  async findAll() {
    return await this.db.job.findMany();
  }

  async findOne(id: number) {
    try{
      return await this.db.job.findUnique({
        where:{
          id
        }
      });
    }catch(err){
      throw new error("error:", err)
    }
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    try{
      return await this.db.job.update({
        where: {
          id
        },
        data: updateJobDto
      });
    }catch(err){
      throw new error("error:", err)
    }
  }

  async remove(id: number) {
    try{
      return await this.db.job.delete({
        where:{
          id
        }
      });
    }catch(err){
      throw new error("error:", err)
    }
  }

  handleImage() {
    try {
      const base64String = convertImg('profile.jpg');
      return base64String
    } catch (err) {
      console.error(err);
    }
}
}
