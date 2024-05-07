import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { winstonLogger } from './config/logger.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: winstonLogger,
    cors: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ticketing API')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Ticketing')
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, customOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images/',
  });

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // app.use(cookieParser())

  console.log(join(__dirname, '..', 'images'));
  await app.listen(3000);
  console.log(`App is running on: 3000`);
}
bootstrap();
