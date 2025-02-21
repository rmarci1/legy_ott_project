import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({
    summary: 'Creates a profile and pushes it to the database'
  })
  @Post()
  async create(@Body() createProfileDto: CreateProfileDto) {
    return await this.profilesService.create(createProfileDto);
  }

  @ApiOperation({
    summary: 'Returns a profile (name,username,profileImg,description,advertiser) properties for viewing purposes'
  })
  @Get('/view/:username')
  getProfileView(@Param('username') username: string){
    return this.profilesService.findOneProfileView(username);
  }

  @ApiOperation({
    summary: 'Returns all of the profiles'
  })
  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @ApiOperation({
    summary: 'Uploads profile picture to cloud and uploads the url in the database'
  })
  @Post('/:username/uploadProfilePic')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File, @Param('username') username: string){
    return this.profilesService.uploadProfilePic(username, file.buffer);
  }

  @ApiOperation({
    summary: 'Alters profile that is found by username'
  })
  @Patch(':username')
  async update(@Param('username') username: string, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.profilesService.update(username, updateProfileDto);
  }


  @ApiOperation({
    summary: 'Deletes profile by username'
  })
  @Delete(':username')
  remove(@Param('username') username: string) {
    return this.profilesService.remove(username);
  }

}
