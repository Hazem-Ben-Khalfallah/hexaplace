import { ProductRejectedDomainEvent } from '@modules/product/domain/events/product-rejected.domain-event';

export interface ProductRejectdNotificationGatewayPort {
  notify(event: ProductRejectedDomainEvent): Promise<void>;
}
