import { UnitOfWork } from '@libs/ddd/domain/ports/unit-of-work.port';
import { ProductWriteRepositoryPort } from '@modules/catalog/ports/product.repository.port';

export interface ProductUnitOfWorkPort extends UnitOfWork {
  getWriteProductRepository(correlationId: string): ProductWriteRepositoryPort;
}
