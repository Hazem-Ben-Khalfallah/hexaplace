import { AssetApprovedDomainEvent } from '@modules/asset/domain/events/asset-approved.domain-event';

export interface AssetApprovedNotificationGatewayPort {
  notify(event: AssetApprovedDomainEvent): Promise<void>;
}
