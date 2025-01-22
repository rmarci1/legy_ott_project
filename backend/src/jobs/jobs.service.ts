import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PrismaService } from 'src/prisma.service';
import convertImg from 'src/fileConverter/convert';

@Injectable()
export class JobsService {

  constructor(private readonly db: PrismaService){}


  async create(createJobDto: CreateJobDto) {
    let converted = await convertImg('profile.jpg')
        console.log(createJobDto)
        // const dtoTest: CreateProfileDto = {
        //   name: 'Test Name',
        //   username: 'TestUser',
        //   email: 'test@example.com',
        //   password: 'password123',
        //   advertiser: false,
        //   profileImg: converted
        // };
        // console.log('Manually created DTO:', dtoTest);
        console.log('received DTO:', createJobDto)
        createJobDto.img = converted;
        await this.db.job.create({
          data: createJobDto
        })
  }

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
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
