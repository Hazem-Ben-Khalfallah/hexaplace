import { ProductUnitOfWork } from '@modules/product/database/product.unit-of-work';
import { ClassProvider } from '@nestjs/common';
import { ProductOrmRepository } from './database/product.orm-repository';

export const productUnitOfWorkSingletonProvider: ClassProvider = {
  provide: 'ProductUnitOfWorkPort',
  useClass: ProductUnitOfWork,
};

export const productReadRepositoryProvider: ClassProvider = {
  provide: 'ProductReadRepositoryPort',
  useClass: ProductOrmRepository,
};

export const productWriteRepositoryProvider: ClassProvider = {
  provide: 'ProductWriteRepositoryPort',
  useClass: ProductOrmRepository,
};
