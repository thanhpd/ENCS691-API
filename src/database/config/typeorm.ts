import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env.production.local' });

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: `${process.env.POSTGRESQL_HOST}`,
  port: parseInt(`${process.env.POSTGRESQL_PORT}`),
  username: `${process.env.POSTGRESQL_USERNAME}`,
  password: `${process.env.POSTGRESQL_PASSWORD}`,
  database: `${process.env.POSTGRESQL_DATABASE}`,
  ssl: process.env.POSTGRESQL_SSL === 'true',
  entities: [
    'dist/**/*.entity{.ts,.js}',
    // 'src/**/*.entity{.ts,.js}',
  ],
  migrations: [
    // 'dist/database/migrations/*{.ts,.js}',
    // 'src/database/migrations/*{.ts,.js}',
  ],
  synchronize: false,
  migrationsRun: false,
  logging: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
