import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import * as crypto from 'node:crypto';

// Polyfill for global.crypto in Node.js 18 (required by TypeORM/uuid)
if (!global.crypto) {
  // @ts-ignore
  global.crypto = crypto;
}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: 'http://localhost:4200',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Enable global validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: (errors) => {
        console.log('VALIDATION ERRORS:', JSON.stringify(errors, null, 2));
        return new BadRequestException(errors);
      }
    }));

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('BOOTSTRAP ERROR:', error);
    process.exit(1);
  }
}
bootstrap();
