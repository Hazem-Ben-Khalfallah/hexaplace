import { convertPropsToObject } from '@libs/ddd/domain/utils';
import { DateVO } from '@libs/ddd/domain/value-objects/date.value-object';
import { ID } from '@libs/ddd/domain/value-objects/id.value-object';

export interface BaseEntityProps {
  id: ID;
  createdDate: DateVO;
  updatedDate: DateVO;
}

export interface CreateEntityProps<T> {
  id: ID;
  props: T;
  createdDate?: DateVO;
  updatedDate?: DateVO;
}

export abstract class Entity<EntityProps> {
  constructor({
    id,
    createdDate,
    updatedDate,
    props,
  }: CreateEntityProps<EntityProps>) {
    this.setId(id);
    const now = DateVO.now();
    this._createdDate = createdDate || now;
    this._updatedDate = updatedDate || now;
    this.props = props;
    this.validate();
  }

  protected readonly props: EntityProps;

  // ID is set in the entity to support different ID types
  protected abstract _id: ID;

  private readonly _createdDate: DateVO;

  private _updatedDate: DateVO;

  get id(): ID {
    return this._id;
  }

  private setId(id: ID): void {
    this._id = id;
  }

  get createdDate(): DateVO {
    return this._createdDate;
  }

  get updatedDate(): DateVO {
    return this._updatedDate;
  }

  static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  /**
   *  Check if two entities are the same Entity. Checks using ID field.
   * @param object Entity
   */
  public equals(object?: Entity<EntityProps>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!Entity.isEntity(object)) {
      return false;
    }

    return this.id ? this.id.equals(object.id) : false;
  }

  /**
   * Returns current **copy** of entity's props.
   * Modifying entity's state won't change previously created
   * copy returned by this method since it doesn't return a reference.
   * If a reference to a specific property is needed create a getter in parent class.
   *
   * @return {*}  {Props & EntityProps}
   * @memberof Entity
   */
  public getPropsCopy(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdDate: this._createdDate,
      updatedDate: this._updatedDate,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  /**
   * Convert an Entity and all sub-entities/Value Objects it
   * contains to a plain object with primitive types. Can be
   * useful when logging an entity during testing/debugging
   */
  public toObject(): unknown {
    const plainProps = convertPropsToObject(this.props);

    const result = {
      id: this._id.value,
      createdAt: this._createdDate.value,
      updatedAt: this._updatedDate.value,
      ...plainProps,
    };
    return Object.freeze(result);
  }

  /**
   * Validate invariant
   */
  public abstract validate(): void;
}
