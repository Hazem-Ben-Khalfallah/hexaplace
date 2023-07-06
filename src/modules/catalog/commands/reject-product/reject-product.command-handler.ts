import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { RejectProductCommand } from '@modules/catalog/commands/reject-product/reject-product.command';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductId } from '@modules/catalog/domain/value-objects/product-id.value-object';
import { ProductIdInvalidError } from '@modules/catalog/errors/product/product-id-invalid.error';
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
    const product = await this.productReadRepository.findOneByIdOrThrow(
      new ProductId(command.productId),
    );
    return product;
  }

  private async save(correlationId: string, product: ProductEntity) {
    await this.unitOfWork
      .getWriteProductRepository(correlationId)
      .save(product);
  }
}
