import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import typeorm from 'src/database/config/typeorm';

const validationSchema = Joi.object({
  BUILD_ENV: Joi.string().valid('development', 'production').default('dev'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(8080),
  JWT_SECRET: Joi.string().required(),
});

const NODE_ENV = process.env.NODE_ENV;

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: NODE_ENV === 'test' ? ['.env.test'] : ['.env'],
      isGlobal: true,
      cache: true,
      validationSchema,
      validationOptions: {
        abortEarly: true,
      },
      load: [typeorm],
    }),
  ],
})
export class ConfigModule {}
