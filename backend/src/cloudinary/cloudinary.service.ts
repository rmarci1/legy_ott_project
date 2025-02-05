import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { createReadStream, ReadStream } from 'fs';
import path = require('path');
import { Readable, Stream } from 'stream';
@Injectable()

export class CloudinaryService {
  async uploadImage(
    file?: Readable
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if(file){
        return new Promise((resolve, reject) => {
          const upload = v2.uploader.upload_stream((error, result) => {
            if (error){
              console.error('Error: ' + error);
              return reject(error);
            } 
            resolve(result);
          });
        
          file.pipe(upload);
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


  async destroyImage(
    publicId: string
  ){
    v2.uploader.destroy(publicId, function(error,result) {
      console.log(result, error) })
      .then(resp => console.log(resp))
      .catch(_err=> console.log("Something went wrong, please try again later."));
  }
}