import { QueryHandlerBase } from '@libs/ddd/domain/base-classes/query-handler.base';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { AssetReadRepositoryPort } from '@modules/asset/ports/asset.repository.port';
import { GetAssetQuery } from '@modules/asset/queries/get-asset/get-asset.query';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetAssetQuery)
export class GetAssetQueryHandler extends QueryHandlerBase {
  constructor(
    @Inject('AssetReadRepositoryPort')
    private readonly assetRepo: AssetReadRepositoryPort,
  ) {
    super();
  }

  /* Since this is a simple query with no additional business
     logic involved, it bypasses application's core completely 
     and retrieves assets directly from a repository.
   */
  async handle(query: GetAssetQuery): Promise<Result<AssetEntity>> {
    const asset = await this.assetRepo.findOneByIdOrThrow(query.id);
    return Result.ok(asset);
  }
}
