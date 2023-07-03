import { Logger } from '@infrastructure/logger/logger';
import { InMemoryRepositoryBase } from '@libs/ddd/infrastructure/database/base-classes/in-memory.repository.base';
import { final } from '@libs/decorators/final.decorator';
import { AssetOrmEntity } from '@modules/asset/database/asset.orm-entity';
import { AssetOrmMapper } from '@modules/asset/database/asset.orm-mapper';
import {
  AssetEntity,
  AssetProps,
} from '@modules/asset/domain/entities/asset.entity';
import {
  AssetReadRepositoryPort,
  AssetWriteRepositoryPort,
} from '@modules/asset/ports/asset.repository.port';
import { GetAssetsQuery } from '@modules/asset/queries/get-assets/get-assets.query';

@final
export class AssetInMemoryRepository
  extends InMemoryRepositoryBase<AssetEntity, AssetProps, AssetOrmEntity>
  implements AssetWriteRepositoryPort, AssetReadRepositoryPort
{
  constructor() {
    super(
      new AssetOrmMapper(AssetEntity, AssetOrmEntity),
      new Logger('AssetRepository'),
    );
  }

  findAssets(query: GetAssetsQuery): Promise<AssetEntity[]> {
    return super.findMany(query);
  }

}
