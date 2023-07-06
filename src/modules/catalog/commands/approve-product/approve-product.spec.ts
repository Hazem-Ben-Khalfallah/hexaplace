import { NotFoundException } from '@exceptions';
import { Logger } from '@infrastructure/logger/logger';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ULID } from '@libs/ddd/domain/value-objects/ulid.value-object';
import { NotificationInMemoryGateway } from '@modules/catalog/adapters/notification.in-memory.adapter';
import { ApproveProductCommand } from '@modules/catalog/commands/approve-product/approve-product.command';
import { ApproveProductCommandHandler } from '@modules/catalog/commands/approve-product/approve-product.command-handler';
import { ProductInMemoryUnitOfWork } from '@modules/catalog/database/product.in-memory.unit-of-work';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { ProductAlreadyArchivedError } from '@modules/catalog/errors/product/product-already-archived.error';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
import { ProductApprovedDomainEventHandler } from '@modules/catalog/event-handlers/product-approved.domain-event-handler';
import { FakeProductBuilder } from '@tests/catalog/fake-product.builder';

describe('approve product', () => {
  let productInMemoryUnitOfWork: ProductInMemoryUnitOfWork;
  let approveProductCommandHandler: ApproveProductCommandHandler;

  beforeEach(() => {
    productInMemoryUnitOfWork = new ProductInMemoryUnitOfWork();
    approveProductCommandHandler = new ApproveProductCommandHandler(
      productInMemoryUnitOfWork,
      productInMemoryUnitOfWork.getReadProductRepository(),
    );
  });

  describe('when approve product is not allowed', () => {
    it('should return an error if product id is empty', async () => {
      // given
      const approveProductCommand = new ApproveProductCommand({
        productId: '   ',
      });
      await expect(
        // when
        approveProductCommandHandler.execute(approveProductCommand),
      )
        // then
        .rejects.toThrow(ProductIdInvalidError);
    });

    it('should return an error if product is not found', async () => {
      // given
      const approveProductCommand = new ApproveProductCommand({
        productId: ProductId.generate().value,
      });
      // when
      await expect(approveProductCommandHandler.execute(approveProductCommand))
        // then
        .rejects.toThrow(NotFoundException);
    });

    it('should return an error if product is marked as archived', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.ARCHIVED)
        .build();
      const approveProductCommand = new ApproveProductCommand({
        productId: product.id.value,
      });
      await expect(
        // when
        approveProductCommandHandler.execute(approveProductCommand),
      )
        // then
        .rejects.toThrow(ProductAlreadyArchivedError);
    });
  });

  describe('when approve product is allowed', () => {
    let productApprovedEventHandler: ProductApprovedDomainEventHandler;
    let notificationGateway: NotificationInMemoryGateway;
    beforeEach(() => {
      notificationGateway = new NotificationInMemoryGateway();
      productApprovedEventHandler = new ProductApprovedDomainEventHandler(
        new Logger(),
        notificationGateway,
      );
      productApprovedEventHandler.listen();
    });

    afterEach(() => {
      productApprovedEventHandler.unsubscribe();
    });

    it('should approve an product and notify the owner', async () => {
      // given
      const product = await getProductBuilder()
        .withStatus(ProductStatus.DRAFT)
        .build();
      const approveProductCommand = new ApproveProductCommand({
        productId: product.id.value,
      });

      // when
      await approveProductCommandHandler.execute(approveProductCommand);

      // then
      const approvedProduct = await productInMemoryUnitOfWork
        .getReadProductRepository()
        .findOneByIdOrThrow(product.id as ProductId);
      expect(approvedProduct.getPropsCopy().status).toEqual(
        ProductStatus.APPROVED,
      );
      expect(
        notificationGateway.hasBeenNotifiedOnce(approvedProduct.id.value),
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
