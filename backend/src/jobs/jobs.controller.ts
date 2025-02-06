import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post() 
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Get('/archived:username')
  findArchived(@Param('username') username: string){
    return this.jobsService.findArchived(username);
  }

  @Get('/ads:username')
  findAdvertisements(@Param('username') username: string){
    return this.jobsService.findAdvertisments(username);
  }

  @Get('/available:username')
  findAvailable(@Param('username') username: string){
    return this.jobsService.findAllAvailable(username);
  }

  @Get('/selected:username')
  findSelected(@Param('username') username: string){
    return this.jobsService.userSelectedJobs(username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
