import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { DeleteProductCommand } from '@modules/catalog/commands/delete-product/delete-product.command';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductAlreadyArchivedError } from '@modules/catalog/errors/product/product-already-archived.error';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
import { ProductReadRepositoryPort } from '@modules/catalog/ports/product.repository.port';
import { ProductUnitOfWorkPort } from '@modules/catalog/ports/product.unit-of-work.port';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

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
    if (this.isDraft(product)) {
      await this.delete(command.correlationId, product);
    } else if (this.isApproved(product)) {
      product.archive();
      await this.save(command.correlationId, product);
    } else if (this.isArchived(product)) {
      throw new ProductAlreadyArchivedError();
    } else {
      return;
    }
  }

  private async save(
    correlationId: string,
    product: ProductEntity,
  ): Promise<void> {
    await this.unitOfWork
      .getWriteProductRepository(correlationId)
      .save(product);
  }

  private async delete(
    correlationId: string,
    product: ProductEntity,
  ): Promise<void> {
    await this.unitOfWork
      .getWriteProductRepository(correlationId)
      .delete(product);
  }

  private async getProductById(
    command: DeleteProductCommand,
  ): Promise<ProductEntity> {
    const product = await this.productReadRepository.findOneByIdOrThrow(
      new ProductId(command.productId),
    );
    return product;
  }

  private isDraft(product: ProductEntity) {
    const { status } = product.getPropsCopy();
    return status === 'draft';
  }

  private isApproved(product: ProductEntity) {
    const { status } = product.getPropsCopy();
    return status === 'approved';
  }

  private isArchived(product: ProductEntity) {
    const { status } = product.getPropsCopy();
    return status === 'archived';
  }

  private isValidOrThrow(command: DeleteProductCommand): void {
    if (Guard.isEmpty(command.productId)) throw new ProductIdInvalidError();
  }
}
