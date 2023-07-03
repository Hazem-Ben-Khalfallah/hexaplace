import { AssetRejectdDomainEvent } from '@modules/asset/domain/events/asset-rejected.domain-event';

export interface AssetRejectdNotificationGatewayPort {
  notify(event: AssetRejectdDomainEvent): Promise<void>;
}
