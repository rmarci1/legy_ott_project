import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../prisma/prisma.service';
import convertImg from '../fileConverter/convert';
import { error } from 'console';
import { ProfilesService } from '../profiles/profiles.service';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {

  constructor(private readonly db: PrismaService, private readonly ps: ProfilesService){}


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
      throw new Error("error:"+ err)
    }
  }

  //max_capacity
  async findArchived(username: string){
    try{
      const user = await this.db.profile.findUnique({where:{username}, select: {id: true}});
      const today = new Date();

      const jobs: Job[] = await this.db.jobProfile.findMany({
        where: {
          AND: [
            {profileId: user.id},
            {job: {
              date: {lt: today}
            }}
          ]
        }
      })

      return jobs;
    }
    catch(error){
      throw new Error("Error: " + error)
    }

  }

  async findAllAvailable(){
    const today = new Date();
    try{
      const jobs = await this.db.job.findMany({
        where: {
          AND: [
            {max_attending: {gt: this.db.job.fields.max_attending}},
            {date: {gte: today}}
          ]
        }
      })

      return jobs;
    }
    catch(error){
      throw new Error("Error: " + error);
    }
    
  }

  async findAdvertisments(username: string){
    try{
      const today = new Date();
      const jobs = await this.db.job.findMany({
        where: {
          AND: [
            {from: username},
            {date: {gte: today}}
          ]
        }
      })

      return jobs;
    }
    catch(error){
      throw new Error("Error: " + error);
    }
  }

  //TODO: find jobs that the user wants to attend

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
