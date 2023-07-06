import { typeormConfig } from '@config/ormconfig';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { ProductModule } from '@modules/catalog/product.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestEventModule } from 'nest-event';

const modules = [ProductModule];

@Module({
  imports: [
    LoggerModule,
    TerminusModule,
    TypeOrmModule.forRoot(typeormConfig),
    NestEventModule,
    ...modules
  ],
})
export class AppModule {}
