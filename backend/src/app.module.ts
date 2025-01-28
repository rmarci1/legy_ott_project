import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { JobsModule } from './jobs/jobs.module';
import { PrismaService } from './prisma.service';
import * as session from 'express-session';
import { LoggerMiddleware } from './logger.middleware';
import { ProfilesService } from './profiles/profiles.service';

@Module({
  imports: [ProfilesModule, JobsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: 'secretkey',
          resave: false,
          saveUninitialized: false,
          cookie: { 
            secure: false,
            sameSite: "none",
            httpOnly: true
          },
        }),
        (req, res, next) => {
          console.log("Session middleware:", req.session);
          next();
        },
        LoggerMiddleware
      )
      .forRoutes('*'); 
  }
}
