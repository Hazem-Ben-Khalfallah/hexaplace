import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { NotFoundException } from '@libs/exceptions/not-found.exception';
import { RejectProductCommand } from '@modules/product/commands/reject-product/reject-product.command';
import { ProductIdInvalidError } from '@modules/product/errors/product/product-id-invalid.error';
import { ProductNotFoundError } from '@modules/product/errors/product/product-not-found.error';
import { ProductReadRepositoryPort } from '@modules/product/ports/product.repository.port';
import { ProductUnitOfWorkPort } from '@modules/product/ports/product.unit-of-work.port';
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
    if (Guard.isEmpty(command.productId)) throw new ProductIdInvalidError();
    try {
      const product = await this.getProductById(command);
      product.reject(command.reason);
      await this.unitOfWork
        .getWriteProductRepository(command.correlationId)
        .save(product);
    } catch (error) {
      if (error instanceof NotFoundException) throw new ProductNotFoundError();
      throw error;
    }
  }

  private async getProductById(command: RejectProductCommand) {
    return this.productReadRepository.findOneByIdOrThrow(
      new UUID(command.productId),
    );
  }
}
