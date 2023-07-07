import { DomainEventHandler } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { ProductRejectedDomainEvent } from '@modules/catalog/domain/events/product-rejected.domain-event';
import { Inject } from '@nestjs/common';
import { DeleteProductDomainEvent } from '../domain/events/delete-product.domain-event';
import { ProductId } from '../domain/value-objects/product-id.value-object';
import { ProductReadRepositoryPort } from '../ports/product.repository.port';
import { ProductUnitOfWorkPort } from '../ports/product.unit-of-work.port';

export class DeleteProductDomainEventHandler extends DomainEventHandler {
  constructor(
    private readonly logger: LoggerPort,
    protected readonly unitOfWork: ProductUnitOfWorkPort,
    protected readonly productReadRepository: ProductReadRepositoryPort,
  ) {
    super(DeleteProductDomainEvent);
    logger.setContext(this.constructor.name);
  }

  async handle(event: DeleteProductDomainEvent): Promise<void> {
    const product = await this.productReadRepository.findOneByIdOrThrow(
      new ProductId(event.aggregateId),
    );
    
      await this.unitOfWork
        .getWriteProductRepository(event.correlationId)
        .delete(product);
  }
}
