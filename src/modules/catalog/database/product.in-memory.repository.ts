import { Logger } from '@infrastructure/logger/logger';
import { InMemoryRepositoryBase } from '@libs/ddd/infrastructure/database/base-classes/in-memory.repository.base';
import { final } from '@libs/decorators/final.decorator';
import { ProductOrmEntity } from '@modules/catalog/database/product.orm-entity';
import { ProductOrmMapper } from '@modules/catalog/database/product.orm-mapper';
import {
  ProductEntity,
  ProductProps,
} from '@modules/catalog/domain/entities/product.entity';
import {
  ProductReadRepositoryPort,
  ProductWriteRepositoryPort,
} from '@modules/catalog/ports/product.repository.port';
import { GetProductsQuery } from '@modules/catalog/queries/get-products/get-products.query';
import { ProductStatus } from '../domain/value-objects/product-status/product-status.enum';

@final
export class ProductInMemoryRepository
  extends InMemoryRepositoryBase<ProductEntity, ProductProps, ProductOrmEntity>
  implements ProductWriteRepositoryPort, ProductReadRepositoryPort
{
  constructor() {
    super(
      new ProductOrmMapper(ProductEntity, ProductOrmEntity),
      new Logger('ProductRepository'),
    );
  }

  findProducts(query: GetProductsQuery): Promise<ProductEntity[]> {
    const filteredProducts: ProductOrmEntity[] = this.savedEntities.filter(
      (productOrmEntity: ProductOrmEntity) =>
        !query.name || productOrmEntity.name.startsWith(query.name),
    );

    return Promise.resolve(this.toDomainEntities(filteredProducts));
  }
  async deleteArchive(product: ProductEntity): Promise<any> {
    if (ProductStatus.DELETED === product.getPropsCopy().status) {
      this.delete(product);
    }
    this.save(product)
  }
}
