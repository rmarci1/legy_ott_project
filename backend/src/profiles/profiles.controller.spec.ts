import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotFoundException } from '@nestjs/common';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;
  const profiles: any = [{name: "Laci", username: "laci.laci", email: "lacilaci@gmail.com", password: "123456Ab@", profileImg:"", advertiser: false}];
  const profile: any = {name: "Laci", username: "laci.laci", email: "lacilaci@gmail.com", password: "123456Ab@", profileImg:"", advertiser: false}
  const profileUpdated: any = {name: "Károly", username: "laci.laci", email: "lacilaci@gmail.com", password: "123456Ab@", profileImg:"", advertiser: false}


  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [ProfilesService, PrismaService, CloudinaryService],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all profiles', () =>{
    jest.spyOn(service, "findAll").mockResolvedValue(profiles);
    expect(controller.findAll()).resolves.toEqual(profiles);
  })

  it('should return one profile', () =>{
    jest.spyOn(service, "findOne").mockResolvedValue(profile)
    expect(controller.findOne(profile.username)).resolves.toEqual(profile);
  })

  it('should throw an error when username is not found', () =>{
    jest.spyOn(service, "findOne").mockRejectedValue(new NotFoundException("Nem létezik ilyen profil"));
    expect(controller.findOne("egy")).rejects.toEqual(new NotFoundException("Nem létezik ilyen profil"))
  })

  it('should return the created profile', () =>{
    jest.spyOn(service, "create").mockResolvedValue(profile);
    expect(controller.create(profile)).resolves.toEqual(profile);
  })

  it('should throw an error when username is not found', () => {
    jest.spyOn(service, "remove").mockRejectedValue(new Error);
    expect(controller.remove("egy")).rejects.toEqual(new Error);
  })

  it('should return the updated profile', () => {
    jest.spyOn(service, "update").mockResolvedValue(profileUpdated)
    expect(controller.update(profile.username, {name: "Károly"})).resolves.toEqual(profileUpdated);
  })

  it('should throw an error when username is not found', () => {
    jest.spyOn(service, "update").mockRejectedValue(new Error("Nem létezik ilyen profil"));
    expect(controller.remove("egy")).rejects.toEqual(new Error("Nem létezik ilyen profil"));
  })

});
