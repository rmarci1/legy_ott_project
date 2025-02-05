import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CloudinaryService } from '../../src/cloudinary/cloudinary.service';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: Partial<ProfilesService>;
  let profile: any = [{name: "Laci", username: "laci.laci", email: "lacilaci@gmail.com", password: "123456Ab@", profileImg:"", advertiser: false}]; 
  
  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockReturnValue(profile)
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [{provide: ProfilesService, useValue: service}, CloudinaryService, PrismaService],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all profiles', () =>{
    expect(controller.findAll()).toEqual(profile);
  })
});
