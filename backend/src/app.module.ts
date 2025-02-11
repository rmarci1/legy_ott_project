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
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProfilesModule, JobsModule, CloudinaryModule, ReviewsModule, ConfigModule.forRoot({isGlobal: true,}),],
  controllers: [AppController],
  providers: [AppService, PrismaService, ProfilesService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        (req, res, next) => {
          console.log("Session middleware:", req.session);
          next();
        },
        LoggerMiddleware
      )
      .forRoutes('*'); 
  }
}
