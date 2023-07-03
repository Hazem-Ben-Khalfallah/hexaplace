import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { DomainEventProps } from '@src/libs/ddd/domain/domain-events/domain-event-props.base';

export class AssetInformationRequestedDomainEvent extends DomainEvent {
  readonly assetOwnerId: string;

  readonly information: string;

  constructor(props: DomainEventProps<AssetInformationRequestedDomainEvent>) {
    super(props);
    this.assetOwnerId = props.assetOwnerId;
    this.information = props.information;
  }
}
