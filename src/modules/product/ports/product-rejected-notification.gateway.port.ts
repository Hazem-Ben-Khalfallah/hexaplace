import { ProductRejectdDomainEvent } from '@modules/product/domain/events/product-rejected.domain-event';

export interface ProductRejectdNotificationGatewayPort {
  notify(event: ProductRejectdDomainEvent): Promise<void>;
}
