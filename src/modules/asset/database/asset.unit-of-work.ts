import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { TypeormUnitOfWork } from '@libs/ddd/infrastructure/database/base-classes/typeorm-unit-of-work';
import { final } from '@libs/decorators/final.decorator';
import { Inject, Injectable } from '@nestjs/common';
import { AssetUnitOfWorkPort } from '../ports/asset.unit-of-work.port';
import { AssetWriteRepositoryPort } from '../ports/asset.repository.port';
import { AssetOrmRepository } from './asset.orm-repository';
import { AssetOrmEntity } from './asset.orm-entity';

@Injectable()
@final
export class AssetUnitOfWork
  extends TypeormUnitOfWork
  implements AssetUnitOfWorkPort
{
  constructor(
    @Inject('LoggerPort')
    protected readonly logger: LoggerPort,
  ) {
    super(logger);
  }

  getWriteAssetRepository(correlationId: string): AssetWriteRepositoryPort {
    return new AssetOrmRepository(
      this.getOrmRepository(AssetOrmEntity, correlationId),
      this.logger,
    ).setCorrelationId(correlationId);
  }
}
