import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {

  @ApiProperty({
    description: 'The reviewed profiles username',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  reviewed_un : string;

  @ApiProperty({
    description: 'The reviewer profiles username',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  reviewer_un: string;

  @ApiProperty({
    description: 'The value of the review out of 5',
    type: 'number',
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @IsNotEmpty()
  @Max(5)x
  @Min(1)
  review: number;

  @ApiProperty({
    description: 'The description of the review',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  desc: string
}
