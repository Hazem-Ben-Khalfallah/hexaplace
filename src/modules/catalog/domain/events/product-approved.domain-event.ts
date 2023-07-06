import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEventProps } from '@src/libs/ddd/domain/domain-events/domain-event-props.base';

export class ProductApprovedDomainEvent extends DomainEvent {

  constructor(props: DomainEventProps<ProductApprovedDomainEvent>) {
    super(props);
  }
}
