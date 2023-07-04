import { faker } from '@faker-js/faker';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { cleanUpTestData } from '@libs/test-utils/test-db-cleaner';
import { CreateAsset } from '@modules/asset/commands/create-asset/create-asset.request.dto';
import { getTestServer, TestServer } from '@tests/jestSetupAfterEnv';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

const feature = loadFeature('tests/asset/manage-asset/create-asset.feature');

/**
 * e2e test implementing a Gherkin feature file
 * https://github.com/Sairyss/backend-best-practices#testing
 */

defineFeature(feature, (test) => {
  let testServer: TestServer;
  let httpServer: request.SuperTest<request.Test>;

  beforeAll(() => {
    testServer = getTestServer();
    httpServer = request(testServer.serverApplication.getHttpServer());
  });

  afterAll(async () => {
    await getConnection().close();
  });

  afterEach(async () => {
    await cleanUpTestData();
  });

  test('I create an asset', ({ given, when, then, and }) => {
    const asset: Partial<CreateAsset> = {};

    given('I set the asset name', () => {
      asset.id = UUID.generate().value;
      asset.name = faker.commerce.productName();
    });

    and('I set the asset description', () => {
      asset.description = faker.commerce.productDescription();
    });

    when('I send a request to create an asset', async () => {
      await httpServer.post('/v1/assets').send(asset).expect(201);
    });

    then('I receive my asset ID', () => {
      expect(asset.id).toBeDefined();
    });

    and(
      'I can verify that the created asset is exactly as configured',
      async () => {
        const res = await httpServer.get(`/v1/assets/${asset.id}`).expect(200);

        expect(res.body.id === asset.id).toBe(true);
      },
    );
  });
});
