import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    helmet(
      configService.get('BUILD_ENV') !== 'prod'
        ? {
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
          }
        : undefined,
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      // skipMissingProperties: true, // Remember to add @IsOptional() to an optional field
    }),
    // new TrimBodyPipe(),
    // TODO: translate validation pipes
    // new I18nValidationPipe(),
  );

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  app.enableCors({
    origin: [
      /localhost:([0-9])+/,
      ...(process.env.CORS_ALLOWANCE || '').split(','),
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.listen(process.env.PORT || 8080);
}

void bootstrap();
