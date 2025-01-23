import { IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator";

const message = "Kötelező kitölteni";

export class validateProfile {
    
    @IsNotEmpty({message: message + " az email mezőt"})
    @IsString()
    email:string;
    
    @IsString()
    @IsNotEmpty({message: message+ " a jelszó mezőt"})
    @IsStrongPassword({}, {message: "A jelszónak rendelkeznie kell minimum: 1 nagy betűvel, 1 kis betűvel, 1 számmal, 1 speciális karakterrel"})
    password: string;
    
    @IsString()
    @IsNotEmpty({message: message+ " a jelszó megerősítő mezőt"})
    passwordAgain: string;

}