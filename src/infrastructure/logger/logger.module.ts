import { Logger } from '@infrastructure/logger/logger';
import { ClassProvider, Module, Scope } from '@nestjs/common';

const loggerProvider: ClassProvider = {
  provide: 'LoggerPort',
  useClass: Logger,
  scope: Scope.TRANSIENT,
};

@Module({
  imports: [],
  providers: [loggerProvider],
  exports: ['LoggerPort'],
})
export class LoggerModule {}
