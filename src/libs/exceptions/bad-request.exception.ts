import { ExceptionBase } from '@libs/exceptions/exception.base';
import { ExceptionCodes } from '@libs/exceptions/exception.codes';

/**
 * Used to indicate that an invalid request to ask from the domain
 *
 * @class BadRequestException
 * @extends {ExceptionBase}
 */
export class BadRequestException extends ExceptionBase {
  readonly code = ExceptionCodes.badRequest;
}
