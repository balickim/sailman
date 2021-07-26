import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const port = config.get<string>('PORT');

  await app.listen(port, () => {
    console.info(`Server running on port ${port}`);
  });
}
bootstrap();
