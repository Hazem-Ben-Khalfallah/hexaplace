import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEventProps } from '@src/libs/ddd/domain/domain-events/domain-event-props.base';

export class ProductDeletedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ProductDeletedDomainEvent>) {
    super(props);
  }
}
