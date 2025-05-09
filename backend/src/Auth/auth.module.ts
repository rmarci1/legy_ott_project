import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ProfilesModule } from '../profiles/profiles.module';
import { JobsModule } from '../jobs/jobs.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ProfilesModule, JwtModule.register({
    global: true,
    secret: `${process.env.jwt_secret}`,
    signOptions: { expiresIn: '0.5s' },
  }) ,JobsModule, CloudinaryModule, ReviewsModule],
  providers: [AuthService, PrismaService, ProfilesService],
  controllers: [AuthController]
})
export class AuthModule {}
