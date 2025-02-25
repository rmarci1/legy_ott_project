import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://192.168.11.82:3000',
    'http://192.168.11.142:8081',
    'http://192.168.11.171:5173',
    'http://192.168.1.35:5173'
  ];


  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });



  //SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Légy ott!')
    .setDescription('API documentation for Légy ott! application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  await app.listen(3000, '0.0.0.0');
}

bootstrap();
