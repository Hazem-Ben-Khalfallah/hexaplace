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

type PartialProduct = Partial<ProductProps> & { id: string };

defineFeature(feature, (test) => {
  let testServer: TestServer;
  let httpServer: request.SuperTest<request.Test>;
  let productWriteRepository: ProductWriteRepositoryPort;
  let productReadRepository: ProductReadRepositoryPort;

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

  /* we use fackeBuilder because test should not interact with system (save products on the ddatabase) */

  const buildProductsWithFackerBuilder = (
    products: PartialProduct[],
  ): Promise<ProductEntity[]> => {
    const promises: Promise<ProductEntity>[] = products.map((product) =>
      FakeProductBuilder.builder(productWriteRepository)
        .withId(product.id)
        .withName(product.name)
        .withStatus(product.status)
        .build(),
    );

    return Promise.all(promises);
  };

  /* we do not intercat with the system because it is just an interface  */
  const getProductById = async (
    productReadRepository: ProductReadRepositoryPort,
    productId: string,
  ): Promise<ProductEntity> => {
    return productReadRepository.findOneByIdOrThrow(new UUID(productId));
  };

  test('Deleting a product if it is draft', ({ when, then, given, and }) => {
    given('I am logged in as a marketplace owner', () => {});

    and(
      'the following products exist:',
      async (productsFromFeature: PartialProduct[]) => {
        const createdProducts = await buildProductsWithFackerBuilder(
          productsFromFeature,
        );
        const statusesProducts = createdProducts.map(
          (elt) => elt.getPropsCopy().status,
        );
        expect(statusesProducts).toEqual([
          ProductStatus.APPROVED,
          ProductStatus.REJECTED,
          ProductStatus.DRAFT,
        ]);
      },
    );

    when(/^I delete a product with id "(.*)"$/, async (id: string) => {
      await httpServer
        .delete(`/v1/products/${id}`)
        .expect(HttpStatus.NO_CONTENT);
    });

    then(
      /^the product with id "(.*)" should not be available anymore$/,
      async (id: string) => {
        expect(getProductById(productReadRepository, id)).rejects.toThrow(
          NotFoundException,
        );
      },
    );
  });

  test('Archiving a product if it was already approved', ({
    when,
    then,
    and,
    given,
    but,
  }) => {
    /* declared here because it is global scope  and i will use it for  two test cases */
    let productToBeDeleted: ProductEntity;

    given('I am logged in as a marketplace owner', () => {});

    and(
      'the following products exist:',
      async (productsFromFeature: PartialProduct[]) => {
        const createdProducts = await buildProductsWithFackerBuilder(
          productsFromFeature,
        );
        const statusesProducts = createdProducts.map(
          (elt) => elt.getPropsCopy().status,
        );
        expect(statusesProducts).toEqual([
          ProductStatus.APPROVED,
          ProductStatus.REJECTED,
          ProductStatus.DRAFT,
        ]);
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
        productToBeDeleted = await getProductById(
          productReadRepository,
          productId,
        );
        expect(productToBeDeleted).toBeDefined();
      },
    );

    but(/^the product should be marked as archived$/, async () => {
      const statusProduct = productToBeDeleted.getPropsCopy().status;
      expect(statusProduct).toBe(ProductStatus.ARCHIVED);
    });
  });
});
