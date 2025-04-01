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
    summary: 'Returns all of the jobs with admin role',
  })
  @Get('/allJobs')
  @UseGuards(AuthGuard)
  async findAllJobs(@Request() req: Request) {
    if (req['profile']['isAdmin']) {
      return this.adminService.findAllJobs();
    } else {
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }
  @ApiOperation({
    summary: 'Returns all of the jobs with admin role',
  })
  @Get('/allProfiles')
  @UseGuards(AuthGuard)
  async findProfiles(@Request() req: Request) {
    if (req['profile']['isAdmin']) {
      return this.adminService.findAllProfiles();
    } else {
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }

  @ApiOperation({
    summary: 'Deletes one job with admin role',
  })
  @Delete('/deleteJob/:jobId')
  @UseGuards(AuthGuard)
  deleteJob(@Param('jobId') jobId: string, @Request() req: Request) {
    if (req['profile']['isAdmin']) {
      return this.adminService.deleteOne(+jobId);
    } else {
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }

  @ApiOperation({
    summary: 'Get analytics data for admin page',
  })
  @Get('/dashboard')
  @UseGuards(AuthGuard)
  dashboard(@Request() req: Request) {
    if (req['profile']['isAdmin']) {
      return this.adminService.getDashBoardData();
    } else {
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }

  @ApiOperation({
    summary: 'Deletes a user with admin role',
  })
  @Delete('/deleteUser/:username')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Request() req: Request,
    @Param('username') username: string,
    @Res() response: Response,
  ) {
    if (req['profile']['isAdmin']) {
      await this.adminService.remove(username);
      return response.json('Sikeres Törlés');
    } else {
      return response
        .status(401)
        .json('Nem authorizált ehhez a változtatáshoz!');
    }
  }

  @ApiOperation({
    summary: 'Updating user with admin role',
  })
  @Patch('/updateUser/:username')
  @UseGuards(AuthGuard)
  updateUser(
    @Request() req: Request,
    @Param('username') username: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @Res() response: Response,
  ) {
    if (req['profile']['isAdmin']) {
      return this.adminService.update(username, updateProfileDto);
    } else {
      return response.json('Nem authorizált ehhez a változtatáshoz!');
    }
  }
}
