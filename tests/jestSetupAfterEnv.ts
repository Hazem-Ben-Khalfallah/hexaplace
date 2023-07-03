import { ExceptionInterceptor } from '@infrastructure/interceptors/exception.interceptor';
import { AppModule } from '@modules/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

export class TestServer {
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly testingModule: TestingModule,
  ) {}

  public static async new(
    testingModuleBuilder: TestingModuleBuilder,
  ): Promise<TestServer> {
    const testingModule: TestingModule = await testingModuleBuilder.compile();

    const serverApplication: NestExpressApplication =
      testingModule.createNestApplication();
    serverApplication.useGlobalInterceptors(new ExceptionInterceptor());
    await serverApplication.init();

    return new TestServer(serverApplication, testingModule);
  }
}

export async function generateTestingApplication(): Promise<{
  testServer: TestServer;
}> {
  const testServer = await TestServer.new(
    Test.createTestingModule({
      imports: [AppModule],
    }),
  );
  return {
    testServer,
  };
}

let testServer: TestServer;

export function getTestServer(): TestServer {
  return testServer;
}

beforeAll(async (): Promise<void> => {
  if (isE2ETest(expect.getState().testPath)) {
    ({ testServer } = await generateTestingApplication());
  }
});

function isE2ETest(testFilePath: string): boolean {
  return testFilePath.endsWith('e2e-spec.ts');
}
