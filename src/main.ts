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
      whitelist: true, // TODO: should be set to false or removed: https://en.wikipedia.org/wiki/Principle_of_least_astonishment
      // skipMissingProperties: true, // Remember to add @IsOptional() to an optional field
    }),
    // new TrimBodyPipe(),
    // TODO: translate validation pipes
    // new I18nValidationPipe(),
  );

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // app.enableCors({
  //   origin:
  //     configService.get('BUILD_ENV') !== 'prod' ? [/localhost:([0-9])+/] : true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  // });

  await app.listen(process.env.PORT || 3000);
}

void bootstrap();
