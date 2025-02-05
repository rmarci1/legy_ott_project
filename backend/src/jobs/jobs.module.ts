import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfilesService } from 'src/profiles/profiles.service';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [ProfilesModule],
  controllers: [JobsController],
  providers: [JobsService, PrismaService, ProfilesService, CloudinaryService],
})
export class JobsModule {}
