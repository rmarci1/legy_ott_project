import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async create(@Body() createProfileDto: CreateProfileDto) {
    return await this.profilesService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':username')
  findOneId(@Param('username') username: string) {
    return this.profilesService.findOne(username);
  }
  
  @Patch(':username')
  async update(@Param('username') username: string, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.profilesService.update(username, updateProfileDto);
  }

  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.profilesService.remove(username);
  }
}
