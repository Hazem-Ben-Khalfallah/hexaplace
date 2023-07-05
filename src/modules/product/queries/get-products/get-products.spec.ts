import { faker } from '@faker-js/faker';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { Page } from '@libs/utils/page/page';
import { ProductInMemoryRepository } from '@modules/product/database/product.in-memory.repository';
import { ProductEntity } from '@modules/product/domain/entities/product.entity';
import { ProductStatus } from '@modules/product/domain/value-objects/product-status/product-status.enum';
import { GetProductsQuery } from '@modules/product/queries/get-products/get-products.query';
import { GetProductsQueryHandler } from '@modules/product/queries/get-products/get-products.query-handler';
import { FakeProductBuilder } from '@tests/product/fake-product.builder';

describe('get Products paginated', () => {
  let productInMemoryRepository: ProductInMemoryRepository;
  let getProductsQueryHandler: GetProductsQueryHandler;

  beforeEach(() => {
    productInMemoryRepository = new ProductInMemoryRepository();
    getProductsQueryHandler = new GetProductsQueryHandler(productInMemoryRepository);
  });

  describe('when list products is successful', () => {
    it('should list products with no param', async () => {
      // given
      await createProducts(10);
      // when
      const response = (await getProductsQueryHandler.execute(
        new GetProductsQuery({}),
      )) as Result<ProductEntity[]>;
      // then
      const products = response.unwrap();
      expect(products).toHaveLength(10);
    });

    it('should list available products paginated with product name filter', async () => {
      // given
      const productsCount = 15;
      await createProducts(productsCount);

      const productsWithSameFirstLettersCount = 14;
      const productNameFirstPart = faker.commerce.product();
      await createProductsWithNameStartingWith(
        productsWithSameFirstLettersCount,
        productNameFirstPart,
      );
      // when
      const paginatedProducts = (await getProductsQueryHandler.execute(
        new GetProductsQuery({
          name: productNameFirstPart,
        }),
      )) as Result<Page<ProductEntity>>;
      // then
      const productsPage = paginatedProducts.unwrap();
      expect(productsPage).toHaveLength(productsWithSameFirstLettersCount);
    });
  });

  async function createProductsWithNameStartingWith(
    productsCount: number,
    productNameFirstPart: string,
  ) {
    createProducts(productsCount, {
      status: ProductStatus.APPROVED,
      name: `${productNameFirstPart}-${faker.commerce.productAdjective()}`,
    });
  }

  async function createProducts(
    productsCount: number,
    config?: {
      status?: ProductStatus;
      name?: string;
    },
  ) {
    const productPromises: Promise<ProductEntity>[] = Array.from({
      length: productsCount,
    }).map(() => {
      const productBuilder = FakeProductBuilder.builder(productInMemoryRepository);
      if (config?.name) productBuilder.withName(config.name);
      if (config?.status) productBuilder.withStatus(config.status);
      return productBuilder.build();
    });
    await Promise.all(productPromises);
  }
});
