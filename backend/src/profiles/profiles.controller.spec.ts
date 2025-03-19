import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotFoundException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {Response} from 'express';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;
  const profiles: any = [{name: "Laci", username: "laci.laci", email: "lacilaci@gmail.com", password: "123456Ab@", profileImg:"", isAdmin: false}];
  const profile: any = {name: "Laci", username: "laci.laci", email: "lacilaci@gmail.com", password: "123456Ab@", profileImg:"", isAdmin: false}
  const profileUpdated: any = {name: "Károly", username: "laci.laci", email: "lacilaci@gmail.com", password: "123456Ab@", profileImg:"", isAdmin: false}


  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [ProfilesService, PrismaService, CloudinaryService, JwtService],
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
    jest.spyOn(service, "findOneProfileView").mockResolvedValue(profile)
    expect(controller.getProfileView(profile.username)).resolves.toEqual(profile);
  })

  it('should throw an error when username is not found', () =>{
    jest.spyOn(service, "findOneProfileView").mockRejectedValue(new NotFoundException("Nem létezik ilyen profil"));
    expect(controller.getProfileView("egy")).rejects.toEqual(new NotFoundException("Nem létezik ilyen profil"))
  })

  it('should return the created profile', () => {
    jest.spyOn(service, 'create').mockResolvedValue(profile);
    expect(controller.create(profile)).resolves.toEqual(profile);
  });

  it('should throw an error when username is not found when deleting', () => {
        const mockRequest = {
          profile: { username: 'nonexistent_user' }
        } as Partial<Request> as Request;
      jest.spyOn(service, 'remove').mockRejectedValue(new Error("Nem létezik ilyen profil"));
      expect(controller.remove(mockRequest)).rejects.toThrow(new Error("Nem létezik ilyen profil"));
    });


    it('should return the updated profile', async () => {
      const mockRequest = {
        profile: { username: 'test_user' },
      } as Partial<Request> as Request;

      const mockResponse = {
        clearCookie: jest.fn(),
        cookie: jest.fn(),
      } as Partial<Response> as Response;

      const mockUpdateProfileDto: UpdateProfileDto = {
        name: 'nev'
      };

      const mockToken = {
        access_token: 'mockAccessToken',
        refresh_token: 'mockRefreshToken',
        profile: { username: 'nev' },
      };

      jest.spyOn(service, 'update').mockResolvedValue(mockToken);

      const result = await controller.update(mockRequest, mockUpdateProfileDto, mockResponse);

      expect(service.update).toHaveBeenCalledWith('test_user', mockUpdateProfileDto);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('ac');
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(mockResponse.cookie).toHaveBeenCalledWith('ac', 'mockAccessToken', expect.any(Object));
      expect(mockResponse.cookie).toHaveBeenCalledWith('refresh_token', 'mockRefreshToken', expect.any(Object));
      expect(result).toEqual(mockToken.profile);
    });


    it('should throw an error when username is not found when updating', async () => {
      const mockRequest = {
        profile: { username: 'test_user' },
      } as Partial<Request> as Request;

      const mockResponse = {
        clearCookie: jest.fn(),
        cookie: jest.fn(),
      } as Partial<Response> as Response;

      const mockUpdateProfileDto: UpdateProfileDto = {
        name: 'nev'
      };

      jest.spyOn(service, "update").mockRejectedValue(new Error("Nem létezik ilyen profil"));

      await expect(controller.update(mockRequest, mockUpdateProfileDto, mockResponse)).rejects.toEqual(new Error("Nem létezik ilyen profil"));
    })
});
