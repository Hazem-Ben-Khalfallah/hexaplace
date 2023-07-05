import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEventProps } from '@src/libs/ddd/domain/domain-events/domain-event-props.base';

export class ProductArchivedDomainEvent extends DomainEvent {

  constructor(props: DomainEventProps<ProductArchivedDomainEvent>) {
    super(props);
  }
}
