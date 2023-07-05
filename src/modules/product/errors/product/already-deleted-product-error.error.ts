import { ExceptionCodes } from '@libs/exceptions/exception.codes';
import { ExceptionBase } from '@src/libs/exceptions';

export class AlreadyDeletedProductError extends ExceptionBase {
  static readonly msg = 'PRODUCT.ALREADY_DELETED_PRODUCT_ERROR';

  readonly code = ExceptionCodes.unprocessable;

  constructor(metadata?: unknown) {
    super(AlreadyDeletedProductError.msg, metadata);
  }
}
