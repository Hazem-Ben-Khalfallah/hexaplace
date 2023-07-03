import { Logger } from '@infrastructure/logger/logger';
import { ExceptionBase } from '@libs/exceptions';
import {
  CallHandler,
  // To avoid confusion between internal app exceptions and NestJS exceptions
  ExecutionContext,
  HttpException,
  HttpStatus,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ExceptionInterceptor implements NestInterceptor {
  private logger = new Logger(ExceptionInterceptor.name);

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ExceptionBase> {
    return next.handle().pipe(
      catchError((err) => {
        this.logger.error(
          err.message,
          err.metadata ? [err.metadata, err.stack] : [err.stack],
        );
        throw new HttpException(
          err.message || 'Internal server error',
          Number(err.code) || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
