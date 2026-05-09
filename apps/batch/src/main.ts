import { NestFactory } from '@nestjs/core';
import { BatchModule } from './batch.module';

async function bootstrap() {
  const app = await NestFactory.create(BatchModule);
  const port = process.env.BATCH_PORT || 4001;
  await app.listen(port);
  console.log(`🤖 Korea Car Import Batch Service running on: http://localhost:${port}`);
}
bootstrap();
