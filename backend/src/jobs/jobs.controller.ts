import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/Auth/guards/Auth-Guard';
import { Response } from 'express';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({
    summary: 'Creates a job'
  })
  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createJobDto: CreateJobDto, @Request() req: Request) {
    createJobDto.from = req['profile']['username'];
    return await this.jobsService.create(createJobDto);
  }

  @ApiOperation({
    summary: 'Returns all of the jobs that are not archived or full'
  })
  @Get()
  findAll() {
    return this.jobsService.findAll();
  }
  @ApiOperation({
    summary: 'Returns users already attended jobs'
  })
  @Get('/archived')
  @UseGuards(AuthGuard)
  findArchived(@Request() req: Request){
    return this.jobsService.findArchived(req['profile']['username']);
  }

  @ApiOperation({
    summary: 'Returns archived advertisements'
  })
  @Get('archivedAds')
  @UseGuards(AuthGuard)
  findArchivedAds(@Request() req: Request){
    return this.jobsService.findArchivedAds(req['profile']['username']);
  }

  @ApiOperation({
    summary: 'Returns jobs advertised by the user'
  })
  @Get('/ads')
  @UseGuards(AuthGuard)
  findAdvertisements(@Request() req: Request){
    return this.jobsService.findAdvertisments(req['profile']['username']);
  }

  @ApiOperation({
    summary: 'Returns jobs that are available for the user'
  })
  @UseGuards(AuthGuard)
  @Get('/available')
  findAvailable(@Request() req: Request){
    return this.jobsService.findAllAvailable(req['profile']['username']);
  }

  @ApiOperation({
    summary: 'Returns jobs that the user wants to attend'
  })
  @Get('/selected')
  @UseGuards(AuthGuard)
  findSelected(@Request() req: Request){
    return this.jobsService.userSelectedJobs(req['profile']['username']);
  }

  @ApiOperation({
    summary: 'Returns jobs that are saved for later by user(by username)'
  })
  @Get('/savedForLater')
  @UseGuards(AuthGuard)
  findSavedForLater(@Request() req: Request){
    return this.jobsService.findSavedForLater(req['profile']['username']);
  }

  @ApiOperation({
    summary: 'Changes saveForLater property to what the frontend sends for job(by Id) that the user(by username) wants to alter'
  })
  @Patch('/updateSave/:jobId')
  @UseGuards(AuthGuard)
  updateSave(@Request() req: Request, @Param('jobId') id: string, @Body() body : {update : boolean}){
    return this.jobsService.updateSave(req['profile']['username'], +id, +req['profile']['id'], body);
  }
  @ApiOperation({
    summary: 'Changes isApplied property to what the frontend sends for job(by Id) that the user(by username) wants to alter'
  })
  @Patch('/attend/:id')
  @UseGuards(AuthGuard)
  attend(@Param('id') id: string, @Request() req: Request, @Body() body : {update : boolean}) {
    return this.jobsService.attend(+id, req['profile']['username'], body.update);
  }

  @ApiOperation({
    summary: 'Alter job by id'
  })
  @Patch('/:id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Request() req:Request) {
    return this.jobsService.update(+id, updateJobDto, req);
  }

  @Post('/:id/updateJobPic')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  async updateJobPic(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Request() req:Request){
    return await this.jobsService.updateJobPic(+id, file.buffer, req);
  }

  @ApiOperation({
    summary: 'Delete job by id and checking if the user username equals to who created the job'
  })
  @Delete('/:id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req:Request) {
    return this.jobsService.remove(+id, req);
  }

  @ApiOperation({
    summary: "Filter jobs my name"
  })
  @Post('/filter/name')
  @UseGuards(AuthGuard)
  async filter(@Body() body : {name : string}, @Request() req: Request){
    return await this.jobsService.filterAdvertisementsByName(body, req['profile']['username']);
  }

  @ApiOperation({
    summary: 'Returns job by id'
  })
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Returns true or false depending on if the user can review that profile based on previous archived jobs'
  })
  @UseGuards(AuthGuard)
  @Get('/review/:reviewed_username')
  canReview(@Request() req: Request, @Param('reviewed_username') reviewed_username){
    return this.jobsService.canReview(req['profile']['username'], reviewed_username);
  }

  @ApiOperation({
    summary: 'Deletes one job with admin role'
  })
  @Delete('/admin/deleteJob/:jobId')
  @UseGuards(AuthGuard)
  deleteJob(@Param('jobId') jobId: string, @Request() req: Request) {
    if(req['profile']['isAdmin']){
      const data = this.jobsService.deleteOne(+jobId);
      return data;
    }
    else{
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }
  @ApiOperation({
    summary: 'Returns all of the jobs with admin role'
  })
  @Get('/admin/allJobs')
  @UseGuards(AuthGuard)
  async findAllJobs(@Request() req: Request) {
    if(req['profile']['isAdmin']){
      const data = await this.jobsService.findAllJobs();
      return data;
    }
    else{
      throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
    }
  }
    @ApiOperation({
      summary: 'Updateing user with admin role'
    })
    @Patch('/admin/updateJob/:jobId')
    @UseGuards(AuthGuard)
    updateJob(@Request() req: Request, @Param('jobId') jobId : string, @Body() updateJobDto : UpdateJobDto){
      if(req['profile']['isAdmin']){
      }
      else{
        throw new ForbiddenException('Nincs jogosultságod ehhez a művelethez');
      }
    }
}
