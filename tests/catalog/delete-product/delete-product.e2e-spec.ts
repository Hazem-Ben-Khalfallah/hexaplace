import { NotFoundException } from '@exceptions';
import { cleanUpTestData } from '@libs/test-utils/test-db-cleaner';
import {
  ProductEntity,
  ProductProps,
} from '@modules/catalog/domain/entities/product.entity';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import {
  ProductReadRepositoryPort,
  ProductWriteRepositoryPort,
} from '@modules/catalog/ports/product.repository.port';
import { HttpStatus } from '@nestjs/common';
import { getTestServer, TestServer } from '@tests/jestSetupAfterEnv';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { FakeProductBuilder } from '../fake-product.builder';

const feature = loadFeature(
  'tests/catalog/delete-product/delete-product.feature',
);

type PartialProduct = { id: string } & Partial<ProductProps>;

defineFeature(feature, (test) => {
  let testServer: TestServer;
  let httpServer: request.SuperTest<request.Test>;
  let productWriteRepository: ProductWriteRepositoryPort;
  let productReadRepository: ProductReadRepositoryPort;

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

  const createProducts = (
    productsToCreate: PartialProduct[],
  ): Promise<any[]> => {
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
  };

  const getProductById = async (
    productReadRepository: ProductReadRepositoryPort,
    productId: string,
  ) => {
    return productReadRepository.findOneByIdOrThrow(new ProductId(productId));
  };

  test('Deleting a product if it is draft', ({ given, when, then, and }) => {
    given('I am logged in as a marketplace owner', async () => {
      // Implement the logic for logging in as a marketplace owner
    });

    and(
      'the following products exist:',
      async (partialProducts: PartialProduct[]) => {},
    );

    when(/^I delete a product with id "(.*)"$/, async (id) => {
      await httpServer
        .delete(`/v1/products/${id}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    then(
      /^the product with id "(.*)" should not be available anymore$/,
      async (id) => {
        await expect(getProductById(productReadRepository, id)).rejects.toThrow(
          NotFoundException,
        );
      },
    );
  });

  test('Archiving a product if it was already approved', ({
    given,
    and,
    when,
    then,
    but,
  }) => {
    given('I am logged in as a marketplace owner', () => {
      /* still not developped */
    });

    and(
      'the following products exist:',
      async (partialProducts: PartialProduct[]) => {
        /*   const statuses = await getProductStatuses(partialProducts);
        expect(statuses).toEqual(['approved', 'rejected', 'draft']); */
        await createProducts(partialProducts);
      },
    );

    when(/^I delete a product with id "(.*)"$/, async (id) => {
      const deleteProductResponse = await httpServer.delete(
        `/v1/products/${id}`,
      );
      expect(deleteProductResponse.status).toBe(HttpStatus.NO_CONTENT);
    });

    then(/^I can still find the product with id "(.*)"$/, async (id) => {
      const product = await getProductById(productReadRepository, id);
      expect(product).toBeDefined();
    });

    but('the product should be marked as archived', async () => {
      /* expect(product.status).toBe(ProductStatus.ARCHIVED); */
    });
  });
});
