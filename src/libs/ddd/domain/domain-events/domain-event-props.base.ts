import { DomainEvent } from '@libs/ddd/domain/domain-events/domain-event.base';

export type DomainEventProps<T> = Omit<T, 'correlationId' | 'dateOccurred'> &
  Omit<DomainEvent, 'correlationId' | 'dateOccurred'> & {
    correlationId?: string;
    dateOccurred?: number;
  };
