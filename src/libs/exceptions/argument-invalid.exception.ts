import { ExceptionBase } from '@libs/exceptions/exception.base';
import { ExceptionCodes } from '@libs/exceptions/exception.codes';

/**
 * Used to indicate that an incorrect argument was provided to a method/function/class constructor
 *
 * @class ArgumentInvalidException
 * @extends {ExceptionBase}
 */
export class ArgumentInvalidException extends ExceptionBase {
  readonly code = ExceptionCodes.argumentInvalid;
}
