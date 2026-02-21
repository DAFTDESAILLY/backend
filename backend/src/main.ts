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

    // CORS para producción y desarrollo
    app.enableCors({
      origin: true,
      credentials: true,
    });

    // Validaciones globales
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        exceptionFactory: (errors) => {
          console.log('VALIDATION ERRORS:', JSON.stringify(errors, null, 2));
          return new BadRequestException(errors);
        },
      }),
    );

    const port = process.env.PORT || 3000;

    // 🔥 Importante para Railway / Docker
    await app.listen(port, '0.0.0.0');

    console.log(`🚀 Application running on port ${port}`);
  } catch (error) {
    console.error('BOOTSTRAP ERROR:', error);
    process.exit(1);
  }
}

bootstrap();