import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { ProductOrmEntity } from '@modules/catalog/database/product.orm-entity';
import {
  ProductEntity,
  ProductProps,
} from '@modules/catalog/domain/entities/product.entity';
import { toEnum } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';

export class ProductOrmMapper extends OrmMapper<ProductEntity, ProductOrmEntity> {
  protected toOrmProps(entity: ProductEntity): OrmEntityProps<ProductOrmEntity> {
    const props = entity.getPropsCopy();

    return {
      name: props.name,
      description: props.description,
      status: props.status,
    };
  }

  protected toDomainProps(ormEntity: ProductOrmEntity): EntityProps<ProductProps> {
    const id = new UUID(ormEntity.id);
    const props: ProductProps = {
      name: ormEntity.name,
      description: ormEntity.description,
      status: toEnum(ormEntity.status),
    };
    return { id, props };
  }
}
