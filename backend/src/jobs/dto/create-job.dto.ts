import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import * as fs from 'fs';

export class CreateJobDto {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    img: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    max_attending: number;

    @IsString()
    @IsNotEmpty()
    from: string;
    
    @IsNotEmpty()
    @IsString()
    address: string;
}

async function blobToBuffer(blob: Blob): Promise<Buffer> {
    if (blob instanceof Blob) {
        const arrayBuffer = await blob.arrayBuffer();
        return Buffer.from(new Uint8Array(arrayBuffer));
    }
    throw new Error('Nem megfelelő formátumú a kép.');
 }