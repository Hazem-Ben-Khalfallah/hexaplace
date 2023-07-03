import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Asset1688350605248 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `
-- Table: asset

CREATE TABLE IF NOT EXISTS "${schema}".asset
(
    id character varying(255) NOT NULL,
    "createdDate" character varying(30),
    "updatedDate" character varying(30),
    name character varying(255),
    "ownerId" character varying(255),
    description text,
    locations jsonb,
    validated boolean,
    active boolean,
    "assetTypeId" character varying(255),
    quantity integer,
    currency character varying(255),
    price real,
    "customAttributes" jsonb,
    metadata jsonb,
    "platformData" jsonb,
    status text,
    categories jsonb,
    images jsonb,
    CONSTRAINT asset_pkey PRIMARY KEY (id)
);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `
-- Table: asset
DROP TABLE IF EXISTS "${schema}".asset;
      `,
    );
  }
}
