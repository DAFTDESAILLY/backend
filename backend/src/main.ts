import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
          console.log('VALIDATION ERRORS:', JSON.stringify(errors, null, 2));
          return new BadRequestException(errors);
        },
      }),
    );

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('BOOTSTRAP ERROR:', error);
    process.exit(1);
  }
}
bootstrap();
