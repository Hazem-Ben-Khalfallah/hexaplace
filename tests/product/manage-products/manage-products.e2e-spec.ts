import { faker } from '@faker-js/faker';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { cleanUpTestData } from '@libs/test-utils/test-db-cleaner';
import { CreateProduct } from '@modules/product/commands/create-product/create-product.request.dto';
import { getTestServer, TestServer } from '@tests/jestSetupAfterEnv';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

const feature = loadFeature('tests/product/manage-products/manage-products.feature');


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

  test('Creating an product', ({ given, when, then, and }) => {
    const product: Partial<CreateProduct> = {};

    given('I set the product name', () => {
      product.id = UUID.generate().value;
      product.name = faker.commerce.productName();
    });

    and('I set the product description', () => {
      product.description = faker.commerce.productDescription();
    });

    when('I send a request to create an product', async () => {
      await httpServer.post('/v1/products').send(product).expect(201);
    });

    then('I receive my product ID', () => {
      expect(product.id).toBeDefined();
    });

    and(
      'I can verify that the created product is exactly as configured',
      async () => {
        const res = await httpServer.get(`/v1/products/${product.id}`).expect(200);

        expect(res.body.id === product.id).toBe(true);
      },
    );
  });
});
