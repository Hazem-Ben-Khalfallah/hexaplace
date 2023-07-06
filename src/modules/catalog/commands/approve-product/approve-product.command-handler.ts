import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { ApproveProductCommand } from '@modules/catalog/commands/approve-product/approve-product.command';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
import { ProductReadRepositoryPort } from '@modules/catalog/ports/product.repository.port';
import { ProductUnitOfWorkPort } from '@modules/catalog/ports/product.unit-of-work.port';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(ApproveProductCommand)
export class ApproveProductCommandHandler extends CommandHandlerBase {
  constructor(
    @Inject('ProductUnitOfWorkPort')
    protected readonly unitOfWork: ProductUnitOfWorkPort,
    @Inject('ProductReadRepositoryPort')
    protected readonly productReadRepository: ProductReadRepositoryPort,
  ) {
    super(unitOfWork);
  }

  async handle(command: ApproveProductCommand): Promise<void> {
    this.isValidOrThrow(command);
    const product = await this.getProductById(command);
    product.approve();
    await this.save(command.correlationId, product);
  }

  private isValidOrThrow(command: ApproveProductCommand): void {
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

  private async getProductById(
    command: ApproveProductCommand,
  ): Promise<ProductEntity> {
    const product = await this.productReadRepository.findOneByIdOrThrow(
      new ProductId(command.productId),
    );
    return product;
  }
}
