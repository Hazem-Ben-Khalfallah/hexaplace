import { AssetRejectdDomainEvent } from '@modules/asset/domain/events/asset-rejected.domain-event';
import { AssetRejectdNotificationGatewayPort } from '@modules/asset/ports/asset-rejected-notification.gateway.port';

export class AssetRejectdNotificationInMemoryGateway
  implements AssetRejectdNotificationGatewayPort
{
  notifications: AssetRejectdDomainEvent[] = [];

  async notify(event: AssetRejectdDomainEvent): Promise<void> {
    this.notifications.push(event);
    await Promise.resolve();
  }

  hasBeenNotifiedOnce(assetId: string): boolean {
    return (
      this.notifications.filter(
        (event: AssetRejectdDomainEvent) => event.aggregateId === assetId,
      ).length === 1
    );
  }
}
