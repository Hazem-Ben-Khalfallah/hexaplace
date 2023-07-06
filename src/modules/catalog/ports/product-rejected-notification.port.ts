import { ProductRejectedDomainEvent } from '@modules/catalog/domain/events/product-rejected.domain-event';

export interface ProductRejectedNotificationPort {
  send(event: ProductRejectedDomainEvent): Promise<void>;
}
