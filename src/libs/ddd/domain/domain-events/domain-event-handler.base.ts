import {
  DomainEvent,
  DomainEventClass,
  DomainEvents,
} from '@libs/ddd/domain/domain-events';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';

export abstract class DomainEventHandler {
  readonly id: UUID;

  constructor(private readonly event: DomainEventClass) {
    this.id = UUID.generate();
  }

  abstract handle(event: DomainEvent): Promise<void>;

  public listen(): void {
    DomainEvents.subscribe(this.event, this);
  }

  public unsubscribe(): void {
    DomainEvents.unsubscribe(this.event, this);
  }
}
