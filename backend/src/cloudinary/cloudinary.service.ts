import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { join } from 'path';
import { createReadStream } from 'fs';
import path = require('path');
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
@Injectable()

export class CloudinaryService {
  async uploadImage(
    file?: Express.Multer.File
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if(file){
        return new Promise((resolve, reject) => {
          const upload = v2.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
        
          toStream(file.buffer).pipe(upload);
        });
    }
    else{
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
              if (error) return reject(error);
              resolve(result);
            });
            const imagePath = path.join(__dirname, '../../public', 'img', 'profile.jpg');
            const fileStream = createReadStream(imagePath);
          
            fileStream.pipe(upload);
          });
    }
  }
}