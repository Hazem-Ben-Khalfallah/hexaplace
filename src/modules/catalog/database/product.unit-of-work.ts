import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { TypeormUnitOfWork } from '@libs/ddd/infrastructure/database/base-classes/typeorm-unit-of-work';
import { final } from '@libs/decorators/final.decorator';
import { Inject, Injectable } from '@nestjs/common';
import { ProductUnitOfWorkPort } from '../ports/product.unit-of-work.port';
import { ProductWriteRepositoryPort } from '../ports/product.repository.port';
import { ProductOrmRepository } from './product.orm-repository';
import { ProductOrmEntity } from './product.orm-entity';

@Injectable()
@final
export class ProductUnitOfWork
  extends TypeormUnitOfWork
  implements ProductUnitOfWorkPort
{
  constructor(
    @Inject('LoggerPort')
    protected readonly logger: LoggerPort,
  ) {
    super(logger);
  }

  getWriteProductRepository(correlationId: string): ProductWriteRepositoryPort {
    return new ProductOrmRepository(
      this.getOrmRepository(ProductOrmEntity, correlationId),
      this.logger,
    ).setCorrelationId(correlationId);
  }
}
