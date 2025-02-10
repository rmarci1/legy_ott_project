import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsString, IsStrongPassword, Min, MinLength } from "class-validator";


const message = "Kötelező kitölteni ";

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty({message: message + "a név mezőt"})
  name: string;

  @IsNotEmpty({message: message+ "a felhasználó mezőt!"})
  @IsString()
  username: string;

  @IsNotEmpty({message: message + " az email mezőt"})
  @IsEmail()
  email: string;

  profileImg: string;
  
  @IsNotEmpty({message: message+ " a jelszó mezőt"})
  @IsString()
  password: string;

  @IsBoolean()
  advertiser: boolean = false;
}


