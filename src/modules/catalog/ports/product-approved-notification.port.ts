import { ProductApprovedDomainEvent } from '@modules/catalog/domain/events/product-approved.domain-event';

export interface ProductApprovedNotificationPort {
  send(event: ProductApprovedDomainEvent): Promise<void>;
}
