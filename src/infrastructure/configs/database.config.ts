import { typeormConfig } from '@config/ormconfig';

const database = {
  ...typeormConfig,
  entities: ['src/**/*.orm-entity.ts'],
  migrationsTableName: 'migrations',
  migrations: ['src/**/migrations/*.ts'],
  cli: {
    migrationsDir: `src/infrastructure/database/migrations`,
  },
};

export = database;
