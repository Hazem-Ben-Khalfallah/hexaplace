import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { NotFoundException } from '@libs/exceptions/not-found.exception';
import { RejectAssetCommand } from '@modules/asset/commands/reject-asset/reject-asset.command';
import { AssetIdInvalidError } from '@modules/asset/errors/asset/asset-id-invalid.error';
import { AssetNotFoundError } from '@modules/asset/errors/asset/asset-not-found.error';
import { AssetReadRepositoryPort } from '@modules/asset/ports/asset.repository.port';
import { AssetUnitOfWorkPort } from '@modules/asset/ports/asset.unit-of-work.port';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(RejectAssetCommand)
export class RejectAssetCommandHandler extends CommandHandlerBase {
  constructor(
    @Inject('AssetUnitOfWorkPort')
    protected readonly unitOfWork: AssetUnitOfWorkPort,
    @Inject('AssetReadRepositoryPort')
    protected readonly assetReadRepository: AssetReadRepositoryPort,
  ) {
    super(unitOfWork);
  }

  async handle(command: RejectAssetCommand): Promise<void> {
    if (Guard.isEmpty(command.assetId)) throw new AssetIdInvalidError();
    try {
      const asset = await this.getAssetById(command);
      asset.reject(command.reason);
      await this.unitOfWork
        .getWriteAssetRepository(command.correlationId)
        .save(asset);
    } catch (error) {
      if (error instanceof NotFoundException) throw new AssetNotFoundError();
      throw error;
    }
  }

  private async getAssetById(command: RejectAssetCommand) {
    return this.assetReadRepository.findOneByIdOrThrow(
      new UUID(command.assetId),
    );
  }
}
