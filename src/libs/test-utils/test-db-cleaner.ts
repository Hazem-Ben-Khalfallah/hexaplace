import { getConnection } from 'typeorm';

export async function cleanUpTestData(): Promise<void[]> {
  const entities = getConnection().entityMetadatas;
  const results: Promise<void>[] = [];
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    results.push(
      repository.query(
        `DELETE FROM ${entity.schema}.${entity.tableName} WHERE metadata->>'test' = $1;`,
        [true],
      ),
    );
  }
  return Promise.all(results);
}
