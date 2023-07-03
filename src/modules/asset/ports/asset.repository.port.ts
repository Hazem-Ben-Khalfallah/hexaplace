import {
  ReadRepositoryPort,
  WriteRepositoryPort,
} from '@libs/ddd/domain/ports/repository.ports';
import {
  AssetEntity,
  AssetProps,
} from '@modules/asset/domain/entities/asset.entity';
import { GetAssetsQuery } from '@modules/asset/queries/get-assets/get-assets.query';

export type AssetWriteRepositoryPort = WriteRepositoryPort<AssetEntity>;

export interface AssetReadRepositoryPort
  extends ReadRepositoryPort<AssetEntity, AssetProps> {
  findOneByIdOrThrow(id: string): Promise<AssetEntity>;
  findAssets(query: GetAssetsQuery): Promise<AssetEntity[]>;
}
