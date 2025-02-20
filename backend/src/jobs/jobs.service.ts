import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Job } from './entities/job.entity';
import { Prisma } from '@prisma/client';
import { Readable } from 'stream';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { defaultProfilePicUrl } from '../constants';
import { extractPublicId } from 'cloudinary-build-url';

@Injectable()
export class JobsService {

  constructor(private readonly db: PrismaService, private readonly cloudinary: CloudinaryService){}


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
            {from: {not: username}},
            {
              profiles: {
                  none: {
                    isApplied: true
                  }
              }
            }
          ],
        },
        include: {
          profiles: {
            select:{
              isApplied: true,
              saveForLater: true
            }
          }
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
  async filterAdvertisementsByName(body : {name,username}){
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
      //user profile
      const profile = await this.db.profile.findUnique({
        where: { username },
        select: {
          id: true
        }
      })

      //current attending count
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

      //check if the relation already exists
      const alreadyExists = await this.db.jobProfile.findUnique({
        where: {
          profileId_jobId: {
            profileId: profile.id,
            jobId: id
          }
        }
      })

      //if exists update it if not create it
      if (alreadyExists){
        await this.db.jobProfile.update({
          where: {
            profileId_jobId: {
              profileId: profile.id,
              jobId: id
            }
          },
          data:{
            isApplied: true
          }
        })
      }
      else{
        await this.db.jobProfile.create({
          data: {
            job:{
              connect: {id}
            },
            profile: {
              connect: {id: profile.id}
            },
            isApplied: true,
            saveForLater: false
          } as Prisma.jobProfileCreateInput
        })
      }

      //update current count of attending user
      return await this.db.job.update({
        where: {
          id
        },
        data: {
          current_attending: numberOfPeople,
        }
      })
    }
    catch {
      throw new Error('Nem sikerült a jelentkezés')
    }
  }

  async forfeitJob(id: number, username: string){
    try{
      //get current attending number of user then subtract one
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

      //update isApplied attribute to false
      this.db.jobProfile.update({
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
          isApplied: false
        }
      })

      //update the number of current attending user
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
    }
    catch (err){
      throw new Error("Error: " + err)
    }
  }
  async findSavedForLater(username: string){
    try{
      const res = await this.db.jobProfile.findMany({
        select: {
          job: true,
          saveForLater: true
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
      return res;
    }
    catch{
      throw new Error("Nincs ilyen felhasználó")
    }
  }

  async updateJobPic(id: number, file: Buffer){
    try{
      const readStream = Readable.from(file)
      const job = await this.db.job.findUnique({
        where: {id},
        select: {
          img: true
        }});

      if(job.img != defaultProfilePicUrl){
        const publicId = extractPublicId(job.img);
        await this.cloudinary.destroyImage(publicId);
      }

      const newPicUrl = await this.cloudinary.uploadImage(readStream);
      const update = this.db.job.update({
        where: {
          id
        },
        data: {
          img: newPicUrl.url
        }
      });
      return update;
    }
    catch (err) {
      throw new Error("Error: " + err);
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
