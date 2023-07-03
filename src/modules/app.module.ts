import { typeormConfig } from '@config/ormconfig';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { AssetModule } from '@modules/asset/asset.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestEventModule } from 'nest-event';

const modules = [AssetModule];

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
