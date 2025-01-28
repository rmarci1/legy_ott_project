import { IsNotEmpty, IsString } from "class-validator";

const message = "Kötelező kitölteni ";

export class 
LoginDto{
    email: string;
    username: string;

    @IsNotEmpty({message: message+ " a jelszó mezőt"})
    @IsString()
    password: string;
}