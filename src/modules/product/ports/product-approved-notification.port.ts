import { ProductApprovedDomainEvent } from '@modules/product/domain/events/product-approved.domain-event';

export interface ProductApprovedNotificationPort {
  send(event: ProductApprovedDomainEvent): Promise<void>;
}
