import { ExceptionBase } from '@libs/exceptions/exception.base';
import { ExceptionCodes } from '@libs/exceptions/exception.codes';

export class NotImplementedException extends ExceptionBase {
  constructor(message = 'Not implemented Exception') {
    super(message);
  }

  readonly code = ExceptionCodes.notImplementedException;
}
