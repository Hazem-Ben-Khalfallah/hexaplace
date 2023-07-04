import { Logger } from '@infrastructure/logger/logger';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ULID } from '@libs/ddd/domain/value-objects/ulid.value-object';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { AssetRejectdNotificationInMemoryGateway } from '@modules/asset/adapters/asset-rejected-notification/asset-rejected-notification.in-memory.gateway';
import { RejectAssetCommand } from '@modules/asset/commands/reject-asset/reject-asset.command';
import { RejectAssetCommandHandler } from '@modules/asset/commands/reject-asset/reject-asset.command-handler';
import { AssetInMemoryUnitOfWork } from '@modules/asset/database/asset.in-memory.unit-of-work';
import { AssetStatus } from '@modules/asset/domain/value-objects/asset-status/asset-status.enum';
import { AlreadyDeletedAssetError } from '@modules/asset/errors/asset/already-deleted-asset-error.error';
import { AssetIdInvalidError } from '@modules/asset/errors/asset/asset-id-invalid.error';
import { AssetNotFoundError } from '@modules/asset/errors/asset/asset-not-found.error';
import { AssetRejectdDomainEventHandler } from '@modules/asset/event-handlers/asset-rejected.domain-event-handler';
import { FakeAssetBuilder } from '@tests/asset/fake-asset.builder';

describe('reject asset', () => {
  let assetInMemoryUnitOfWork: AssetInMemoryUnitOfWork;
  let rejectAssetCommandHandler: RejectAssetCommandHandler;

  beforeEach(() => {
    assetInMemoryUnitOfWork = new AssetInMemoryUnitOfWork();
    rejectAssetCommandHandler = new RejectAssetCommandHandler(
      assetInMemoryUnitOfWork,
      assetInMemoryUnitOfWork.getReadAssetRepository(),
    );
  });

  describe('when reject asset is not allowed', () => {
    it('should return an error if asset id is empty', async () => {
      // given
      const rejectAssetCommand = new RejectAssetCommand({
        assetId: '   ',
        reason: 'some reason',
      });
      await expect(
        // when
        rejectAssetCommandHandler.execute(rejectAssetCommand),
      )
        // then
        .rejects.toThrow(AssetIdInvalidError);
    });

    it('should return an error if asset is not found', async () => {
      // given
      const rejectAssetCommand = new RejectAssetCommand({
        assetId: UUID.generate().value,
        reason: 'some reason',
      });
      // when
      await expect(rejectAssetCommandHandler.execute(rejectAssetCommand))
        // then
        .rejects.toThrow(AssetNotFoundError);
    });

    it('should return an error if asset is marked as deleted', async () => {
      // given
      const asset = await getAssetBuilder()
        .withStatus(AssetStatus.DELETED)
        .build();
      const rejectAssetCommand = new RejectAssetCommand({
        assetId: asset.id.value,
        reason: 'some reason',
      });
      await expect(
        // when
        rejectAssetCommandHandler.execute(rejectAssetCommand),
      )
        // then
        .rejects.toThrow(AlreadyDeletedAssetError);
    });
  });

  describe('when reject asset is allowed', () => {
    let assetRejectdEventHandler: AssetRejectdDomainEventHandler;
    let assetRejectdInMemoryNotificationGateway: AssetRejectdNotificationInMemoryGateway;
    beforeEach(() => {
      assetRejectdInMemoryNotificationGateway =
        new AssetRejectdNotificationInMemoryGateway();
      assetRejectdEventHandler = new AssetRejectdDomainEventHandler(
        new Logger(),
        assetRejectdInMemoryNotificationGateway,
      );
      assetRejectdEventHandler.listen();
    });

    afterEach(() => {
      assetRejectdEventHandler.unsubscribe();
    });

    it('should reject an asset and notify the owner', async () => {
      // given
      const asset = await getAssetBuilder()
        .withStatus(AssetStatus.DRAFT)
        .build();
      const rejectAssetCommand = new RejectAssetCommand({
        assetId: asset.id.value,
        reason: 'some reason',
      });

      // when
      await rejectAssetCommandHandler.execute(rejectAssetCommand);

      // then
      const rejectdAsset = await assetInMemoryUnitOfWork
        .getReadAssetRepository()
        .findOneByIdOrThrow(asset.id as UUID);
      expect(rejectdAsset.getPropsCopy().status).toEqual(AssetStatus.REJECTED);
      expect(
        assetRejectdInMemoryNotificationGateway.hasBeenNotifiedOnce(
          rejectdAsset.id.value,
        ),
      ).toBeTruthy();
    });
  });

  function getAssetBuilder() {
    return FakeAssetBuilder.builder(
      assetInMemoryUnitOfWork.getWriteAssetRepository(
        ULID.generate(DateVO.now()).value,
      ),
    );
  }
});
