import { Command } from '@libs/ddd/domain/base-classes/command.base';

export type CommandProps<T> = Omit<T, 'correlationId'> & Partial<Command>;
