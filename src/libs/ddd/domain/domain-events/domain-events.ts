import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import {
  DomainEvent,
  DomainEventHandler,
} from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { ID } from '@libs/ddd/domain/value-objects/id.value-object';
import { final } from '@libs/decorators/final.decorator';

type EventName = string;

export type DomainEventClass = new (...args: never[]) => DomainEvent;

@final
export class DomainEvents {
  private static subscribers: Map<EventName, DomainEventHandler[]> = new Map();

  private static aggregates: AggregateRoot<unknown>[] = [];

  public static subscribe<T extends DomainEventHandler>(
    event: DomainEventClass,
    eventHandler: T,
  ): void {
    const eventName: EventName = event.name;
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }
    this.subscribers.get(eventName)?.push(eventHandler);
  }

  public static unsubscribe<T extends DomainEventHandler>(
    event: DomainEventClass,
    eventHandler: T,
  ): void {
    const eventName: EventName = event.name;
    if (this.subscribers.has(eventName)) {
      const handlers = this.subscribers.get(eventName) as DomainEventHandler[];
      this.subscribers.set(
        eventName,
        handlers.filter((handler) => handler.id !== eventHandler.id),
      );
    }
  }

  public static prepareForPublish(aggregate: AggregateRoot<unknown>): void {
    const aggregateFound = !!this.findAggregateByID(aggregate.id);
    if (!aggregateFound) {
      this.aggregates.push(aggregate);
    }
  }

  public static async publishEvents(
    id: ID,
    logger: LoggerPort,
    correlationId?: string,
  ): Promise<void> {
    const aggregate = this.findAggregateByID(id);

    if (aggregate) {
      logger.debug(
        `[${aggregate.domainEvents.map(
          (event) => event.constructor.name,
        )}] published ${aggregate.id.value}`,
      );
      await Promise.all(
        aggregate.domainEvents.map((event: DomainEvent) => {
          if (correlationId && !event.correlationId) {
            // eslint-disable-next-line no-param-reassign
            event.correlationId = correlationId;
          }
          return this.publish(event, logger);
        }),
      );
      aggregate.clearEvents();
      this.removeAggregateFromPublishList(aggregate);
    }
  }

  private static findAggregateByID(id: ID): AggregateRoot<unknown> | undefined {
    return this.aggregates.find((aggregate) => aggregate.id.equals(id));
  }

  private static removeAggregateFromPublishList(
    aggregate: AggregateRoot<unknown>,
  ): void {
    const index = this.aggregates.findIndex((a) => a.equals(aggregate));
    this.aggregates.splice(index, 1);
  }

  private static async publish(
    event: DomainEvent,
    logger: LoggerPort,
  ): Promise<void> {
    const eventName: string = event.constructor.name;

    if (this.subscribers.has(eventName)) {
      const handlers: DomainEventHandler[] =
        this.subscribers.get(eventName) || [];
      await Promise.all(
        handlers.map((handler) => {
          logger.debug(
            `[${handler.constructor.name}] handling ${event.constructor.name} ${event.aggregateId}`,
          );
          return handler.handle(event);
        }),
      );
    }
  }
}
