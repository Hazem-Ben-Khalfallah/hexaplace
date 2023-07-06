import { ArgumentInvalidException } from '@src/libs/exceptions';

export class ProductIdInvalidError extends ArgumentInvalidException {
  static readonly msg = 'PRODUCT.ID_INVALID';

  constructor(metadata?: unknown) {
    super(ProductIdInvalidError.msg, metadata);
  }
}
