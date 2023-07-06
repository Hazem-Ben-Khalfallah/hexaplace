import { NotFoundException } from '@exceptions';
import { Logger } from '@infrastructure/logger/logger';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ULID } from '@libs/ddd/domain/value-objects/ulid.value-object';
import { NotificationInMemoryGateway } from '@modules/catalog/adapters/notification.in-memory.adapter';
import { RejectProductCommand } from '@modules/catalog/commands/reject-product/reject-product.command';
import { RejectProductCommandHandler } from '@modules/catalog/commands/reject-product/reject-product.command-handler';
import { ProductInMemoryUnitOfWork } from '@modules/catalog/database/product.in-memory.unit-of-work';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { ProductAlreadyArchivedError } from '@modules/catalog/errors/product/product-already-archived-error.error';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
import { ProductRejectedDomainEventHandler } from '@modules/catalog/event-handlers/product-rejected.domain-event-handler';
import { FakeProductBuilder } from '@tests/catalog/fake-product.builder';

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
        productId: ProductId.generate().value,
        reason: 'some reason',
      });
      // when
      await expect(rejectProductCommandHandler.execute(rejectProductCommand))
        // then
        .rejects.toThrow(NotFoundException);
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
    let notificationGateway: NotificationInMemoryGateway;
    beforeEach(() => {
      notificationGateway = new NotificationInMemoryGateway();
      productRejectedEventHandler = new ProductRejectedDomainEventHandler(
        new Logger(),
        notificationGateway,
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
        .findOneByIdOrThrow(product.id as ProductId);
      expect(rejectdProduct.getPropsCopy().status).toEqual(
        ProductStatus.REJECTED,
      );
      expect(
        notificationGateway.hasBeenNotifiedOnce(rejectdProduct.id.value),
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
