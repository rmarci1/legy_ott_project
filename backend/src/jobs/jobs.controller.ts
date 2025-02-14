import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ApiOperation } from '@nestjs/swagger';

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
    summary: 'Returns all of the jobs'
  })
  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @ApiOperation({
    summary: 'Returns job by id'
  })
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Returns users already attended jobs'
  })
  @Get('/archived/:username')
  findArchived(@Param('username') username: string){
    return this.jobsService.findArchived(username);
  }

  @ApiOperation({
    summary: 'Returns jobs advertised by the user'
  })
  @Get('/ads/:username')
  findAdvertisements(@Param('username') username: string){
    return this.jobsService.findAdvertisments(username);
  }

  @ApiOperation({
    summary: 'Returns jobs that are available for the user'
  })
  @Get('/available/:username')
  findAvailable(@Param('username') username: string){
    return this.jobsService.findAllAvailable(username);
  }

  @ApiOperation({
    summary: 'Returns jobs that the user wants to attend'
  })
  @Get('/selected/:username')
  findSelected(@Param('username') username: string){
    return this.jobsService.userSelectedJobs(username);
  }

  @ApiOperation({
    summary: 'Returns jobs that are saved for later by user(by username)'
  })
  @Get('/savedForLater/:username')
  findSavedForLater(@Param('username') username: string){
    return this.jobsService.findsavedForLater(username);
  }

  @ApiOperation({
    summary: 'Changes saveForLater property to true for job(by Id) that the user(by username) wants to save'
  })
  @Patch('/saveForLater/:jobId/:username')
  saveForLater(@Param('username') username: string, @Param('jobId') id: string){
    return this.jobsService.saveForLater(username, +id);
  }

  @ApiOperation({
    summary: 'Changes saveForLater property to false for job(by Id) that the user(by username) wants to remove from saves'
  })
  @Patch('/removeSave/:jobId/:username')
  removeSave(@Param('username') username: string, @Param('jobId') id: string){
    return this.jobsService.removeSave(username, +id);
  }
  @Patch('/updateSave/:jobId/:profileId/:username')
  updateSave(@Param('username') username: string, @Param('jobId') id: string, @Param('profileId') profileId : string, @Body() body : {update : boolean}){
    return this.jobsService.updateSave(username, +id, +profileId, body);
  }
  @ApiOperation({
    summary: 'Adds a new attendee(by username) to the job(by id)'
  })
  @Patch('/attend/:id/:username')
  attend(@Param('id') id: string, @Param('username') username: string) {
    return this.jobsService.attend(+id, username);
  }

  @ApiOperation({
    summary: 'Removes an attendee(by username) from the job(by id)'
  })
  @Patch('/forfeitPlace/:id/:username')
  forfeitJob(@Param('id') id: string, @Param('username') username: string){
    return this.jobsService.forfeitJob(+id, username);
  }

  @ApiOperation({
    summary: 'Alter job by id'
  })
  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
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
  async filter(@Body() body : {name : string,username : string}){
    return await this.jobsService.FilterAdvertisementsByName(body);
  }
}
