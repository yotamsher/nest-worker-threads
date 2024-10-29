import { Module } from '@nestjs/common';
import { JsonparseController } from './jsonparse.controller';
import { JsonparseService } from './jsonparse.service';

@Module({
  controllers: [JsonparseController],
  providers: [JsonparseService]
})
export class JsonparseModule {}
