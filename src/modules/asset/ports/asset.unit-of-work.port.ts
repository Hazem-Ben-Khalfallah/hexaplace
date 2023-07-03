import { UnitOfWork } from '@libs/ddd/domain/ports/unit-of-work.port';
import { AssetWriteRepositoryPort } from '@modules/asset/ports/asset.repository.port';

export interface AssetUnitOfWorkPort extends UnitOfWork {
  getWriteAssetRepository(correlationId: string): AssetWriteRepositoryPort;
}
