export interface UnitOfWork {
  execute<T>(
    correlationId: string,
    callback: () => Promise<T>,
    options?: unknown,
  ): Promise<T>;
}
