import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEventProps } from '@src/libs/ddd/domain/domain-events/domain-event-props.base';

export class AssetApprovedDomainEvent extends DomainEvent {

  constructor(props: DomainEventProps<AssetApprovedDomainEvent>) {
    super(props);
  }
}
