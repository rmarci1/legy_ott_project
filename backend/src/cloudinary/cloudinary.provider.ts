import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'ddjasa4hz',
      api_key: '551328138152947',
      api_secret: '4K7vtsSV5KHdHPmx855e152rsgg',
    });
  },
};