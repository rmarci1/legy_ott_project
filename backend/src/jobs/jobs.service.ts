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
          return await this.db.job.create({
            data: {...createJobDto,
              date: new Date(createJobDto.date)
            }
          })
        }catch(err){
          throw new Error("error:" + err)
        }
  }

  findAll() {
    return  this.db.job.findMany({
      where: {
        AND: [
          {max_attending: {gt: this.db.job.fields.current_attending}},
          {date: {gte: new Date()}},
        ]
      }
    });
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
      const jobs = await this.db.job.findMany({
        where: {
          AND: [
            {
              profiles: {
                some: {
                  profile: {
                    username
                  },
                  isApplied: true
                }
              }
            },
            {
              OR: [
                {
                  date: { lt: today },
                }
              ],
            },
          ],
        },
        include:{
          profiles: {
            where: {
              profile: {
                username
              }
            }
          }
        }
      });

      return jobs;
    }
    catch(error){
      throw new Error("Error: " + error)
    }
  }

  async findArchivedAds(username: string){
    try{
      const jobs = await this.db.job.findMany({
        where: {
          AND: [
            { from: username },
            {
              OR: [
                { date: { lt: new Date() } },
                {
                  current_attending: {equals: this.db.job.fields.max_attending}
                }
              ],
            },
          ],
        },
        include: {
          profiles: true,
        },
      });

      return jobs;
    }
    catch (error){
      throw new Error("Error: " + error);
    }
  }
  async findAppliedJobs(username : string){
    try{
      const currentDay = new Date();
      return await this.db.job.findMany({
        where : {
          AND: [{
            date: {gte: currentDay},
            profiles: {
              every : 
              {
                AND: [{
                  profile:{
                    username : username
                  },
                  isApplied: true
                }]
              }
            }
          }]
        },
        include:{
          profiles:{
            select:{
              isApplied: true,
              saveForLater: true  
            }
          }
        }
      })
    }
    catch(error){
      throw new Error(error)
    }
  }
  async findAllAvailable(username: string){
    const today = new Date();
    try{
      const jobs = await this.db.job.findMany({
        where: {
          AND: [
            { max_attending: { gt: this.db.job.fields.current_attending } },
            { date: { gte: today } },
            { from: { not: username } },
            {
              profiles: {
                none: {
                  AND: [
                    { isApplied: true },
                    {
                      profile: {
                        username
                      }
                    }
                  ],
                },
              },
            },
          ],
        },
        include: {
          profiles: {
            where: {
              profile: {
                username
              }
            },
            select: {
              isApplied: true,
              saveForLater: true,
            },
          },
        },
      });

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
  async filterAdvertisementsByName(body : {name: string}, username:string){
    try{
      const jobs = await this.db.job.findMany({
        where : {
          AND: [
            {name: {contains: body.name}},
            {max_attending: {gt: this.db.job.fields.current_attending}},
            {date: {gte: new Date()}},
            {from: {not: username}}
          ]
        },
        include: {
          profiles: {
            where: {
              profile: {
                username: username
              }
            },
            select: {
              isApplied: true,
              saveForLater: true,
            },
          },
        },
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
      const jobs = await this.db.job.findMany({
        where: {
          AND: [
            {
              date: { gte: today },
            },
            {
              profiles: {
                some: {
                  AND: [
                    {
                      profile: {
                        username
                      },
                    },
                    {
                      isApplied: true
                    }
                  ],
                },
              },
            },
          ],
        },
        include: {
          profiles: {
            where: {
              profile: {
                username
              }
            }
          }
        }
      });
      return jobs;
    }
    catch(error){
      throw new Error("Error: " + error);
    }
  }

  //value false: forfeit; value true: attend
  async attend(id: number, username: string, value: boolean){
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
        return value? res.current_attending + 1 : res.current_attending - 1;
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

      //if exists and want to attend update it if not create it
      if (alreadyExists){
        //already exits, not saved for later and wants to delete attendance => delete relation
        if (!value && !alreadyExists.saveForLater){
          await this.db.jobProfile.delete({
            where: {
              profileId_jobId: {
                profileId: profile.id,
                jobId: id
              }
            }
          })
        }
        //already exits, saved for later and wants to attend or wants to delete => update
        else{
          await this.db.jobProfile.update({
            where: {
              profileId_jobId: {
                profileId: profile.id,
                jobId: id
              }
            },
            data:{
              isApplied: value
            }
          })
        }
      }
      else{
        //if it doesn't exist but wants to attend => create the relation
        if (value){
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
      }
      //update current count of attending user
      return await this.db.job.update({
        where: {
          id
        },
        data: {
          current_attending: numberOfPeople,
        }
      });
    }
    catch {
      throw new Error(value? 'Nem sikerült a jelentkezés!' : 'Nem sikerült a jelentkezés törlése!')
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
          data: {
            job:{
              connect: {id}
            },
            profile: {
              connect: {id: profileId}
            },
            isApplied: false,
            saveForLater: true
          } as Prisma.jobProfileCreateInput
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
      const res = await this.db.job.findMany({
        where: {
          profiles: {
            some: {
              AND: [
                {saveForLater: true},
                {
                  profile: {
                    username
                  }
                }
              ],
            },
          },
          date: {gte: new Date()}
        },
        include: {
          profiles: {
            select: {
              profileId: true,
              isApplied: true,
              saveForLater: true,
            },
            where: {
              profile: {
                username
              }
            }
          },
        },
      });
      return res;
    }
    catch{
      throw new Error("Nincs ilyen felhasználó")
    }
  }

  async updateJobPic(id: number, file: Buffer){
    try{
      console.log("happen");
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
