import { UnitOfWork } from '@libs/ddd/domain/ports/unit-of-work.port';

export abstract class InMemoryUnitOfWork implements UnitOfWork {
  execute<T>(
    correlationId: string,
    callback: () => Promise<T>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: unknown,
  ): Promise<T> {
    return callback();
  }
}
