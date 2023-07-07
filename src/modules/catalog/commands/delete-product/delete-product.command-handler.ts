import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
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
    this.isValidOrThrow(command);
    const product = await this.getProductById(command);

    product.delete();
    // if (product.isDraft()) {
    //   await this.delete(command.correlationId, product);
    //   return;
    // }

    // product.markAsDeleted();
    this.save(command.correlationId, product);
  }

  private isValidOrThrow(command: DeleteProductCommand): void {
    if (Guard.isEmpty(command.productId)) throw new ProductIdInvalidError();
  }

  private async save(
    correlationId: string,
    product: ProductEntity,
  ): Promise<void> {
    await this.unitOfWork
      .getWriteProductRepository(correlationId)
      .save(product);
  }

  // private async delete(
  //   correlationId: string,
  //   product: ProductEntity,
  // ): Promise<void> {
  //   await this.unitOfWork
  //     .getWriteProductRepository(correlationId)
  //     .delete(product);
  // }

  private async getProductById(
    command: DeleteProductCommand,
  ): Promise<ProductEntity> {
    const product = await this.productReadRepository.findOneByIdOrThrow(
      new ProductId(command.productId),
    );
    return product;
  }
}
