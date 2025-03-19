import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;
  const jobs = [{id: 1,name: "Prog",date : new Date("2025-02-11 11:21:03.000"), img: '',description: "teszt", from: "budapest", max_attending: 5, current_attending: 3, address : "Budapest"}]
  const findJob = {id: 1,name: "Prog",date : new Date("2025-02-11 11:21:03.000"), img: '',description: "teszt", from: "budapest", max_attending: 5, current_attending: 3, address : "Budapest"}
 
  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [JobsService, PrismaService, ProfilesService,CloudinaryService],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all jobs', () => {
    jest.spyOn(service,"findAll").mockResolvedValue(jobs);
    expect(controller.findAll()).resolves.toEqual(jobs);
  })
  it('should find a job', () => {
    const jobId = 1;
    jest.spyOn(service,"findOne").mockResolvedValue(findJob);
    expect(controller.findOne(jobId.toString())).resolves.toEqual(findJob);
  });
  it('should throw an error when trying to find a not existing job', () => {
    jest.spyOn(service,"findOne").mockRejectedValue(new Error());
    expect(controller.findOne("2")).rejects.toEqual(new Error());
  });

});
