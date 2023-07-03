import { AssetApprovedDomainEvent } from '@modules/asset/domain/events/asset-approved.domain-event';
import { AssetApprovedNotificationGatewayPort } from '@modules/asset/ports/asset-approved-notification.gateway.port';

export class AssetApprovedNotificationInMemoryGateway
  implements AssetApprovedNotificationGatewayPort
{
  notifications: AssetApprovedDomainEvent[] = [];

  async notify(event: AssetApprovedDomainEvent): Promise<void> {
    this.notifications.push(event);
    await Promise.resolve();
  }

  hasBeenNotifiedOnce(assetId: string): boolean {
    return (
      this.notifications.filter(
        (event: AssetApprovedDomainEvent) =>
          event.aggregateId === assetId
      ).length === 1
    );
  }
}
