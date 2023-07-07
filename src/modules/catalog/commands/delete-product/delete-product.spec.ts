import { ArgumentInvalidException, NotFoundException } from '@exceptions';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ULID } from '@libs/ddd/domain/value-objects/ulid.value-object';
import { ProductInMemoryUnitOfWork } from '@modules/catalog/database/product.in-memory.unit-of-work';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { FakeProductBuilder } from '@tests/catalog/fake-product.builder';
import { DeleteProductCommand } from './delete-product.command';
import { DeleteProductCommandHandler } from './delete-product.command-handler';

describe('Delete an product', () => {
  let productInMemoryUnitOfWork: ProductInMemoryUnitOfWork;
  let deleteProductCommandHandler: DeleteProductCommandHandler;

  beforeEach(() => {
    productInMemoryUnitOfWork = new ProductInMemoryUnitOfWork();

    deleteProductCommandHandler = new DeleteProductCommandHandler(
      productInMemoryUnitOfWork,
      productInMemoryUnitOfWork.getReadProductRepository(),
    );
  });

  describe('when one or more required fields are missing', () => {
    it('should return an error when id is invalid', async () => {
      // given
      const deleteProductCommand: DeleteProductCommand =
        new DeleteProductCommand({
          id: '1121',
        });
      // when
      await expect(deleteProductCommandHandler.execute(deleteProductCommand))
        // then
        .rejects.toThrow(ArgumentInvalidException);
    });

    it('should return an error when id is valid but product does not exists', async () => {
      // given
      const deleteProductCommand: DeleteProductCommand =
        new DeleteProductCommand({
          id: ProductId.generate().value,
        });
      // when
      await expect(deleteProductCommandHandler.execute(deleteProductCommand))
        // then
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('when one or more required fields are provided', () => {
    it('should delete a product from database if the status is in draft', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.DRAFT)
        .build();
      const deleteProductCommand: DeleteProductCommand =
        new DeleteProductCommand({
          id: product.id.value,
        });

      // when
      await deleteProductCommandHandler.execute(deleteProductCommand);

      // then
      await expect(
        productInMemoryUnitOfWork
          .getReadProductRepository()
          .findOneByIdOrThrow(new ProductId(product.id.value)),
      ).rejects.toThrow(NotFoundException);
    });

    it('should archived a product from database if the status is approved', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.APPROVED)
        .build();
      const deleteProductCommand: DeleteProductCommand =
        new DeleteProductCommand({
          id: product.id.value,
        });

      // when
      await deleteProductCommandHandler.execute(deleteProductCommand);

      // then
      const updatedProduct = await productInMemoryUnitOfWork
        .getReadProductRepository()
        .findOneByIdOrThrow(new ProductId(product.id.value));

      expect(updatedProduct.status).toEqual(ProductStatus.ARCHIVED);
    });
  });

  function getProductBuilder() {
    return FakeProductBuilder.builder(
      productInMemoryUnitOfWork.getWriteProductRepository(
        ULID.generate(DateVO.now()).value,
      ),
    );
  }
});
