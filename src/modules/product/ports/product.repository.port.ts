import {
  ReadRepositoryPort,
  WriteRepositoryPort,
} from '@libs/ddd/domain/ports/repository.ports';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import {
  ProductEntity,
  ProductProps,
} from '@modules/product/domain/entities/product.entity';
import { GetProductsQuery } from '@modules/product/queries/get-products/get-products.query';

export type ProductWriteRepositoryPort = WriteRepositoryPort<ProductEntity>;

export interface ProductReadRepositoryPort
  extends ReadRepositoryPort<ProductEntity, ProductProps> {
  findOneByIdOrThrow(id: UUID): Promise<ProductEntity>;
  findProducts(query: GetProductsQuery): Promise<ProductEntity[]>;
}
