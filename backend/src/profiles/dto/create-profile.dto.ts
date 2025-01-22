import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class CreateProfileDto {
    @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @Transform(({ value }) => blobToBuffer(value))
  profileImg: Buffer;
  
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'A jelszónak minimum 8 karakternek kell lennie' })
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  advertiser: boolean;
}

async function blobToBuffer(blob: Blob): Promise<Buffer> {
    if (blob instanceof Blob) {
        const arrayBuffer = await blob.arrayBuffer();
        return Buffer.from(new Uint8Array(arrayBuffer));
    }
    throw new Error('Nem megfelelő formátumú a kép.');
 }


