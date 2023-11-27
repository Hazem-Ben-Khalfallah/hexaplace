
import { ICommand, ICommandBus, ICommandHandler, ICommandPublisher, ModuleRef, ObservableBus } from '@nestjs/cqrs';

// Define a fake implementation of ICommandBus
class FakeCommandBus<CommandBase extends ICommand = ICommand> extends ObservableBus<CommandBase> implements ICommandBus<CommandBase> {
    private handlers: Record<string, ICommandHandler<CommandBase>> = {};

    constructor(private readonly moduleRef: ModuleRef) {
        super();
    }

    get publisher(): ICommandPublisher<CommandBase> {
        // Implement this if needed in your tests
        throw new Error('Not implemented');
    }

    set publisher(_publisher: ICommandPublisher<CommandBase>) {
        // Implement this if needed in your tests
        throw new Error('Not implemented');
    }

    async execute<T extends CommandBase, R = any>(command: T): Promise<R> {
        const handler = this.handlers[this.getCommandName(command)];
        if (!handler) {
            throw new Error(`Handler not found for command: ${this.getCommandName(command)}`);
        }

        return handler.handle(command);
    }

    bind<T extends CommandBase>(handler: ICommandHandler<T>, name: string): void {
        this.handlers[name] = handler;
    }

    register(handlers?: CommandHandlerType[]): void {
        // Implement this if needed in your tests
        throw new Error('Not implemented');
    }

    protected registerHandler(handler: CommandHandlerType): void {
        // Implement this if needed in your tests
        throw new Error('Not implemented');
    }

    private getCommandName(command: ICommand): string {
        // Implement this based on your actual command structure
        return command.constructor.name;
    }
}

export { FakeCommandBus };
