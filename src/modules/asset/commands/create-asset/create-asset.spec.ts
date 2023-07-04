import { faker } from '@faker-js/faker';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { CreateAssetCommand } from '@modules/asset/commands/create-asset/create-asset.command';
import { CreateAssetCommandHandler } from '@modules/asset/commands/create-asset/create-asset.command-handler';
import { AssetInMemoryUnitOfWork } from '@modules/asset/database/asset.in-memory.unit-of-work';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { AssetStatus } from '@modules/asset/domain/value-objects/asset-status/asset-status.enum';
import { AssetDescriptionRequiredError } from '@modules/asset/errors/asset/asset-description-required.error';
import { AssetNameRequiredError } from '@modules/asset/errors/asset/asset-name-required.error';

describe('Create an asset', () => {
  let assetInMemoryUnitOfWork: AssetInMemoryUnitOfWork;
  let createAssetCommandHandler: CreateAssetCommandHandler;

  beforeEach(() => {
    assetInMemoryUnitOfWork = new AssetInMemoryUnitOfWork();

    createAssetCommandHandler = new CreateAssetCommandHandler(
      assetInMemoryUnitOfWork,
    );
  });

  describe('when one or more required fields are missing', () => {
    it('should return an error when name is invalid', async () => {
      // given
      const createAssetCommand: CreateAssetCommand = new CreateAssetCommand({
        name: '       ',
        description: faker.commerce.productDescription(),
      });
      // when
      await expect(createAssetCommandHandler.execute(createAssetCommand))
        // then
        .rejects.toThrow(AssetNameRequiredError);
    });

    it('should return an error when description is invalid', async () => {
      // given
      const createAssetCommand: CreateAssetCommand = new CreateAssetCommand({
        name: faker.commerce.productName(),
        description: '         ',
      });
      // when
      await expect(createAssetCommandHandler.execute(createAssetCommand))
        // then
        .rejects.toThrow(AssetDescriptionRequiredError);
    });
  });

  describe('when one or more required fields are provided', () => {
    it('should create an asset', async () => {
      // given
      const id = UUID.generate();
      const createAssetCommand: CreateAssetCommand = new CreateAssetCommand({
        id: id.value,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
      });

      // when
      await createAssetCommandHandler.execute(createAssetCommand);

      // then
      const asset: AssetEntity =
        await assetInMemoryUnitOfWork.getReadAssetRepository().findOneByIdOrThrow(id);
      const assetProps = asset.getPropsCopy();
      expect(assetProps?.status).toEqual(AssetStatus.DRAFT);
    });
  });
});
