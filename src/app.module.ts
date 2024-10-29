import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FibonacciModule } from './fibonacci/fibonacci.module';
import { FactorialModule } from './factorial/factorial.module';
import { JsonparseModule } from './jsonparse/jsonparse.module';

@Module({
  imports: [FibonacciModule, FactorialModule, JsonparseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
