import { ProductRejectdDomainEvent } from '@modules/product/domain/events/product-rejected.domain-event';
import { ProductRejectdNotificationGatewayPort } from '@modules/product/ports/product-rejected-notification.gateway.port';

export class ProductRejectdNotificationInMemoryGateway
  implements ProductRejectdNotificationGatewayPort
{
  notifications: ProductRejectdDomainEvent[] = [];

  async notify(event: ProductRejectdDomainEvent): Promise<void> {
    this.notifications.push(event);
    await Promise.resolve();
  }

  hasBeenNotifiedOnce(productId: string): boolean {
    return (
      this.notifications.filter(
        (event: ProductRejectdDomainEvent) => event.aggregateId === productId,
      ).length === 1
    );
  }
}
