import { ExceptionCodes } from '@libs/exceptions/exception.codes';
import { ExceptionBase } from '@src/libs/exceptions';

export class ProductAlreadyArchivedError extends ExceptionBase {
  static readonly msg = 'PRODUCT.ALREADY_ARCHIVED_ERROR';

  readonly code = ExceptionCodes.unprocessable;

  constructor(metadata?: unknown) {
    super(ProductAlreadyArchivedError.msg, metadata);
  }
}
