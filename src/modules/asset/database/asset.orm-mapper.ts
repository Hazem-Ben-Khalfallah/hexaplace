import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import {
  EntityProps,
  OrmEntityProps,
  OrmMapper,
} from '@libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { AssetOrmEntity } from '@modules/asset/database/asset.orm-entity';
import {
  AssetEntity,
  AssetProps,
} from '@modules/asset/domain/entities/asset.entity';
import { toEnum } from '@modules/asset/domain/value-objects/asset-status/asset-status.enum';

export class AssetOrmMapper extends OrmMapper<AssetEntity, AssetOrmEntity> {
  protected toOrmProps(entity: AssetEntity): OrmEntityProps<AssetOrmEntity> {
    const props = entity.getPropsCopy();

    return {
      name: props.name,
      description: props.description,
      status: props.status,
    };
  }

  protected toDomainProps(ormEntity: AssetOrmEntity): EntityProps<AssetProps> {
    const id = new UUID(ormEntity.id);
    const props: AssetProps = {
      name: ormEntity.name,
      description: ormEntity.description,
      status: toEnum(ormEntity.status),
    };
    return { id, props };
  }
}
