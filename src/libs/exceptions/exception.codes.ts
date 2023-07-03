/**
 * Adding a `code` string with a custom status code for every
 * exception is a good practice, since when that exception
 * is transferred to another process `instanceof` check
 * cannot be performed anymore so a `code` string is used instead.
 * code enum types can be stored in a separate file so they
 * can be shared and reused on a receiving side
 */
export enum ExceptionCodes {
  argumentInvalid = 400,
  argumentOutOfRange = 400,
  argumentNotProvided = 400,
  badRequest = 400,
  conflict = 409,
  forbidden = 403,
  notFound = 404,
  internalException = 500,
  notImplementedException = 501,
  unprocessable = 422,
}
