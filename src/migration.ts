import { typeormConfig } from '@config/ormconfig';
import { LiteralObject } from '@nestjs/common';
import { exit } from 'process';
import { getConnection, getConnectionManager } from 'typeorm';
import { get } from 'env-var';

export enum MigrationAction {
  UP = 'up',
  DOWN = 'down',
}

type InputParams = {
  tenant?: string;
  action?: MigrationAction;
};

async function createDatabaseIfItDoesNotExist() {
  const conn = await getConnectionManager()
    .create({
      ...typeormConfig,
      type: 'postgres',
      database: undefined,
    })
    .connect();
  const database = get('DB_NAME').required().asString();
  await conn.createQueryRunner().createDatabase(database, true);
  await conn.close();
}

async function up(): Promise<void> {
  await createDatabaseIfItDoesNotExist();
  const connection = getConnection();
  await connection.runMigrations();
  await connection.close();
}

async function down(): Promise<void> {
  const connection = getConnection();
  await connection.undoLastMigration();
  await connection.close();
}

function getArgs(): InputParams {
  const args: LiteralObject = {};
  process.argv.slice(2, process.argv.length).forEach((arg) => {
    // long arg
    if (arg.slice(0, 2) === '--') {
      const longArg = arg.split('=');
      const longArgFlag = longArg[0].slice(2, longArg[0].length);
      const longArgValue = longArg.length > 1 ? longArg[1] : true;
      args[longArgFlag] = longArgValue;
    }
  });
  return { ...args };
}

function usage() {
  // eslint-disable-next-line no-console
  console.log(`usage: [--action]. Executes DB migration.
  --action    valid values [up, down]
  `);
  exit(1);
}

/* arguments validation check */
const input: InputParams = getArgs();
if (
  !input?.tenant ||
  !input?.action ||
  ![MigrationAction.UP, MigrationAction.DOWN].includes(
    input.action as MigrationAction,
  )
) {
  usage();
}

/* apply migration action on a tenant once all args are validated */
if (input.action === MigrationAction.UP) {
  up();
}
if (input.action === MigrationAction.DOWN) {
  down();
}
