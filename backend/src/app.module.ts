import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { JobsModule } from './jobs/jobs.module';
import { PrismaService } from './prisma/prisma.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ProfilesService } from './profiles/profiles.service';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import * as cookieParser from 'cookie-parser';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ProfilesModule, JobsModule, CloudinaryModule, ReviewsModule, AuthModule, ChatModule, AdminModule,],
  controllers: [AppController],
  providers: [ChatGateway,AppService, PrismaService, ProfilesService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        (req, res, next) => {
          next();
        },
        LoggerMiddleware,
        cookieParser()
      )
      .forRoutes('*'); 
  }
}
