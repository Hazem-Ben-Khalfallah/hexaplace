import { ProductInMemoryUnitOfWork } from '@modules/catalog/database/product.in-memory.unit-of-work';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
import { DeleteOrArchiveProductCommandHandler } from './delete-or-archive-product.command-handler';
import { DeleteOrArchiveProductCommand } from './delete-or-archive-product.command';

describe('delete or archive a product', () => {
  let productInMemoryUnitOfWork: ProductInMemoryUnitOfWork;
  let deleteOrArchiveProductCommandHandler: DeleteOrArchiveProductCommandHandler;

  beforeEach(() => {
    productInMemoryUnitOfWork = new ProductInMemoryUnitOfWork();
    deleteOrArchiveProductCommandHandler = new DeleteOrArchiveProductCommandHandler(
      productInMemoryUnitOfWork,
      productInMemoryUnitOfWork.getReadProductRepository(),
    );
  });

  describe('when deleting product is not allowed', () => {
    it('should return an error if product id is empty', async () => {
      // given
      const deleteOrArchiveProductCommand = new DeleteOrArchiveProductCommand({
        productId: '   ',
      });
      await expect(
        // when
        deleteOrArchiveProductCommandHandler.execute(deleteOrArchiveProductCommand),
      )
        // then
        .rejects.toThrow(ProductIdInvalidError);
    });
  });
});
