import { NestFactory } from '@nestjs/core';
import { fastifyHelmet } from 'fastify-helmet';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const configSwagger = new DocumentBuilder()
    .setTitle('Sailman')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api-docs', app, document);

  const config = new ConfigService();
  const port = config.get<string>('PORT');

  await app.register(fastifyHelmet);
  await app.listen(port, () => {
    console.info(`Server running on port ${port}`);
  });
}
bootstrap();
