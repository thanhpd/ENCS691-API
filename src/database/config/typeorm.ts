import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.POSTGRESQL_HOST}`,
  port: parseInt(`${process.env.POSTGRESQL_PORT}`),
  username: `${process.env.POSTGRESQL_USERNAME}`,
  password: `${process.env.POSTGRESQL_PASSWORD}`,
  database: `${process.env.POSTGRESQL_NAME}`,
  ssl:
    process.env.NODE_ENV === 'production'
      ? process.env.POSTGRESQL_SSL === 'true'
      : false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
