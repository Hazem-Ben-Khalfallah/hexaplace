import { Command } from '@libs/ddd/domain/base-classes/command.base';
import { UnitOfWork } from '@libs/ddd/domain/ports/unit-of-work.port';
import { Result } from '@libs/ddd/domain/utils/result.util';

export abstract class CommandHandlerBase<
  CommandHandlerReturnType = unknown,
  CommandHandlerError extends Error = Error,
> {
  constructor(protected readonly unitOfWork: UnitOfWork) {}

  // Forces all command handlers to implement a handle method
  abstract handle(
    command: Command,
  ): Promise<Result<CommandHandlerReturnType, CommandHandlerError> | void>;

  /**
   * Execute a command as a UnitOfWork to include
   * everything in a single atomic database transaction
   */
  execute(
    command: Command,
  ): Promise<Result<CommandHandlerReturnType, CommandHandlerError> | void> {
    return this.unitOfWork.execute(
      command.correlationId,
      async () => this.handle(command),
    );
  }
}
