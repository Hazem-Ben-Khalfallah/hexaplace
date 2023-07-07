import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
import { ProductReadRepositoryPort } from '@modules/catalog/ports/product.repository.port';
import { ProductUnitOfWorkPort } from '@modules/catalog/ports/product.unit-of-work.port';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { DeleteOrArchiveProductCommand } from './delete-or-archive-product.command';

@CommandHandler(DeleteOrArchiveProductCommand)
export class DeleteOrArchiveProductCommandHandler extends CommandHandlerBase {
  constructor(
    @Inject('ProductUnitOfWorkPort')
    protected readonly unitOfWork: ProductUnitOfWorkPort,
    @Inject('ProductReadRepositoryPort')
    protected readonly productReadRepository: ProductReadRepositoryPort,
  ) {
    super(unitOfWork);
  }

  async handle(command: DeleteOrArchiveProductCommand): Promise<void> {
    this.isValidOrThrow(command);
    const product = await this.getProductById(command);
    product.deleteOrArchive();
    await this.delete(command.correlationId, product);
  }

  private isValidOrThrow(command: DeleteOrArchiveProductCommand) {
    if (Guard.isEmpty(command.productId)) throw new ProductIdInvalidError();
  }

  private async delete(correlationId: string, product: ProductEntity) {
    await this.unitOfWork
      .getWriteProductRepository(correlationId)
      .deleteOrArchive(product);
  }

  private async getProductById(command: DeleteOrArchiveProductCommand) {
    const product = await this.productReadRepository.findOneByIdOrThrow(
      new UUID(command.productId),
    );
    return product;
  }
}
