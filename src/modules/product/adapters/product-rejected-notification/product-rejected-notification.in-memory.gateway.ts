import { ProductRejectedDomainEvent } from '@modules/product/domain/events/product-rejected.domain-event';
import { ProductRejectdNotificationGatewayPort as ProductRejectedNotificationGatewayPort } from '@modules/product/ports/product-rejected-notification.gateway.port';

export class ProductRejectedNotificationInMemoryGateway
  implements ProductRejectedNotificationGatewayPort
{
  notifications: ProductRejectedDomainEvent[] = [];

  async notify(event: ProductRejectedDomainEvent): Promise<void> {
    this.notifications.push(event);
    await Promise.resolve();
  }

  hasBeenNotifiedOnce(productId: string): boolean {
    return (
      this.notifications.filter(
        (event: ProductRejectedDomainEvent) => event.aggregateId === productId,
      ).length === 1
    );
  }
}
