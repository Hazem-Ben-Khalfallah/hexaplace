import { faker } from '@faker-js/faker';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { Page } from '@libs/utils/page/page';
import { AssetInMemoryRepository } from '@modules/asset/database/asset.in-memory.repository';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { AssetStatus } from '@modules/asset/domain/value-objects/asset-status/asset-status.enum';
import { GetAssetsQuery } from '@modules/asset/queries/get-assets/get-assets.query';
import { GetAssetsQueryHandler } from '@modules/asset/queries/get-assets/get-assets.query-handler';
import { FakeAssetBuilder } from '@tests/asset/fake-asset.builder';

describe('get Assets paginated', () => {
  let assetInMemoryRepository: AssetInMemoryRepository;
  let getAssetsQueryHandler: GetAssetsQueryHandler;

  beforeEach(() => {
    assetInMemoryRepository = new AssetInMemoryRepository();
    getAssetsQueryHandler = new GetAssetsQueryHandler(assetInMemoryRepository);
  });

  describe('when list assets is successful', () => {
    it('should list assets with no param', async () => {
      // given
      await createAssets(10);
      // when
      const response = (await getAssetsQueryHandler.execute(
        new GetAssetsQuery({}),
      )) as Result<AssetEntity[]>;
      // then
      const assets = response.unwrap();
      expect(assets).toHaveLength(10);
    });

    it('should list available assets paginated with asset name filter', async () => {
      // given
      const assetsCount = 15;
      await createAssets(assetsCount);

      const assetsWithSameFirstLettersCount = 14;
      const assetNameFirstPart = faker.commerce.product();
      await createAssetsWithNameStartingWith(
        assetsWithSameFirstLettersCount,
        assetNameFirstPart,
      );
      // when
      const paginatedAssets = (await getAssetsQueryHandler.execute(
        new GetAssetsQuery({
          name: assetNameFirstPart,
        }),
      )) as Result<Page<AssetEntity>>;
      // then
      const assetsPage = paginatedAssets.unwrap();
      expect(assetsPage).toHaveLength(assetsWithSameFirstLettersCount);
    });
  });

  async function createAssetsWithNameStartingWith(
    assetsCount: number,
    assetNameFirstPart: string,
  ) {
    createAssets(assetsCount, {
      status: AssetStatus.APPROVED,
      name: `${assetNameFirstPart}-${faker.commerce.productAdjective()}`,
    });
  }

  async function createAssets(
    assetsCount: number,
    config?: {
      status?: AssetStatus;
      name?: string;
    },
  ) {
    const assetPromises: Promise<AssetEntity>[] = Array.from({
      length: assetsCount,
    }).map(() => {
      const assetBuilder = FakeAssetBuilder.builder(assetInMemoryRepository);
      if (config?.name) assetBuilder.withName(config.name);
      if (config?.status) assetBuilder.withStatus(config.status);
      return assetBuilder.build();
    });
    await Promise.all(assetPromises);
  }
});
