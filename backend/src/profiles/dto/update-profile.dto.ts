import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
