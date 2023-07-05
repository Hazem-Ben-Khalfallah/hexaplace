import { DomainEventHandler } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { ProductApprovedDomainEvent } from '@modules/product/domain/events/product-approved.domain-event';
import { ProductApprovedNotificationGatewayPort } from '@modules/product/ports/product-approved-notification.gateway.port';

export class ProductApprovedDomainEventHandler extends DomainEventHandler {
  constructor(
    private readonly logger: LoggerPort,
    private readonly productApprovedNotificationGatewayPort: ProductApprovedNotificationGatewayPort,
  ) {
    super(ProductApprovedDomainEvent);
    logger.setContext(this.constructor.name);
  }

  async handle(event: ProductApprovedDomainEvent): Promise<void> {
    this.logger.debug(
      `Sending product approved notification [${JSON.stringify(event)}]`,
    );

    await this.productApprovedNotificationGatewayPort.notify(event);
  }
}
