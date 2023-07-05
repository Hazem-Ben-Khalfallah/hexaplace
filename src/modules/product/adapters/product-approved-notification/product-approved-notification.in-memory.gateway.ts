import { ProductApprovedDomainEvent } from '@modules/product/domain/events/product-approved.domain-event';
import { ProductApprovedNotificationGatewayPort } from '@modules/product/ports/product-approved-notification.gateway.port';

export class ProductApprovedNotificationInMemoryGateway
  implements ProductApprovedNotificationGatewayPort
{
  notifications: ProductApprovedDomainEvent[] = [];

  async notify(event: ProductApprovedDomainEvent): Promise<void> {
    this.notifications.push(event);
    await Promise.resolve();
  }

  hasBeenNotifiedOnce(productId: string): boolean {
    return (
      this.notifications.filter(
        (event: ProductApprovedDomainEvent) =>
          event.aggregateId === productId
      ).length === 1
    );
  }
}
