import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthController } from '../Auth/auth.controller';

@Module({
  imports: [CloudinaryModule, ],
  controllers: [ProfilesController, AuthController],
  providers: [ProfilesService, PrismaService],
  exports: [ProfilesService]
})
export class ProfilesModule {}
