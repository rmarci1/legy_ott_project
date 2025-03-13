import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {

    @ApiProperty({
      description: 'Name of the job',
      type: 'string'
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
      description: 'Date of the job: The day it is happening',
      type: 'string'
    })
    @IsNotEmpty()
    @IsString()
    date: string;

    @ApiProperty({
      description: 'More detailed description of the job',
      type: 'string'
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
      description: 'URL of the jobs image',
      type: 'string'
    })
    @IsNotEmpty()
    @IsString()
    img: string;

    @ApiProperty({
      description: 'Maximum number of people that can attend',
      type: 'number',
      minimum: 1
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    max_attending: number;

    @ApiProperty({
      description: 'Current number of people that want to attend',
      type: 'number',
      minimum: 0
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    current_attending: number = 0;

    @ApiProperty({
      description: 'The advertisers username',
      type: 'string'
    })
    from: string;

    @ApiProperty({
      description: 'The address where the job is happening',
      type: 'string'
    })
    @IsNotEmpty()
    @IsString()
    address: string;
}
