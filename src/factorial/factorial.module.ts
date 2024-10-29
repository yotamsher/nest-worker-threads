import { Module } from '@nestjs/common';
import { FactorialService } from './factorial.service';
import { FactorialController } from './factorial.controller';

@Module({
  providers: [FactorialService],
  controllers: [FactorialController]
})
export class FactorialModule {}
