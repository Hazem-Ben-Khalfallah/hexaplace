import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { Guard } from '@libs/ddd/domain/guard';
import { NotFoundException } from '@libs/exceptions/not-found.exception';
import { ApproveAssetCommand } from '@modules/asset/commands/approve-asset/approve-asset.command';
import { AssetIdInvalidError } from '@modules/asset/errors/asset/asset-id-invalid.error';
import { AssetNotFoundError } from '@modules/asset/errors/asset/asset-not-found.error';
import { AssetReadRepositoryPort } from '@modules/asset/ports/asset.repository.port';
import { AssetUnitOfWorkPort } from '@modules/asset/ports/asset.unit-of-work.port';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(ApproveAssetCommand)
export class ApproveAssetCommandHandler extends CommandHandlerBase {
  constructor(
    @Inject('AssetUnitOfWorkPort')
    protected readonly unitOfWork: AssetUnitOfWorkPort,
    @Inject('AssetReadRepositoryPort')
    protected readonly assetReadRepository: AssetReadRepositoryPort,
  ) {
    super(unitOfWork);
  }

  async handle(command: ApproveAssetCommand): Promise<void> {
    if (Guard.isEmpty(command.assetId)) throw new AssetIdInvalidError();
    try {
      const asset = await this.assetReadRepository.findOneByIdOrThrow(
        command.assetId,
      );
      asset.approve();
      await this.unitOfWork
        .getWriteAssetRepository(command.correlationId)
        .save(asset);
    } catch (error) {
      if (error instanceof NotFoundException) throw new AssetNotFoundError();
      throw error;
    }
  }
}
