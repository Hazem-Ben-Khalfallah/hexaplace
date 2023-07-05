import { ProductApprovedDomainEvent } from '@modules/product/domain/events/product-approved.domain-event';

export interface ProductApprovedNotificationGatewayPort {
  notify(event: ProductApprovedDomainEvent): Promise<void>;
}
