/* eslint-disable default-param-last */
import { ExceptionBase } from '@libs/exceptions/exception.base';
import { ExceptionCodes } from '@libs/exceptions/exception.codes';

export class NotFoundException extends ExceptionBase {
  constructor(message = 'Not found', metadata?: unknown) {
    super(message, metadata);
  }

  readonly code = ExceptionCodes.notFound;
}
