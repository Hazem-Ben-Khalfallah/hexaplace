import { AssetInMemoryRepository } from '@modules/asset/database/asset.in-memory.repository';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { GetAssetQuery } from '@modules/asset/queries/get-asset/get-asset.query';
import { GetAssetQueryHandler } from '@modules/asset/queries/get-asset/get-asset.query-handler';
import { FakeAssetBuilder } from '@tests/asset/fake-asset.builder';

describe('get Asset', () => {
  let assetInMemoryRepository: AssetInMemoryRepository;
  let getAssetQueryHandler: GetAssetQueryHandler;

  beforeEach(() => {
    assetInMemoryRepository = new AssetInMemoryRepository();
    getAssetQueryHandler = new GetAssetQueryHandler(assetInMemoryRepository);
  });

  it('get asset by id', async () => {
    // given
    const createdAsset: AssetEntity = await FakeAssetBuilder.builder(
      assetInMemoryRepository,
    ).build();

    const getAssetQuery: GetAssetQuery = new GetAssetQuery({
      id: createdAsset.id.value,
    });

    // when
    const asset = await getAssetQueryHandler.execute(getAssetQuery);

    // then
    expect(asset.isOk).toEqual(true);
    expect(asset.unwrap()).toEqual(createdAsset);
  });
});
