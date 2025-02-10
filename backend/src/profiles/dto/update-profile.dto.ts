import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateProfileDto extends PartialType(CreateProfileDto) {

  @ApiProperty({
    description: 'Profile picture that needs to be uploaded to the cloud',
    required: false
  })
    newProfilePic?: Buffer
}
