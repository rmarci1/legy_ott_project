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
  Res,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../Auth/guards/Auth-Guard';
import { Response } from 'express';

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
    summary: 'Returns a profile (name,username,profileImg,description,) properties for viewing purposes'
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
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File, @Request() req: Request, @Res({passthrough: true}) response: Response){
    const token = await this.profilesService.uploadProfilePic(req['profile']['username'], file.buffer);
    response.clearCookie('ac');
    response.clearCookie('refresh_token')

    response.cookie('ac', token.access_token, {
      sameSite: false,
      httpOnly: true,
      expires: new Date(2322,1,1),
    })
    response.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      sameSite: false
    })

    return token;
  }

  @ApiOperation({
    summary: 'Alters profile that is found by username'
  })
  @Patch('')
  @UseGuards(AuthGuard)
  async update(@Request() req: Request, @Body() updateProfileDto: UpdateProfileDto, @Res({passthrough: true}) response: Response) {
    const token = await this.profilesService.update(req['profile']['username'], updateProfileDto);

    response.clearCookie('ac');
    response.clearCookie('refresh_token')

    response.cookie('ac', token.access_token, {
      sameSite: false,
      httpOnly: true,
      expires: new Date(2322,1,1),
    })
    response.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      sameSite: false
    })

    return token.profile;
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
