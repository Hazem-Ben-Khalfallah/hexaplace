import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEventProps } from '@src/libs/ddd/domain/domain-events/domain-event-props.base';

// DomainEvent is a plain object with properties
export class ProductArchivedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<ProductArchivedDomainEvent>) {
    super(props);
  }
}
