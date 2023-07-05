import { ProductInMemoryRepository } from '@modules/product/database/product.in-memory.repository';
import { ProductEntity } from '@modules/product/domain/entities/product.entity';
import { GetProductQuery } from '@modules/product/queries/get-product/get-product.query';
import { GetProductQueryHandler } from '@modules/product/queries/get-product/get-product.query-handler';
import { FakeProductBuilder } from '@tests/product/fake-product.builder';

describe('get Product', () => {
  let productInMemoryRepository: ProductInMemoryRepository;
  let getProductQueryHandler: GetProductQueryHandler;

  beforeEach(() => {
    productInMemoryRepository = new ProductInMemoryRepository();
    getProductQueryHandler = new GetProductQueryHandler(productInMemoryRepository);
  });

  it('get product by id', async () => {
    // given
    const createdProduct: ProductEntity = await FakeProductBuilder.builder(
      productInMemoryRepository,
    ).build();

    const getProductQuery: GetProductQuery = new GetProductQuery({
      id: createdProduct.id.value,
    });

    // when
    const product = await getProductQueryHandler.execute(getProductQuery);

    // then
    expect(product.isOk).toEqual(true);
    expect(product.unwrap()).toEqual(createdProduct);
  });
});
