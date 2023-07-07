import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { ProductReadRepositoryPort } from '@modules/catalog/ports/product.repository.port';
import { ProductUnitOfWorkPort } from '@modules/catalog/ports/product.unit-of-work.port';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';

@CommandHandler(DeleteProductCommand)
export class DeleteProductCommandHandler extends CommandHandlerBase {
  constructor(
    @Inject('ProductUnitOfWorkPort')
    protected readonly unitOfWork: ProductUnitOfWorkPort,
    @Inject('ProductReadRepositoryPort')
    protected readonly productReadRepository: ProductReadRepositoryPort,
  ) {
    super(unitOfWork);
  }

  async handle(command: DeleteProductCommand): Promise<void> {
    const product = await this.getProductById(command);

    if (product.status === ProductStatus.DRAFT) {
      await this.delete(command.correlationId, product);
      return;
    }

    if (product.status === ProductStatus.APPROVED) {
      product.markAsDeleted();
      await this.save(command.correlationId, product);
      return;
    }

    throw new Error('status should be in draft or approved');
  }

  private async delete(
    correlationId: string,
    product: ProductEntity,
  ): Promise<void> {
    this.unitOfWork.getWriteProductRepository(correlationId).delete(product);
  }

  private async save(
    correlationId: string,
    product: ProductEntity,
  ): Promise<void> {
    await this.unitOfWork
      .getWriteProductRepository(correlationId)
      .save(product);
  }

  private async getProductById(
    command: DeleteProductCommand,
  ): Promise<ProductEntity> {
    const product = await this.productReadRepository.findOneByIdOrThrow(
      new ProductId(command.id),
    );
    return product;
  }
}
