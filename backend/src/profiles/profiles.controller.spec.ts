import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;
  let profiles: any = [{name: "Laci", username: "laci.laci", email: "lacilaci@gmail.com", password: "123456Ab@", profileImg:"", advertiser: false}]; 
  let profile: any = {name: "Laci", username: "laci.laci", email: "lacilaci@gmail.com", password: "123456Ab@", profileImg:"", advertiser: false}

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [ProfilesService, PrismaService, CloudinaryService],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all profiles', () =>{
    jest.spyOn(service, "findAll").mockResolvedValue(profiles);
    expect(controller.findAll()).toEqual(profiles);
  })

  // it('should return one profile', () =>{
  //   expect(controller.findOne(profile.username)).toEqual(profile);
  // })

  // it('should throw an error when username is not found', () =>{

  // })
});
