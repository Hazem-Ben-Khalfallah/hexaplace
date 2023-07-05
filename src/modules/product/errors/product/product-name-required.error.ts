import { ArgumentInvalidException } from '@src/libs/exceptions';

export class ProductNameRequiredError extends ArgumentInvalidException {
  static readonly msg = 'PRODUCT.NAME_CAN_NOT_BE_EMPTY_ERROR';

  constructor(metadata?: unknown) {
    super(ProductNameRequiredError.msg, metadata);
  }
}
