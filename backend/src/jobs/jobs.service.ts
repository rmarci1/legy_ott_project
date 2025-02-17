import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Job } from './entities/job.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class JobsService {

  constructor(private readonly db: PrismaService){}


  async create(createJobDto: CreateJobDto) {
        console.log(createJobDto)
        console.log('received DTO:', createJobDto)
        try{
          createJobDto.img = "";
          await this.db.job.create({
            data: createJobDto
          })
        }catch(err){
          throw new Error("error:" + err)
        }
  }

  findAll() {
    return  this.db.job.findMany();
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
  async findArchived(username: string){
    try{
      const today = new Date();

      const jobs: Job[] = await this.db.jobProfile.findMany({
        where: {
          AND: [
            {
              profile: {
                username,
              },
            },
            {
              OR: [
                {
                  job: {
                    date: { lt: today },
                  },
                },
                {
                  job:{
                    max_attending: {lte: this.db.job.fields.current_attending}
                  }
                }
              ],
            },
          ],
        },
      });

      return jobs;
    }
    catch(error){
      throw new Error("Error: " + error)
    }

  }

  async findAllAvailable(username: string){
    const today = new Date();
    try{
      const jobs = await this.db.job.findMany({
        where: {
          AND: [
            {max_attending: {gt: this.db.job.fields.current_attending}},
            {date: {gte: today}},
            {from: {not: username}}
          ]
        }
      })

      const savedJobsRaw = await this.findsavedForLater(username);
      const updatedJobs = jobs.map(job => ({
        ...job,
        isSaved: savedJobsRaw.some(savedJob => savedJob.id === job.id)
      }))
      return updatedJobs;
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
  async FilterAdvertisementsByName(body : {name,username}){
    try{
      const jobs = await this.db.job.findMany({
        where : {
          AND: [
            {name: {contains: body.name}},
            {max_attending: {gt: this.db.job.fields.current_attending}},
            {date: {gte: new Date()}},
            {from: {not: body.username}}
          ]
        }
      })
      return jobs;
    }
    catch(error){
      throw new Error("Error: " + error)
    }
  }
  async userSelectedJobs(username: string){
    try{
      const today = new Date();
      const jobs = await this.db.jobProfile.findMany({
        select: {
          job: true
        },
        where: {
          AND: [
            {
              job: {
                date: { gte: today}
              }
            },
            {
              profile: {
                username
              }
            }
          ]
        }
      })
      return jobs;
    }
    catch(error){
      throw new Error("Error: " + error);
    }
  }

  async attend(id: number, username: string){
    try{
      const profileid = await this.db.profile.findUnique({
        where: { username },
        select: { id: true }
      }).then((res) =>{
        return res.id
      });
      const numberOfPeople: number = await this.db.job.findUnique({
        select: {
          current_attending: true,
        },
        where: {
          id,
        },
      }).then((res) => {
        return res.current_attending + 1;
      }) ;

      this.db.jobProfile.create({
        data: {
          job:{
            connect: {id}
          },
          profile: {
            connect: {id: profileid}
          }
        } as Prisma.jobProfileCreateInput
      })

      return await this.db.job.update({
        where: {
          id
        },
        data: {
          current_attending: numberOfPeople
        }
      })
    }
    catch {
      throw new Error('Nem sikerült a jelentkezés')
    }
  }

  async forfeitJob(id: number, username: string){
    try{
      const numberOfPeople : number = await this.db.job.findUnique({
        where: {
          id
        },
        select: {
          current_attending: true
        }
      }).then((res)=>{
        return res.current_attending;
      }) - 1;

      this.db.jobProfile.delete({
        where: {
          profileId_jobId: {
            profileId: await this.db.profile.findUnique({
              where: { username },
              select: { id: true }
            }).then((res) =>{
              return res.id
            }),
            jobId: id
          }
        }
      })

      return this.db.job.update({
        where: {
          id
        },
        data: {
          current_attending: numberOfPeople
        }
      })
    }
    catch {
      throw new Error('Nem sikerült a jelentkezés törlése');
    }
  }

  async saveForLater(username: string, id: number){
    try{
      return await this.db.jobProfile.update({
        where: {
          profileId_jobId: {
            profileId: await this.db.profile.findUnique({
              where: { username },
              select: { id: true }
            }).then((res) =>{
              return res.id
            }),
            jobId: id
          }
        },
        data: {
          saveForLater: true
        }
      })
    }
    catch (err) {
      throw new Error("Error" + err)
    }
  }

  async removeSave(username: string, id: number){
    try {
      return await this.db.jobProfile.update({
        where: {
          profileId_jobId: {
            profileId: await this.db.profile.findUnique({
              where: { username },
              select: { id: true }
            }).then((res) =>{
              return res.id
            }),
            jobId: id
          }
        },
          data: {
            saveForLater: false
          }
      })
    }
    catch (err){
      throw new Error("Error: " + err)
    }
  }
  async updateSave(username: string, id: number, profileId : number, body : {update : boolean}){
    try {
      const res = await this.db.jobProfile.findUnique({
        where: {
          profileId_jobId: {
            profileId: await this.db.profile.findUnique({
              where: { username },
              select: { id: true }
            }).then((res) =>{
              return res.id
            }),
            jobId: id
          }
        }
      });
      if(!res){
        return await this.db.jobProfile.create({
          data : {
            jobId : id,
            profileId : profileId,
            saveForLater : true,
            isApplied: false
          }
        })
      }
      return await this.db.jobProfile.update({
        where: {
          profileId_jobId: {
            profileId: await this.db.profile.findUnique({
              where: { username },
              select: { id: true }
            }).then((res) =>{
              return res.id
            }),
            jobId: id
          }
        },
        data: {
          saveForLater: body.update
        }
      });
      return res;
    }
    catch (err){
      throw new Error("Error: " + err)
    }
  }
  async findsavedForLater(username: string){
    try{
      const res = await this.db.jobProfile.findMany({
        select: {
          job: true
        },
        where: {
          AND: [
            {
              profile: {
                username
              }
            },
            {
              saveForLater: {equals: true}
            }
          ]
        }
      })
      const update = res.map((res) => res.job)
      const updatedJobs = update.map((curr) => ({
        ...curr,
        isSaved: true
      }));
      return updatedJobs;
    }
    catch{
      throw new Error("Nincs ilyen felhasználó")
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
      throw new Error("error: " + err)
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
      throw new Error("error: " + err)
    }
  }
}
