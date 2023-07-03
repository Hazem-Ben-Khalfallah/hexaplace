import {
  EventManagerPort,
  EventType,
  Observer,
} from '@libs/ddd/domain/ports/event-manager.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventManager implements EventManagerPort {
  private readonly observers = new Map<EventType, Set<Observer>>();

  subscribe(eventType: EventType, observer: Observer): void {
    let eventObservers = this.observers.get(eventType);
    if (!eventObservers) {
      eventObservers = new Set();
      this.observers.set(eventType, eventObservers);
    }
    eventObservers.add(observer);
  }

  notify(eventType: EventType, context: object): void {
    const eventObservers = this.observers.get(eventType);
    if (!eventObservers) {
      return;
    }
    eventObservers.forEach((observer) => {
      observer.update(context);
    });
  }
}
