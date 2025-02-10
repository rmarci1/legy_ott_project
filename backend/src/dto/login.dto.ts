import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

const message = "Kötelező kitölteni ";

export class LoginDto{

    @ApiProperty({
      description: 'Existing users email',
      type: 'string',
      required: false
    })
    email: string;

    @ApiProperty({
      description: 'Existing users username',
      type: 'string',
      required: false
    })
    username: string;

    @ApiProperty({
      description: 'Users password',
      type: 'string'
    })
    @IsNotEmpty({message: message+ " a jelszó mezőt"})
    @IsString()
    password: string;
}
