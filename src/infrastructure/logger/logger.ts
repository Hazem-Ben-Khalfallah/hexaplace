import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { Injectable, Logger as NestLogger } from '@nestjs/common';

@Injectable()
export class Logger extends NestLogger implements LoggerPort {
  constructor(context?: string) {
    super(context || '');
  }

  setContext(context: string): void {
    this.context = context;
  }
}
