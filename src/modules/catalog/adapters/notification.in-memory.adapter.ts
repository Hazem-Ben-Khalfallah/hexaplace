import { DomainEvent } from '@libs/ddd/domain/domain-events';
import { ProductApprovedNotificationPort } from '@modules/catalog/ports/product-approved-notification.port';
import { ProductRejectedNotificationPort } from '../ports/product-rejected-notification.port';

export class NotificationInMemoryGateway
  implements ProductApprovedNotificationPort, ProductRejectedNotificationPort
{
  notifications: DomainEvent[] = [];

  async send(event: DomainEvent): Promise<void> {
    this.notifications.push(event);
    await Promise.resolve();
  }

  hasBeenNotifiedOnce(productId: string): boolean {
    return (
      this.notifications.filter(
        (event: DomainEvent) => event.aggregateId === productId,
      ).length === 1
    );
  }
}
