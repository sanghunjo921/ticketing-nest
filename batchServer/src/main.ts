import { NestFactory } from '@nestjs/core';

import { BatchService } from './batch/batch.service';
import { MainModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  const batchService = app.get(BatchService);

  await batchService.initiateCron();
}

bootstrap();
