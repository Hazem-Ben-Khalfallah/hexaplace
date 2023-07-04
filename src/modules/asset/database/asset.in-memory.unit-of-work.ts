import { InMemoryUnitOfWork } from '@libs/ddd/infrastructure/database/base-classes/in-memory-unit-of-work';
import { final } from '@libs/decorators/final.decorator';
import { AssetInMemoryRepository } from '@modules/asset/database/asset.in-memory.repository';
import {
AssetReadRepositoryPort,
AssetWriteRepositoryPort
} from '@modules/asset/ports/asset.repository.port';
import { AssetUnitOfWorkPort } from '@modules/asset/ports/asset.unit-of-work.port';

@final
export class AssetInMemoryUnitOfWork
  extends InMemoryUnitOfWork
  implements AssetUnitOfWorkPort
{

  assetInMemoryRepository = new AssetInMemoryRepository();

  getWriteAssetRepository(correlationId: string): AssetWriteRepositoryPort {
    return this.assetInMemoryRepository.setCorrelationId(correlationId);
  }

  getReadAssetRepository(): AssetReadRepositoryPort {
    return this.assetInMemoryRepository;
  }
}
