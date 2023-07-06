import { ArgumentInvalidException } from '@exceptions';
import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { v4 as uuidV4, validate as isValidUUID } from 'uuid';
import { DomainPrimitive } from '../base-classes/value-object.base';

export class UUID extends ID {
  /**
   * Returns new ID instance with randomly generated ID value
   * @static
   * @return {*}  {ID}
   * @memberof ID
   */
  static generate(): UUID {
    return new UUID(uuidV4());
  }

  public validate({ value }: DomainPrimitive<string>): void {
    if (!isValidUUID(value)) {
      throw new ArgumentInvalidException('Invalid UUID format');
    }
  }
}
