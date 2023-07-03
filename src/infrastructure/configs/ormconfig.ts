import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { get } from 'env-var';

config();

let entitiesPath = '';
let migrationPath = '';

if (process.env.PROFILE === 'TEST' || process.env.TS_JEST === '1') {
  entitiesPath = 'src/**/*.orm-entity.{js,ts}';
  migrationPath = 'src/infrastructure/database/migrations/*.{js,ts}';
} else {
  entitiesPath = 'dist/**/*.orm-entity.{js,ts}';
  migrationPath = 'dist/src/infrastructure/database/migrations/*.{js,ts}';
}

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: get('DB_HOST').required().asString(),
  port: get('DB_PORT').required().asIntPositive(),
  username: get('DB_USERNAME').required().asString(),
  password: get('DB_PASSWORD').required().asString(),
  database: get('DB_NAME').required().asString(),
  autoLoadEntities: true,
  entities: [entitiesPath],
  migrations: [migrationPath],
  connectTimeoutMS: 2000,
  logging: ['error', 'migration', 'schema'],
};
