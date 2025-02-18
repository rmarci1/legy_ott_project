import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


const message = "Kötelező kitölteni ";

export class CreateProfileDto {
  @ApiProperty({
    description: 'Name of the user',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty({message: message + "a név mezőt"})
  name: string;

  @ApiProperty({
    description: 'Users username',
    type: 'string'
  })
  @IsNotEmpty({message: message+ "a felhasználó mezőt!"})
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Users email address',
    type: 'string'
  })
  @IsNotEmpty({message: message + " az email mezőt"})
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Url of the users profile picture',
    type: 'string'
  })
  profileImg: string;

  @ApiProperty({
    description: 'Users password',
    type: 'string'
  })
  @IsNotEmpty({message: message+ " a jelszó mezőt"})
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Users status on the page for future development',
    type: 'boolean',
    default: false,
    required: false
  })
  @IsBoolean()
  advertiser: boolean = false;

  @ApiProperty({
    description: 'Users description',
    type: 'string',
    required: false
  })

  @IsString()
  @IsOptional()
  description?: string = ""
}


