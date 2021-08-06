import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');

  const configSwagger = new DocumentBuilder()
    .setTitle('Sailman')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api-docs', app, document);

  const config = new ConfigService();
  const port = config.get<string>('PORT');

  await app.listen(port, () => {
    console.info(`Server running on port ${port}`);
  });
}
bootstrap();
