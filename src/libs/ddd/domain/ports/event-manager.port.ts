export enum EventType {
  EMAIL_SENT = 'email_sent',
}

export interface Observer {
  update(context: object): void;
}

export interface EventManagerPort {
  subscribe(eventType: EventType, observer: Observer): void;
  notify(eventType: EventType, context: object): void;
}
