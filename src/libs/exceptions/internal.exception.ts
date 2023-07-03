import { ExceptionBase } from '@libs/exceptions/exception.base';
import { ExceptionCodes } from '@libs/exceptions/exception.codes';

export class InternalException extends ExceptionBase {
  constructor(message = 'Internal Exception') {
    super(message);
  }

  readonly code = ExceptionCodes.internalException;
}
