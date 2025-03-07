import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({
    summary: 'Creates a review'
  })
  @Post('/add/:username')
  create(@Body() createReviewDto: CreateReviewDto, @Param('username') username : string) {
    return this.reviewsService.create(createReviewDto,username);
  }

  @ApiOperation({
    summary: 'Returns all reviews'
  })
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiOperation({
    summary: 'Returns reviews that are linked to the profile(found by username)'
  })
  @Get(':reviewedUsername')
  async findAllByUsername(@Param('reviewedUsername') username: string) {
    return await this.reviewsService.findAllByUsername(username);
  }
  @ApiOperation({
    summary: 'Returns the average rating of a specific user found by username'
  })
  @Get('/average/:username')
  async getAverage(@Param('username') username: string){
    return await this.reviewsService.findAverageRating(username);
  }

  @ApiOperation({
    summary: 'Alters a review(by id)'
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return await this.reviewsService.update(+id, updateReviewDto);
  }

  @ApiOperation({
    summary: 'Deletes a review(by id)'
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.reviewsService.remove(+id);
  }
}
