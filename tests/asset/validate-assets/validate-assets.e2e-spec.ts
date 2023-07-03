import { cleanUpTestData } from '@libs/test-utils/test-db-cleaner';
import { AssetEntity } from '@modules/asset/domain/entities/asset.entity';
import { AssetStatus } from '@modules/asset/domain/value-objects/asset-status/asset-status.enum';
import {
  AssetReadRepositoryPort,
  AssetWriteRepositoryPort,
} from '@modules/asset/ports/asset.repository.port';
import { HttpStatus } from '@nestjs/common';
import { FakeAssetBuilder } from '@tests/asset/fake-asset.builder';
import { getTestServer, TestServer } from '@tests/jestSetupAfterEnv';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

const feature = loadFeature(
  'tests/asset/validate-assets/validate-assets.feature',
);

type PartialAsset = {
  id: string;
  name: string;
  categoryId: string;
  status: AssetStatus;
  ownerId?: string;
};

defineFeature(feature, (test) => {
  let assetWriteRepository: AssetWriteRepositoryPort;
  let assetReadRepository: AssetReadRepositoryPort;

  let testServer: TestServer;
  let httpServer: request.SuperTest<request.Test>;

  beforeAll(() => {
    testServer = getTestServer();
    httpServer = request(testServer.serverApplication.getHttpServer());
  });

  afterAll(async () => {
    await getConnection().close();
  });

  afterEach(async () => {
    await cleanUpTestData();
  });

  test('I approve one asset', ({ when, then, given, and }) => {
    given(
      'the following assets exist:',
      async (partialAssets: PartialAsset[]) => {
        await createAssets(partialAssets);
      },
    );

    when(/^I approve asset with id "(.*)"$/, async (assetId: string) => {
      await httpServer
        .post(`/v1/assets/${assetId}/approve`)
        .expect(HttpStatus.NO_CONTENT);
    });

    then(
      /^I can check that the asset with id "(.*)" is approved$/,
      async (assetId: string) => {
        const asset = await assetReadRepository.findOneByIdOrThrow(assetId);
        expect(asset.getPropsCopy().status).toEqual(AssetStatus.APPROVED);
      },
    );

    and('The seller get notified', () => {
      // TODO add notification check
    });
  });

  test('I reject one asset', ({ when, then, and, given }) => {
    let reason: string;

    given(
      'the following assets exist:',
      async (partialAssets: PartialAsset[]) => {
        await createAssets(partialAssets);
      },
    );

    when(
      /^I reject asset with id "(.*)" for the reason "(.*)"$/,
      async (assetId: string, rejectionReason: string) => {
        reason = rejectionReason;
        await httpServer
          .post(`/v1/assets/${assetId}/reject`)
          .send({ reason: rejectionReason })
          .expect(HttpStatus.NO_CONTENT);
      },
    );

    then(
      /^I can check that the asset with id "(.*)" is rejected$/,
      async (assetId: string) => {
        const asset = await assetReadRepository.findOneByIdOrThrow(assetId);
        expect(asset.getPropsCopy().status).toEqual(AssetStatus.REJECTED);
      },
    );

    and('The seller get notified', () => {
      // TODO add rejection notification check
    });
  });

  async function createAssets(
    assetsToCreate: PartialAsset[],
  ): Promise<AssetEntity[]> {
    const promises: Promise<AssetEntity>[] = [];
    for (const assetToCreate of assetsToCreate) {
      promises.push(
        FakeAssetBuilder.builder(assetWriteRepository)
          .withId(assetToCreate.id)
          .withName(assetToCreate.name)
          .withStatus(assetToCreate.status)
          .build(),
      );
    }
    return Promise.all(promises);
  }
});
