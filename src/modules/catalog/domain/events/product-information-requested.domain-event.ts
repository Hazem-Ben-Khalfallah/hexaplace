import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEventProps } from '@src/libs/ddd/domain/domain-events/domain-event-props.base';

export class ProductInformationRequestedDomainEvent extends DomainEvent {
  readonly productOwnerId: string;

  readonly information: string;

  constructor(props: DomainEventProps<ProductInformationRequestedDomainEvent>) {
    super(props);
    this.productOwnerId = props.productOwnerId;
    this.information = props.information;
  }
}
