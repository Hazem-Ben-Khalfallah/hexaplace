import { ExceptionBase } from '@libs/exceptions/exception.base';
import { ExceptionCodes } from '@libs/exceptions/exception.codes';

export class ForbiddenException extends ExceptionBase {
  readonly code = ExceptionCodes.forbidden;
}
