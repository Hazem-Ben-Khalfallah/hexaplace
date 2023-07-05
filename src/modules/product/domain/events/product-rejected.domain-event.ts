import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEventProps } from '@src/libs/ddd/domain/domain-events/domain-event-props.base';

export class ProductRejectdDomainEvent extends DomainEvent {
  readonly reason: string;

  constructor(props: DomainEventProps<ProductRejectdDomainEvent>) {
    super(props);
    this.reason = props.reason;
  }
}
