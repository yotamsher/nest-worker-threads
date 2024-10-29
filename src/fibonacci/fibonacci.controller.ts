import { Controller, Get, Query } from '@nestjs/common';
import { FibonacciService } from './fibonacci.service';
import { FibonacciWorkerHost } from './fibonacci-worker.host';

@Controller('fibonacci')
export class FibonacciController {
  constructor(
    private readonly fibonacciService: FibonacciService,
    private readonly fibonacciWorkerHost: FibonacciWorkerHost,
) {}

  // Endpoint to calculate Fibonacci synchronously
  @Get('sync')
  calculateSync(@Query('n') n: string): number {
    return this.fibonacciService.calculateFibonacciSync(parseInt(n, 10));
  }

    // Endpoint to calculate Fibonacci using worker threads
    @Get('worker')
    async calculateWorker(@Query('n') n: 10) {
      return this.fibonacciService.calculateFibonacciWorker(n);
    }

    @Get('piscina')
    async calculateWorkerPiscina(@Query('n') n: 10) {
      return this.fibonacciService.calculateFibonacciPiscina(n);
    }
  
}