import { Logger } from '@infrastructure/logger/logger';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ULID } from '@libs/ddd/domain/value-objects/ulid.value-object';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { ProductRejectedNotificationInMemoryGateway } from '@modules/product/adapters/product-rejected-notification/product-rejected-notification.in-memory.gateway';
import { RejectProductCommand } from '@modules/product/commands/reject-product/reject-product.command';
import { RejectProductCommandHandler } from '@modules/product/commands/reject-product/reject-product.command-handler';
import { ProductInMemoryUnitOfWork } from '@modules/product/database/product.in-memory.unit-of-work';
import { ProductStatus } from '@modules/product/domain/value-objects/product-status/product-status.enum';
import { ProductAlreadyArchivedError } from '@modules/product/errors/product/product-already-archived-error.error';
import { ProductIdInvalidError } from '@modules/product/errors/product/product-id-invalid.error';
import { ProductNotFoundError } from '@modules/product/errors/product/product-not-found.error';
import { ProductRejectdDomainEventHandler as ProductRejectedDomainEventHandler } from '@modules/product/event-handlers/product-rejected.domain-event-handler';
import { FakeProductBuilder } from '@tests/product/fake-product.builder';

describe('reject product', () => {
  let productInMemoryUnitOfWork: ProductInMemoryUnitOfWork;
  let rejectProductCommandHandler: RejectProductCommandHandler;

  beforeEach(() => {
    productInMemoryUnitOfWork = new ProductInMemoryUnitOfWork();
    rejectProductCommandHandler = new RejectProductCommandHandler(
      productInMemoryUnitOfWork,
      productInMemoryUnitOfWork.getReadProductRepository(),
    );
  });

  describe('when reject product is not allowed', () => {
    it('should return an error if product id is empty', async () => {
      // given
      const rejectProductCommand = new RejectProductCommand({
        productId: '   ',
        reason: 'some reason',
      });
      await expect(
        // when
        rejectProductCommandHandler.execute(rejectProductCommand),
      )
        // then
        .rejects.toThrow(ProductIdInvalidError);
    });

    it('should return an error if product is not found', async () => {
      // given
      const rejectProductCommand = new RejectProductCommand({
        productId: UUID.generate().value,
        reason: 'some reason',
      });
      // when
      await expect(rejectProductCommandHandler.execute(rejectProductCommand))
        // then
        .rejects.toThrow(ProductNotFoundError);
    });

    it('should return an error if product is marked as archived', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.ARCHIVED)
        .build();
      const rejectProductCommand = new RejectProductCommand({
        productId: product.id.value,
        reason: 'some reason',
      });
      await expect(
        // when
        rejectProductCommandHandler.execute(rejectProductCommand),
      )
        // then
        .rejects.toThrow(ProductAlreadyArchivedError);
    });
  });

  describe('when reject product is allowed', () => {
    let productRejectedEventHandler: ProductRejectedDomainEventHandler;
    let productRejectdInMemoryNotificationGateway: ProductRejectedNotificationInMemoryGateway;
    beforeEach(() => {
      productRejectdInMemoryNotificationGateway =
        new ProductRejectedNotificationInMemoryGateway();
      productRejectedEventHandler = new ProductRejectedDomainEventHandler(
        new Logger(),
        productRejectdInMemoryNotificationGateway,
      );
      productRejectedEventHandler.listen();
    });

    afterEach(() => {
      productRejectedEventHandler.unsubscribe();
    });

    it('should reject an product and notify the owner', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.DRAFT)
        .build();
      const rejectProductCommand = new RejectProductCommand({
        productId: product.id.value,
        reason: 'some reason',
      });

      // when
      await rejectProductCommandHandler.execute(rejectProductCommand);

      // then
      const rejectdProduct = await productInMemoryUnitOfWork
        .getReadProductRepository()
        .findOneByIdOrThrow(product.id as UUID);
      expect(rejectdProduct.getPropsCopy().status).toEqual(ProductStatus.REJECTED);
      expect(
        productRejectdInMemoryNotificationGateway.hasBeenNotifiedOnce(
          rejectdProduct.id.value,
        ),
      ).toBeTruthy();
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
