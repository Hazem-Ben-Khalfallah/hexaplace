/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { CreateEntityProps } from '@libs/ddd/domain/base-classes/entity.base';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { TypeormEntityBase } from '@libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';

export type OrmEntityProps<OrmEntity> = Omit<
  OrmEntity,
  'id' | 'createdDate' | 'updatedDate'
>;

export interface EntityProps<EntityProps> {
  id: ID;
  props: EntityProps;
}

export abstract class OrmMapper<
  Entity extends AggregateRoot<unknown>,
  OrmEntity,
> {
  constructor(
    private entityConstructor: new (props: CreateEntityProps<any>) => Entity,
    private ormEntityConstructor: new (props: any) => OrmEntity,
  ) {}

  protected abstract toDomainProps(ormEntity: OrmEntity): EntityProps<unknown>;

  protected abstract toOrmProps(entity: Entity): OrmEntityProps<OrmEntity>;

  toDomainEntity(ormEntity: OrmEntity): Entity {
    const { id, props } = this.toDomainProps(ormEntity);
    const ormEntityBase: TypeormEntityBase =
      ormEntity as unknown as TypeormEntityBase;
    return new this.entityConstructor({
      id,
      props,
      createdDate: new DateVO(ormEntityBase.createdDate),
      updatedDate: new DateVO(ormEntityBase.updatedDate),
    });
  }

  toOrmEntity(entity: Entity): OrmEntity {
    const props = this.toOrmProps(entity);
    const ormEntity = new this.ormEntityConstructor({
      ...props,
      id: entity.id.value,
      createdDate: entity.createdDate.value,
      updatedDate: entity.updatedDate.value,
    });
    if (process.env.PROFILE === 'TEST') {
      const ormEntityBase: TypeormEntityBase =
        ormEntity as unknown as TypeormEntityBase;
      if (!ormEntityBase.metadata) {
        ormEntityBase.metadata = {};
      }
      ormEntityBase.metadata.test = true;
    }
    return ormEntity;
  }
}
