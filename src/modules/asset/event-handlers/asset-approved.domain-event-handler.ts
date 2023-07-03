import { DomainEventHandler } from '@libs/ddd/domain/domain-events';
import { LoggerPort } from '@libs/ddd/domain/ports/logger.port';
import { AssetApprovedDomainEvent } from '@modules/asset/domain/events/asset-approved.domain-event';
import { AssetApprovedNotificationGatewayPort } from '@modules/asset/ports/asset-approved-notification.gateway.port';

export class AssetApprovedDomainEventHandler extends DomainEventHandler {
  constructor(
    private readonly logger: LoggerPort,
    private readonly assetApprovedNotificationGatewayPort: AssetApprovedNotificationGatewayPort,
  ) {
    super(AssetApprovedDomainEvent);
    logger.setContext(this.constructor.name);
  }

  async handle(event: AssetApprovedDomainEvent): Promise<void> {
    this.logger.debug(
      `Sending asset approved notification [${JSON.stringify(event)}]`,
    );

    await this.assetApprovedNotificationGatewayPort.notify(event);
  }
}
