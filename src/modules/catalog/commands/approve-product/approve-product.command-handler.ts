import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { NotFoundException } from '@libs/exceptions/not-found.exception';
import { ApproveProductCommand } from '@modules/catalog/commands/approve-product/approve-product.command';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
import { ProductNotFoundError } from '@modules/catalog/errors/product/product-not-found.error';
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

  private isValidOrThrow(command: ApproveProductCommand) {
    if (Guard.isEmpty(command.productId)) throw new ProductIdInvalidError();
  }

  private async save(correlationId: string, product: ProductEntity) {
    await this.unitOfWork
      .getWriteProductRepository(correlationId)
      .save(product);
  }

  private async getProductById(command: ApproveProductCommand) {
    try {
      const product = await this.productReadRepository.findOneByIdOrThrow(
        new UUID(command.productId),
      );
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) throw new ProductNotFoundError();
      throw error;
    }
  }
}
