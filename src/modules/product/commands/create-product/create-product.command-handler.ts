import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { CreateProductCommand } from '@modules/product/commands/create-product/create-product.command';
import { ProductEntity } from '@modules/product/domain/entities/product.entity';
import { ProductUnitOfWorkPort } from '@modules/product/ports/product.unit-of-work.port';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler extends CommandHandlerBase {
  constructor(
    @Inject('ProductUnitOfWorkPort')
    protected readonly unitOfWork: ProductUnitOfWorkPort,
  ) {
    super(unitOfWork);
  }

  async handle(command: CreateProductCommand): Promise<void> {
    const product = ProductEntity.create({
      ...command,
    });

    await this.unitOfWork
      .getWriteProductRepository(command.correlationId)
      .save(product);
  }
}
