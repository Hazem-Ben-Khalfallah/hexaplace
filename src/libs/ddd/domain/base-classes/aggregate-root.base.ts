import { Entity } from '@libs/ddd/domain/base-classes/entity.base';
import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEvents } from '@libs/ddd/domain/domain-events/domain-events';

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
    DomainEvents.prepareForPublish(this);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
