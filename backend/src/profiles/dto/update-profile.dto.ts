import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ReadStream } from 'fs';
import { Stream } from 'stream';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
    newProfilePic?: Buffer
}
