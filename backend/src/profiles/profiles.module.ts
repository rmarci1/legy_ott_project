import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CloudinaryModule, JwtModule.register({
    global: true,
    secret: `${process.env.jwt_secret}`,
    signOptions: { expiresIn: '0.5s' },
  }) ],
  controllers: [ProfilesController ],
  providers: [ProfilesService, PrismaService],
  exports: [ProfilesService]
})
export class ProfilesModule {}
