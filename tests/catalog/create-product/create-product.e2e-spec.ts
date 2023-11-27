import { cleanUpTestData } from '@libs/test-utils/test-db-cleaner';
import { CreateProduct } from '@modules/catalog/commands/create-product/create-product.request.dto';
import { ProductProps } from '@modules/catalog/domain/entities/product.entity';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { GetProductById } from '@modules/catalog/queries/get-product/product.response.dto';
import { getTestServer, TestServer } from '@tests/jestSetupAfterEnv';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

const feature = loadFeature(
  'tests/catalog/create-product/create-product.feature',
);

type PartialProduct = Partial<ProductProps>;

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

  test('Creating a product', ({ given, when, then, and }) => {
    const product: Partial<CreateProduct> = {};
    let createdProduct: GetProductById;

    given('I am logged in as a seller', () => {
      /* no role management system is implemented yet */
    });

    when(
      'I enter the following product details:',
      async (products: PartialProduct[]) => {
        product.id = ProductId.generate().value;
        product.name = products[0].name;
        product.description = products[0].description;
      },
    );

    and('I submit the product', async () => {
      await httpServer.post('/v1/products').send(product).expect(201);
    });

    then('the product should be created', async () => {
      const res = await httpServer
        .get(`/v1/products/${product.id}`)
        .expect(200);
      createdProduct = res.body;
      expect(createdProduct.id).toBeDefined();
    });

    and('the product should have the defined name', async () => {
      expect(createdProduct.name).toEqual(product.name);
    });

    and('the product should have the defined description', async () => {
      expect(createdProduct.description).toEqual(product.description);
    });

    and('the created product should be marked as draft', async () => {
      expect(createdProduct.status).toEqual(ProductStatus.DRAFT);
    });
  });
});
