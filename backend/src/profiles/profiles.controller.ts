import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Request, UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../Auth/guards/Auth-Guard';

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
  @Post('/uploadProfilePic')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File, @Request() req: Request){
    return this.profilesService.uploadProfilePic(req['profile']['username'], file.buffer);
  }

  @ApiOperation({
    summary: 'Alters profile that is found by username'
  })
  @Patch('')
  @UseGuards(AuthGuard)
  async update(@Request() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.profilesService.update(req['profile']['username'], updateProfileDto, req);
  }


  @ApiOperation({
    summary: 'Deletes profile by username'
  })
  @Delete('')
  @UseGuards(AuthGuard)
  remove(@Request() req: Request) {
    return this.profilesService.remove(req['profile']['username']);
  }

}
