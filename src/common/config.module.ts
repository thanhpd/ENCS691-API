import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

const validationSchema = Joi.object({
  BUILD_ENV: Joi.string().valid('development', 'production').default('dev'),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
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
    }),
  ],
})
export class ConfigModule {}
