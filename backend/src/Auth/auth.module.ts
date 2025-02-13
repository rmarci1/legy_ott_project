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
import { jwtConstants } from './Authconstants';

@Module({
  imports: [ProfilesModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  }) ,JobsModule, CloudinaryModule, ReviewsModule],
  providers: [AuthService, PrismaService, ProfilesService],
  controllers: [AuthController]
})
export class AuthModule {}
