import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';

export class ProductId extends UUID {
  
  static generate(): ProductId {
    return new ProductId(UUID.generate().value);
  }
}
