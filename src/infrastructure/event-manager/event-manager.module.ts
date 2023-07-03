import { EventManager } from '@infrastructure/event-manager/event-manager';
import { ClassProvider, Module } from '@nestjs/common';

export const eventManagerProvider: ClassProvider = {
  provide: 'EventManagerPort',
  useClass: EventManager,
};

@Module({
  imports: [],
  providers: [eventManagerProvider],
  exports: ['EventManagerPort'],
})
export class EventManagerModule {}
