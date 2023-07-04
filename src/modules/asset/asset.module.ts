import { LoggerModule } from '@infrastructure/logger/logger.module';
import { assetReadRepositoryProvider,assetUnitOfWorkSingletonProvider,assetWriteRepositoryProvider } from '@modules/asset/asset.providers';
import { ApproveAssetCommandHandler } from '@modules/asset/commands/approve-asset/approve-asset.command-handler';
import { ApproveAssetHttpController } from '@modules/asset/commands/approve-asset/approve-asset.http.controller';
import { CreateAssetCommandHandler } from '@modules/asset/commands/create-asset/create-asset.command-handler';
import { CreateAssetHttpController } from '@modules/asset/commands/create-asset/create-asset.http.controller';
import { GetAssetHttpController } from '@modules/asset/queries/get-asset/get-asset.http.controller';
import { GetAssetQueryHandler } from '@modules/asset/queries/get-asset/get-asset.query-handler';
import { GetAssetsHttpController } from '@modules/asset/queries/get-assets/get-assets.http.controller';
import { GetAssetsQueryHandler } from '@modules/asset/queries/get-assets/get-assets.query-handler';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RejectAssetCommandHandler } from './commands/reject-asset/reject-asset.command-handler';
import { RejectAssetHttpController } from './commands/reject-asset/reject-asset.http.controller';
import { AssetOrmEntity } from './database/asset.orm-entity';

const unitsOfWork = [assetUnitOfWorkSingletonProvider];

const repositories = [
  assetReadRepositoryProvider,
  assetWriteRepositoryProvider,
];


const httpControllers = [
  CreateAssetHttpController,
  ApproveAssetHttpController,
  RejectAssetHttpController,
  GetAssetsHttpController,
  GetAssetHttpController,
];

const commandHandlers = [
  CreateAssetCommandHandler,
  ApproveAssetCommandHandler,
  RejectAssetCommandHandler,
];

const queryHandlers = [GetAssetsQueryHandler, GetAssetQueryHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetOrmEntity]),
    CqrsModule,
    LoggerModule
  ],
  controllers: [...httpControllers],
  providers: [
    ...repositories,
    ...unitsOfWork,
    ...commandHandlers,
     ...queryHandlers],
})
export class AssetModule {}
