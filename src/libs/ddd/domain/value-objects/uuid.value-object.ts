import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { v4 as uuidV4 } from 'uuid';

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

  protected validate(): void {
    //
  }
}
