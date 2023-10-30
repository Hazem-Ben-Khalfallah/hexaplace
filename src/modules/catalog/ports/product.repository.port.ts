import {
  ReadRepositoryPort,
  WriteRepositoryPort,
} from '@libs/ddd/domain/ports/repository.ports';
import {
  ProductEntity,
  ProductProps,
} from '@modules/catalog/domain/entities/product.entity';
import { GetProductsQuery } from '@modules/catalog/queries/get-products/get-products.query';
import { ProductId } from '../domain/value-objects/product-id.value-object';

/* export type ProductWriteRepositoryPort = WriteRepositoryPort<ProductEntity>; */

export interface ProductReadRepositoryPort
  extends ReadRepositoryPort<ProductEntity, ProductProps> {
  findOneByIdOrThrow(id: ProductId): Promise<ProductEntity>;
  findProducts(query: GetProductsQuery): Promise<ProductEntity[]>;
}

export interface ProductWriteRepositoryPort
  extends WriteRepositoryPort<ProductEntity> {
    deleteArchive(product: ProductEntity): Promise<void>;
}
