import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { NotFoundException } from '@libs/exceptions/not-found.exception';
import { RejectProductCommand } from '@modules/catalog/commands/reject-product/reject-product.command';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
import { ProductNotFoundError } from '@modules/catalog/errors/product/product-not-found.error';
import { ProductReadRepositoryPort } from '@modules/catalog/ports/product.repository.port';
import { ProductUnitOfWorkPort } from '@modules/catalog/ports/product.unit-of-work.port';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(RejectProductCommand)
export class RejectProductCommandHandler extends CommandHandlerBase {
  constructor(
    @Inject('ProductUnitOfWorkPort')
    protected readonly unitOfWork: ProductUnitOfWorkPort,
    @Inject('ProductReadRepositoryPort')
    protected readonly productReadRepository: ProductReadRepositoryPort,
  ) {
    super(unitOfWork);
  }

  async handle(command: RejectProductCommand): Promise<void> {
    this.isValidOrThrow(command);
    const product = await this.getProductById(command);
    product.reject(command.reason);
    await this.save(command.correlationId, product);
  }

  private isValidOrThrow(command: RejectProductCommand) {
    if (Guard.isEmpty(command.productId)) throw new ProductIdInvalidError();
  }

  private async getProductById(command: RejectProductCommand) {
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

  private async save(correlationId: string, product: ProductEntity) {
    await this.unitOfWork
      .getWriteProductRepository(correlationId)
      .save(product);
  }
}
