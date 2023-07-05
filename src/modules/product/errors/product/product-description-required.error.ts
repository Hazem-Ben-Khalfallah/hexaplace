import { ArgumentInvalidException } from '@src/libs/exceptions';

export class ProductDescriptionRequiredError extends ArgumentInvalidException {
  static readonly msg = 'PRODUCT.DESCRIPTION_CAN_NOT_BE_EMPTY_ERROR';

  constructor(metadata?: unknown) {
    super(ProductDescriptionRequiredError.msg, metadata);
  }
}
