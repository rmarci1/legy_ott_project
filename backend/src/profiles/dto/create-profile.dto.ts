import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, IsStrongPassword, Min, MinLength } from "class-validator";


const message = "Kötelező kitölteni ";

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty({message: message + "a név mezőt"})
  name: string;

  @IsNotEmpty({message: message+ "a felhasználó mezőt!"})
  @IsString()
  username: string;

  @IsNotEmpty({message: message + " az email mezőt"})
  @IsString()
  email: string;

  @Transform(({ value }) => blobToBuffer(value))
  profileImg: Buffer;
  
  @IsNotEmpty({message: message+ " a jelszó mezőt"})
  @IsString()
  @IsStrongPassword({}, {message: "A jelszónak rendelkeznie kell minimum: 1 nagy betűvel, 1 kis betűvel, 1 számmal, 1 speciális karakterrel"})
  password: string;

  @IsBoolean()
  advertiser: boolean = false;
}

async function blobToBuffer(blob: Blob): Promise<Buffer> {
    if (blob instanceof Blob) {
        const arrayBuffer = await blob.arrayBuffer();
        return Buffer.from(new Uint8Array(arrayBuffer));
    }
    throw new Error('Nem megfelelő formátumú a kép.');
 }


