import { NotFoundException } from '@exceptions';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { cleanUpTestData } from '@libs/test-utils/test-db-cleaner';
import {
  ProductEntity,
  ProductProps,
} from '@modules/catalog/domain/entities/product.entity';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import {
  ProductReadRepositoryPort,
  ProductWriteRepositoryPort,
} from '@modules/catalog/ports/product.repository.port';
import { HttpStatus } from '@nestjs/common';
import { FakeProductBuilder } from '@tests/catalog/fake-product.builder';
import { getTestServer, TestServer } from '@tests/jestSetupAfterEnv';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

const feature = loadFeature(
  'tests/catalog/delete-product/delete-product.feature',
);

type PartialProduct = Partial<ProductProps>;

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

  test('Deleting a product if it is draft', ({ when, then, given, and }) => {
    given('I am logged in as a marketplace owner', () => {
      // role management not implemented yet
    });

    and(
      'the following products exist:',
      async (partialProducts: PartialProduct[]) => {
        await createProducts(partialProducts);
      },
    );

    when(/^I delete a product with id "(.*)"$/, async (productId: string) => {
      await httpServer
        .delete(`/v1/products/${productId}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    then(
      /^the product with id "(.*)" should not be available anymore$/,
      async (productId: string) => {
        expect(
          getProductById(productReadRepository, productId),
        ).rejects.toThrow(NotFoundException);
      },
    );
  });

  test('Archiving a product it was already approved', ({
    when,
    then,
    and,
    given,
    but,
  }) => {
    let hiddenProduct: ProductEntity;

    given('I am logged in as a marketplace owner', () => {
      // role management not implemented yet
    });

    and(
      'the following products exist:',
      async (partialProducts: PartialProduct[]) => {
        await createProducts(partialProducts);
      },
    );

    when(/^I delete a product with id "(.*)"$/, async (productId: string) => {
      await httpServer
        .delete(`/v1/products/${productId}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    then(
      /^I can still find the product with id "(.*)"$/,
      async (productId: string) => {
        hiddenProduct = await getProductById(productReadRepository, productId);
      },
    );

    but(/^the product should be marked as archived$/, async () => {
      expect(hiddenProduct.getPropsCopy().status).toEqual(
        ProductStatus.ARCHIVED,
      );
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
  ): Promise<ProductEntity> {
    return productReadRepository.findOneByIdOrThrow(new UUID(productId));
  }
});
