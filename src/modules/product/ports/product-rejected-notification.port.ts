import { ProductRejectedDomainEvent } from '@modules/product/domain/events/product-rejected.domain-event';

export interface ProductRejectedNotificationPort {
  send(event: ProductRejectedDomainEvent): Promise<void>;
}
