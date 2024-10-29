import { Controller, Get, Query } from '@nestjs/common';
import { FactorialService } from './factorial.service';

@Controller('factorial')
export class FactorialController {
    constructor(
        private readonly FactorialiService: FactorialService,
       // private readonly FactorialiWorkerHost: FactorialWorkerHost,
    ) {}
    
      // Endpoint to calculate Factoriali synchronously
      @Get('sync')
      calculateSync(@Query('n') n: string): number {
        return this.FactorialiService.calculateFactorialSync(parseInt(n, 10));
      }
    
        // Endpoint to calculate Factoriali using worker threads
        @Get('worker')
        async calculateWorker(@Query('n') n: 10) {
          return this.FactorialiService.calculateFactorialWorker(n);
        }
    
        @Get('piscina')
        async calculateWorkerPiscina(@Query('n') n: 10) {
          return this.FactorialiService.calculateFactorialPiscina(n);
        }
}
