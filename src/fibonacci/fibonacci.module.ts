import { Module } from '@nestjs/common';
import { FibonacciService } from './fibonacci.service';
import { FibonacciController } from './fibonacci.controller';
import { FibonacciWorkerHost } from './fibonacci-worker.host';

@Module({
  providers: [FibonacciService, FibonacciWorkerHost],
  controllers: [FibonacciController]
})
export class FibonacciModule {}
