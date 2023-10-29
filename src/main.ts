import { ExceptionInterceptor } from '@infrastructure/interceptors/exception.interceptor';
import { AppModule } from '@modules/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import http from 'http';
import { description, displayName, version } from '../package.json';


function buildSwaggerOptions() {
  return new DocumentBuilder()
    .setTitle(displayName)
    .setDescription(description)
    .setVersion(version)
    .build();
}

function setupSwagger(app: INestApplication) {
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, buildSwaggerOptions()),
  );
}

function rawBodyBuffer(
  req: http.IncomingMessage & { rawBody: string },
  res: unknown,
  buffer: Buffer,
  encoding: BufferEncoding,
) {
  // no need for raw body
  // if request is not stripe webhook
  if (!req.headers['stripe-signature']) {
    return;
  }

  if (buffer && buffer.length) {
    req.rawBody = buffer.toString(encoding || 'utf8');
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: false,
  });

  setupSwagger(app);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ExceptionInterceptor());

  app.enableShutdownHooks();

  app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));

  app.use(bodyParser.json({ verify: rawBodyBuffer }));

  await app.listen(3000);
}

bootstrap();
