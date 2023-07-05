import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { NotFoundException } from '@libs/exceptions/not-found.exception';
import { ApproveProductCommand } from '@modules/product/commands/approve-product/approve-product.command';
import { ProductIdInvalidError } from '@modules/product/errors/product/product-id-invalid.error';
import { ProductNotFoundError } from '@modules/product/errors/product/product-not-found.error';
import { ProductReadRepositoryPort } from '@modules/product/ports/product.repository.port';
import { ProductUnitOfWorkPort } from '@modules/product/ports/product.unit-of-work.port';
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
    if (Guard.isEmpty(command.productId)) throw new ProductIdInvalidError();
    try {
      const product = await this.productReadRepository.findOneByIdOrThrow(
        new UUID(command.productId),
      );
      product.approve();
      await this.unitOfWork
        .getWriteProductRepository(command.correlationId)
        .save(product);
    } catch (error) {
      if (error instanceof NotFoundException) throw new ProductNotFoundError();
      throw error;
    }
  }
}
