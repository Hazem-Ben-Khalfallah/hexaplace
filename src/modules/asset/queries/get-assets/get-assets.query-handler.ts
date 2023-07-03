import { QueryHandlerBase } from '@libs/ddd/domain/base-classes/query-handler.base';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { AssetReadRepositoryPort } from '@modules/asset/ports/asset.repository.port';
import { GetAssetsQuery } from '@modules/asset/queries/get-assets/get-assets.query';
import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetAssetsQuery)
export class GetAssetsQueryHandler extends QueryHandlerBase {

  constructor(
    @Inject('AssetReadRepositoryPort')
    private readonly assetReadRepository: AssetReadRepositoryPort,
  ) {
    super();
  }

  /* Since this is a simple query with no additional business
     logic involved, it bypasses application's core completely
     and retrieves assets directly from a repository.
   */
     async handle(query: GetAssetsQuery): Promise<Result<AssetEntity[]>> {
      const assets = await this.assetReadRepository.findAssets(query);
      return Result.ok(assets);
    }
}
