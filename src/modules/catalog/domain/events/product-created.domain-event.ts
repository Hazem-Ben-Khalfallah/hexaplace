import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEventProps } from '@src/libs/ddd/domain/domain-events/domain-event-props.base';

// DomainEvent is a plain object with properties
export class ProductCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ProductCreatedDomainEvent>) {
    super(props);
  }
}
