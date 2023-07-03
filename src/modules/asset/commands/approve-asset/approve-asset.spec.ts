import { Logger } from '@infrastructure/logger/logger';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { AssetApprovedNotificationInMemoryGateway } from '@modules/asset/adapters/asset-approved-notification/asset-approved-notification.in-memory.gateway';
import { ApproveAssetCommand } from '@modules/asset/commands/approve-asset/approve-asset.command';
import { ApproveAssetCommandHandler } from '@modules/asset/commands/approve-asset/approve-asset.command-handler';
import { AssetInMemoryRepository } from '@modules/asset/database/asset.in-memory.repository';
import { AssetInMemoryUnitOfWork } from '@modules/asset/database/asset.in-memory.unit-of-work';
import { AssetStatus } from '@modules/asset/domain/value-objects/asset-status/asset-status.enum';
import { AlreadyDeletedAssetError } from '@modules/asset/errors/asset/already-deleted-asset-error.error';
import { AssetIdInvalidError } from '@modules/asset/errors/asset/asset-id-invalid.error';
import { AssetNotFoundError } from '@modules/asset/errors/asset/asset-not-found.error';
import { AssetApprovedDomainEventHandler } from '@modules/asset/event-handlers/asset-approved.domain-event-handler';
import { FakeAssetBuilder } from '@tests/asset/fake-asset.builder';

describe('approve asset', () => {
  let approveAssetCommandHandler: ApproveAssetCommandHandler;
  let assetInmemoryRepository: AssetInMemoryRepository;

  beforeEach(() => {
    assetInmemoryRepository = new AssetInMemoryRepository();
    approveAssetCommandHandler = new ApproveAssetCommandHandler(
      new AssetInMemoryUnitOfWork(),
      assetInmemoryRepository,
    );
  });

  describe('when approve asset is not allowed', () => {
    it('should return an error if asset id is empty', async () => {
      // given
      const approveAssetCommand = new ApproveAssetCommand({
        assetId: '   ',
      });
      await expect(
        // when
        approveAssetCommandHandler.execute(approveAssetCommand),
      )
        // then
        .rejects.toThrow(AssetIdInvalidError);
    });

    it('should return an error if asset is not found', async () => {
      // given
      const approveAssetCommand = new ApproveAssetCommand({
        assetId: UUID.generate().value,
      });
      // when
      await expect(approveAssetCommandHandler.execute(approveAssetCommand))
        // then
        .rejects.toThrow(AssetNotFoundError);
    });

    it('should return an error if asset is marked as deleted', async () => {
      // given
      const asset = await FakeAssetBuilder.builder(assetInmemoryRepository)
        .withStatus(AssetStatus.DELETED)
        .build();
      const approveAssetCommand = new ApproveAssetCommand({
        assetId: asset.id.value,
      });
      await expect(
        // when
        approveAssetCommandHandler.execute(approveAssetCommand),
      )
        // then
        .rejects.toThrow(AlreadyDeletedAssetError);
    });
  });

  describe('when approve asset is allowed', () => {
    let assetApprovedEventHandler: AssetApprovedDomainEventHandler;
    let assetApprovedInMemoryNotificationGateway: AssetApprovedNotificationInMemoryGateway;
    beforeEach(() => {
      assetApprovedInMemoryNotificationGateway =
        new AssetApprovedNotificationInMemoryGateway();
      assetApprovedEventHandler = new AssetApprovedDomainEventHandler(
        new Logger(),
        assetApprovedInMemoryNotificationGateway,
      );
      assetApprovedEventHandler.listen();
    });

    afterEach(() => {
      assetApprovedEventHandler.unsubscribe();
    });

    it('should approve an asset and notify the owner', async () => {
      // given
      const asset = await FakeAssetBuilder.builder(assetInmemoryRepository)
        .withStatus(AssetStatus.DRAFT)
        .build();
      const approveAssetCommand = new ApproveAssetCommand({
        assetId: asset.id.value,
      });

      // when
      await approveAssetCommandHandler.execute(approveAssetCommand);

      // then
      const approvedAsset = await assetInmemoryRepository.findOneByIdOrThrow(
        asset.id.value,
      );
      expect(approvedAsset.getPropsCopy().status).toEqual(AssetStatus.APPROVED);
      expect(
        assetApprovedInMemoryNotificationGateway.hasBeenNotifiedOnce(
          approvedAsset.id.value,
        ),
      ).toBeTruthy();
    });
  });
});
