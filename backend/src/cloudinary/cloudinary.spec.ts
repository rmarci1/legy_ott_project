import { Test, TestingModule } from '@nestjs/testing';
import { Cloudinary } from './cloudinary';
import { v2 } from 'cloudinary';
import { CLOUDINARY } from '../constants';

describe('Cloudinary', () => {
  let provider: Cloudinary;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Cloudinary],
    }).compile();

    provider = module.get<Cloudinary>(Cloudinary);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});