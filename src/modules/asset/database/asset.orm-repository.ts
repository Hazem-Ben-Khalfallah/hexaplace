import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { QueryParams } from '@libs/ddd/domain/ports/repository.ports';
import {
  TypeormRepositoryBase,
  WhereCondition,
} from '@libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { final } from '@libs/decorators/final.decorator';
import { removeUndefinedProps } from '@libs/utils/remove-undefined-props.util';
import { AssetOrmEntity } from '@modules/asset/database/asset.orm-entity';
import { AssetOrmMapper } from '@modules/asset/database/asset.orm-mapper';
import {
  AssetEntity,
  AssetProps,
} from '@modules/asset/domain/entities/asset.entity';
import { AssetReadRepositoryPort } from '@modules/asset/ports/asset.repository.port';
import { GetAssetsQuery } from '@modules/asset/queries/get-assets/get-assets.query';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
@final
export class AssetOrmRepository
  extends TypeormRepositoryBase<AssetEntity, AssetProps, AssetOrmEntity>
  implements AssetReadRepositoryPort
{
  protected relations: string[] = [];

  constructor(
    @InjectRepository(AssetOrmEntity)
    private readonly assetRepository: Repository<AssetOrmEntity>,
    @Inject('LoggerPort')
    protected readonly logger: LoggerPort,
  ) {
    super(
      assetRepository,
      new AssetOrmMapper(AssetEntity, AssetOrmEntity),
      logger,
    );
  }

  async findOneByIdOrThrow(id: string): Promise<AssetEntity> {
    return super.findOneByIdOrThrow(id);
  }

  async findAssets(query: GetAssetsQuery): Promise<AssetEntity[]> {
    const where: QueryParams<AssetOrmEntity> = removeUndefinedProps(query);
    const assets = await this.repository.find({ where });
    return assets.map((asset) => this.mapper.toDomainEntity(asset));
  }

  // Used to construct a query
  protected prepareQuery(
    params: QueryParams<AssetProps>,
  ): WhereCondition<AssetOrmEntity> {
    const where: QueryParams<AssetOrmEntity> = {};
    if (params.name) {
      where.name = params.name;
    }
    return where;
  }
}
