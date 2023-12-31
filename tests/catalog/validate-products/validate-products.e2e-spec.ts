import { cleanUpTestData } from '@libs/test-utils/test-db-cleaner';
import {
ProductEntity,
ProductProps
} from '@modules/catalog/domain/entities/product.entity';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import {
ProductReadRepositoryPort,
ProductWriteRepositoryPort
} from '@modules/catalog/ports/product.repository.port';
import { HttpStatus } from '@nestjs/common';
import { FakeProductBuilder } from '@tests/catalog/fake-product.builder';
import { getTestServer,TestServer } from '@tests/jestSetupAfterEnv';
import { defineFeature,loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

const feature = loadFeature(
  'tests/catalog/validate-products/validate-products.feature',
);

type PartialProduct = Partial<ProductProps> & { id: string };

defineFeature(feature, (test) => {
  let productWriteRepository: ProductWriteRepositoryPort;
  let productReadRepository: ProductReadRepositoryPort;

  let testServer: TestServer;
  let httpServer: request.SuperTest<request.Test>;

  beforeAll(() => {
    testServer = getTestServer();
    httpServer = request(testServer.serverApplication.getHttpServer());
    productWriteRepository = testServer.serverApplication.get(
      'ProductWriteRepositoryPort',
    );
    productReadRepository = testServer.serverApplication.get(
      'ProductReadRepositoryPort',
    );
  });

  afterAll(async () => {
    await getConnection().close();
  });

  afterEach(async () => {
    await cleanUpTestData();
  });

  test('Approving a product', ({ when, then, given, and }) => {
    given(
      'the following products exist:',
      async (partialProducts: PartialProduct[]) => {
        await createProducts(partialProducts);
      },
    );

    when(/^I approve a product with id "(.*)"$/, async (productId: string) => {
      await httpServer
        .post(`/v1/products/${productId}/approve`)
        .expect(HttpStatus.NO_CONTENT);
    });

    then(
      /^the product with id "(.*)" should be marked as approved$/,
      async (productId: string) => {
        const product = await getProductById(productReadRepository, productId);
        expect(product.getPropsCopy().status).toEqual(ProductStatus.APPROVED);
      },
    );

    and('the seller gets notified', () => {
      // TODO add notification check
    });
  });

  test('Rejecting a product', ({ when, then, and, given }) => {
    let reason: string;

    given(
      'the following products exist:',
      async (products: PartialProduct[]) => {
        await createProducts(products);
      },
    );

    when(
      /^I reject a product with id "(.*)" for the reason "(.*)"$/,
      async (productId: string, rejectionReason: string) => {
        reason = rejectionReason;
        await httpServer
          .post(`/v1/products/${productId}/reject`)
          .send({ reason: rejectionReason })
          .expect(HttpStatus.NO_CONTENT);
      },
    );

    then(
      /^the product with id "(.*)" should be marked as rejected$/,
      async (productId: string) => {
        const product = await getProductById(productReadRepository, productId);
        expect(product.getPropsCopy().status).toEqual(ProductStatus.REJECTED);
      },
    );

    and('the seller gets notified', () => {
      // TODO add rejection notification check
    });
  });

  async function createProducts(
    productsToCreate: PartialProduct[],
  ): Promise<ProductEntity[]> {
    const promises: Promise<ProductEntity>[] = [];
    for (const productToCreate of productsToCreate) {
      promises.push(
        FakeProductBuilder.builder(productWriteRepository)
          .withId(productToCreate.id)
          .withName(productToCreate.name)
          .withStatus(productToCreate.status)
          .build(),
      );
    }
    return Promise.all(promises);
  }

  async function getProductById(
    productReadRepository: ProductReadRepositoryPort,
    productId: string,
  ) {
    return productReadRepository.findOneByIdOrThrow(new ProductId(productId));
  }
});
