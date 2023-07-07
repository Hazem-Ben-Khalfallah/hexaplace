import { NotFoundException } from '@exceptions';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ULID } from '@libs/ddd/domain/value-objects/ulid.value-object';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { ProductInMemoryUnitOfWork } from '@modules/catalog/database/product.in-memory.unit-of-work';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { ProductAlreadyArchivedError } from '@modules/catalog/errors/product/product-already-archived.error';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
import { FakeProductBuilder } from '@tests/catalog/fake-product.builder';
import { DeleteOrArchiveProductCommand } from './delete-or-archive-product.command';
import { DeleteOrArchiveProductCommandHandler } from './delete-or-archive-product.command-handler';

describe('delete or archive a product', () => {
  let productInMemoryUnitOfWork: ProductInMemoryUnitOfWork;
  let deleteOrArchiveProductCommandHandler: DeleteOrArchiveProductCommandHandler;

  beforeEach(() => {
    productInMemoryUnitOfWork = new ProductInMemoryUnitOfWork();
    deleteOrArchiveProductCommandHandler =
      new DeleteOrArchiveProductCommandHandler(
        productInMemoryUnitOfWork,
        productInMemoryUnitOfWork.getReadProductRepository(),
      );
  });

  describe('when deleting or archiving a product is not allowed', () => {
    it('should return an error if product id is empty', async () => {
      // given
      const command = new DeleteOrArchiveProductCommand({
        productId: '   ',
      });
      await expect(
        // when
        deleteOrArchiveProductCommandHandler.execute(command),
      )
        // then
        .rejects.toThrow(ProductIdInvalidError);
    });

    it('should return an error if product is not found', async () => {
      // given
      const command = new DeleteOrArchiveProductCommand({
        productId: UUID.generate().value,
      });
      // when
      await expect(deleteOrArchiveProductCommandHandler.execute(command))
        // then
        .rejects.toThrow(NotFoundException);
    });

    it('should return an error if product is marked as archived', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.ARCHIVED)
        .build();
      const command = new DeleteOrArchiveProductCommand({
        productId: product.id.value,
      });
      await expect(
        // when
        deleteOrArchiveProductCommandHandler.execute(command),
      )
        // then
        .rejects.toThrow(ProductAlreadyArchivedError);
    });
  });

  describe('when deleting or archiving  product is allowed', () => {
    it('should delete a product', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.DRAFT)
        .build();
      const command = new DeleteOrArchiveProductCommand({
        productId: product.id.value,
      });

      // when
      await deleteOrArchiveProductCommandHandler.execute(command);

      // then
      expect(
        getProductById(productInMemoryUnitOfWork, product),
      ).rejects.toThrow(NotFoundException);
    });

    it('should archive a product', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.APPROVED)
        .build();
      const command = new DeleteOrArchiveProductCommand({
        productId: product.id.value,
      });

      // when
      await deleteOrArchiveProductCommandHandler.execute(command);

      // then
      const archivedProduct = await productInMemoryUnitOfWork
        .getReadProductRepository()
        .findOneByIdOrThrow(product.id as UUID);
      expect(archivedProduct.getPropsCopy().status).toEqual(
        ProductStatus.ARCHIVED,
      );
    });
  });

  function getProductBuilder() {
    return FakeProductBuilder.builder(
      productInMemoryUnitOfWork.getWriteProductRepository(
        ULID.generate(DateVO.now()).value,
      ),
    );
  }

  function getProductById(
    productInMemoryUnitOfWork: ProductInMemoryUnitOfWork,
    product: ProductEntity,
  ): Promise<ProductEntity> {
    return productInMemoryUnitOfWork
      .getReadProductRepository()
      .findOneByIdOrThrow(product.id as UUID);
  }
});
