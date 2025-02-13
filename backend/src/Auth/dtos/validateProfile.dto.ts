import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

const message = "Kötelező kitölteni";

export class validateProfile {

    @ApiProperty({
      description: "Chosen email for a mobile user",
      type: 'string'
    })
    @IsNotEmpty({message: message + " az email mezőt"})
    @IsString()
    email:string;

    @ApiProperty({
      description: "Chosen password for a mobile user",
      type: 'string'
    })
    @IsString()
    @IsNotEmpty({message: message+ " a jelszó mezőt"})
    @IsStrongPassword({}, {message: "A jelszónak rendelkeznie kell minimum: 1 nagy betűvel, 1 kis betűvel, 1 számmal, 1 speciális karakterrel"})
    password: string;

    @ApiProperty({
      description: "Validate password for mobile user",
      type: 'string'
    })
    @IsString()
    @IsNotEmpty({message: message+ " a jelszó megerősítő mezőt"})
    passwordAgain: string;

}
