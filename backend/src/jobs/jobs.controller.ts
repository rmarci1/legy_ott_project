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
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import {AuthGuard} from 'src/Auth/guards/Auth-Guard';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiOperation({
    summary: 'Creates a job'
  })
  @Post() 
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
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
    return this.jobsService.updateSave(req['profile']['username'], +id, +req['profile']['id'].username.id, body);
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
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Post('/:id/updateJobPic')
  @UseInterceptors(FileInterceptor('file'))
  updateJobPic(@UploadedFile() file: Express.Multer.File, @Param('id') id: string){
    return this.jobsService.updateJobPic(+id, file.buffer);
  }

  @ApiOperation({
    summary: 'Delete job by id'
  })
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
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

}
