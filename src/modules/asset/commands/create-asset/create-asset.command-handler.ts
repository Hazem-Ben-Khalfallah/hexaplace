import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { CreateAssetCommand } from '@modules/asset/commands/create-asset/create-asset.command';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { AssetUnitOfWorkPort } from '@modules/asset/ports/asset.unit-of-work.port';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateAssetCommand)
export class CreateAssetCommandHandler extends CommandHandlerBase {
  constructor(
    @Inject('AssetUnitOfWorkPort')
    protected readonly unitOfWork: AssetUnitOfWorkPort,
  ) {
    super(unitOfWork);
  }

  async handle(command: CreateAssetCommand): Promise<void> {
    const asset = AssetEntity.create({
      ...command,
    });

    await this.unitOfWork
      .getWriteAssetRepository(command.correlationId)
      .save(asset);
  }
}
