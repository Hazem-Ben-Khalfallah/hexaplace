import { NotFoundException } from '@exceptions';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ULID } from '@libs/ddd/domain/value-objects/ulid.value-object';
import { DeleteProductCommand } from '@modules/catalog/commands/delete-product/delete-product.command';
import { DeleteProductCommandHandler } from '@modules/catalog/commands/delete-product/delete-product.command-handler';
import { ProductInMemoryUnitOfWork } from '@modules/catalog/database/product.in-memory.unit-of-work';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { ProductAlreadyArchivedError } from '@modules/catalog/errors/product/product-already-archived.error';
import { FakeProductBuilder } from '@tests/catalog/fake-product.builder';

describe('Delete Product', () => {
  let productInMemoryUnitOfWork: ProductInMemoryUnitOfWork;
  let deleteProductCommandHandler: DeleteProductCommandHandler;

  beforeEach(() => {
    productInMemoryUnitOfWork = new ProductInMemoryUnitOfWork();
    deleteProductCommandHandler = new DeleteProductCommandHandler(
      productInMemoryUnitOfWork,
      productInMemoryUnitOfWork.getReadProductRepository(),
    );
  });

  describe('Delete product', () => {
    it('should throw not found error when trying to delete a non-existing product', async () => {
      const nonExistingPoductId = 'b0c317f0-e414-4afa-baa6-e3db069636d2';
      const command = new DeleteProductCommand({
        id: nonExistingPoductId,
      });

      await expect(
        deleteProductCommandHandler.execute(command),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  it('should delete an existing product that have the draft status ', async () => {
    const product = await getProductBuilder()
      .withStatus(ProductStatus.DRAFT)
      .build();
  });

  it('should change the status of product from approved to archived', async () => {
    const product = await getProductBuilder()
      .withStatus(ProductStatus.APPROVED)
      .build();
    const deleteProductCommand = new DeleteProductCommand({
      id: product.id.value,
    });
    await deleteProductCommandHandler.execute(deleteProductCommand);

    const archivedProduct = await productInMemoryUnitOfWork
      .getReadProductRepository()
      .findOneByIdOrThrow(product.id as ProductId);
    expect(archivedProduct.getPropsCopy().status).toEqual(
      ProductStatus.ARCHIVED,
    );
  });

  it('should thow an error when trying to delete a product that is already archived', async () => {
    const product = await getProductBuilder()
      .withStatus(ProductStatus.ARCHIVED)
      .build();
    const deleteProductCommand = new DeleteProductCommand({
      id: product.id.value,
    });

    await expect(
      deleteProductCommandHandler.execute(deleteProductCommand),
    ).rejects.toThrow(ProductAlreadyArchivedError);
  });

  function getProductBuilder() {
    return FakeProductBuilder.builder(
      productInMemoryUnitOfWork.getWriteProductRepository(
        ULID.generate(DateVO.now()).value,
      ),
    );
  }
});

/* const deleteCommand = new DeleteProductCommand({
  productId: product.id.value,
});
await deleteProductCommandHandler.execute(deleteCommand);
await expect(
  deleteProductCommandHandler.execute(deleteCommand),
).rejects.toThrowError(NotFoundException); */
