import { AssetUnitOfWork } from '@modules/asset/database/asset.unit-of-work';
import { ClassProvider } from '@nestjs/common';
import { AssetOrmRepository } from './database/asset.orm-repository';

export const assetUnitOfWorkSingletonProvider: ClassProvider = {
  provide: 'AssetUnitOfWorkPort',
  useClass: AssetUnitOfWork,
};

export const assetReadRepositoryProvider: ClassProvider = {
  provide: 'AssetReadRepositoryPort',
  useClass: AssetOrmRepository,
};

export const assetWriteRepositoryProvider: ClassProvider = {
  provide: 'AssetWriteRepositoryPort',
  useClass: AssetOrmRepository,
};
