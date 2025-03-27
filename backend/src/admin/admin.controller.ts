import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../Auth/guards/Auth-Guard';
import { UpdateJobDto } from '../jobs/dto/update-job.dto';
import { Response } from 'express';
import { UpdateProfileDto } from '../profiles/dto/update-profile.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Updating user with admin role'
  })
  @Patch('/updateJob/:jobId')
  @UseGuards(AuthGuard)
  async updateJob(@Request() req: Request, @Param('jobId') jobId : string, @Body() updateJobDto : UpdateJobDto){
    if(req['profile']['isAdmin']){
      return await this.adminService.updateJob(+jobId, updateJobDto);
    }
    else{
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }

  @ApiOperation({
    summary: 'Returns all of the jobs with admin role'
  })
  @Get('/allJobs')
  @UseGuards(AuthGuard)
  async findAllJobs(@Request() req: Request) {
    if(req['profile']['isAdmin']){
      const data = await this.adminService.findAllJobs();
      return data;
    }
    else{
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }
  @ApiOperation({
    summary: 'Returns all of the jobs with admin role'
  })
  @Get('/allProfiles')
  @UseGuards(AuthGuard)
  async findProfiles(@Request() req: Request) {
    if(req['profile']['isAdmin']){
      const data = await this.adminService.findAllProfiles();
      return data;
    }
    else{
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }

  @ApiOperation({
    summary: 'Deletes one job with admin role'
  })
  @Delete('/deleteJob/:jobId')
  @UseGuards(AuthGuard)
  deleteJob(@Param('jobId') jobId: string, @Request() req: Request) {
    if(req['profile']['isAdmin']){
      const data = this.adminService.deleteOne(+jobId);
      return data;
    }
    else{
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }

  @Get("/dashboard")
  @UseGuards(AuthGuard)
  dashboard(@Request() req: Request){
    if(req['profile']['isAdmin']){
      return this.adminService.getDashBoardData();
    }
    else{
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }

  }

  @ApiOperation({
    summary: 'Deletes a user with admin role'
  })
  @Delete('/deleteUser/:username')
  @UseGuards(AuthGuard)
  async deleteUser(@Request() req: Request, @Param('username') username : string, @Res() response: Response){
    if(req['profile']['isAdmin']){
      const res = await this.adminService.remove(username);
      return response.json("Sikeres Törlés");
    }
    else{
      return response.status(401).json("Nem authorizált ehhez a változtatáshoz!");
    }
  }

  @ApiOperation({
    summary: 'Updating user with admin role'
  })
  @Patch('/updateUser/:username')
  @UseGuards(AuthGuard)
  updateUser(@Request() req: Request, @Param('username') username : string, @Body() updateProfileDto : UpdateProfileDto, @Res() response: Response){
    if(req['profile']['isAdmin']){
      return this.adminService.update(username,updateProfileDto);
    }
    else{
      return response.json("Nem authorizált ehhez a változtatáshoz!");
    }
  }
}
