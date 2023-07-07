import { NotFoundException } from '@exceptions';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ULID } from '@libs/ddd/domain/value-objects/ulid.value-object';
import { ProductInMemoryUnitOfWork } from '@modules/catalog/database/product.in-memory.unit-of-work';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { ProductAlreadyArchivedError } from '@modules/catalog/errors/product/product-already-archived.error';
import { FakeProductBuilder } from '@tests/catalog/fake-product.builder';
import { DeleteProductCommand } from './delete-product.command';
import { DeleteProductCommandHandler } from './delete-product.command-handler';

describe('delete product', () => {
  let productInMemoryUnitOfWork: ProductInMemoryUnitOfWork;
  let deleteProductCommandHandler: DeleteProductCommandHandler;

  beforeEach(() => {
    productInMemoryUnitOfWork = new ProductInMemoryUnitOfWork();
    deleteProductCommandHandler = new DeleteProductCommandHandler(
      productInMemoryUnitOfWork,
      productInMemoryUnitOfWork.getReadProductRepository(),
    );
  });

  describe('when delete product is allowed', () => {
    // let productApprovedEventHandler: ProductApprovedDomainEventHandler;
    // let notificationGateway: NotificationInMemoryGateway;
    // beforeEach(() => {
    //   notificationGateway = new NotificationInMemoryGateway();
    //   productApprovedEventHandler = new ProductApprovedDomainEventHandler(
    //     new Logger(),
    //   );
    //   productApprovedEventHandler.listen();
    // });

    // afterEach(() => {
    //   productApprovedEventHandler.unsubscribe();
    // });

    it('should delete a draft product', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.DRAFT)
        .build();
      const deleteProductCommand = new DeleteProductCommand({
        productId: product.id.value,
      });

      // when
      await deleteProductCommandHandler.execute(deleteProductCommand);

      // then
      const deletedProduct = productInMemoryUnitOfWork
        .getReadProductRepository()
        .findOneByIdOrThrow(product.id as ProductId);

      await expect(deletedProduct).rejects.toThrow(NotFoundException);
    });
  });

  it('should archive an approved product', async () => {
    // given
    const product = await getProductBuilder()
      .withStatus(ProductStatus.APPROVED)
      .build();
    const deleteProductCommand = new DeleteProductCommand({
      productId: product.id.value,
    });

    // when
    await deleteProductCommandHandler.execute(deleteProductCommand);

    // then
    const archivedProduct = await productInMemoryUnitOfWork
      .getReadProductRepository()
      .findOneByIdOrThrow(product.id as ProductId);
    expect(archivedProduct.getPropsCopy().status).toEqual(
      ProductStatus.ARCHIVED,
    );
  });

  it('should not archive an archived product', async () => {
    // given
    const product = await getProductBuilder()
      .withStatus(ProductStatus.ARCHIVED)
      .build();
    const deleteProductCommand = new DeleteProductCommand({
      productId: product.id.value,
    });

    // when
    await expect(deleteProductCommandHandler.execute(deleteProductCommand)).rejects.toThrow(ProductAlreadyArchivedError);
  });

  function getProductBuilder() {
    return FakeProductBuilder.builder(
      productInMemoryUnitOfWork.getWriteProductRepository(
        ULID.generate(DateVO.now()).value,
      ),
    );
  }
});
