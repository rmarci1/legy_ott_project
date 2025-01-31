import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ReadStream } from 'fs';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
    newProfilePic?: ReadStream
}
