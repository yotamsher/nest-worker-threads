import { Test, TestingModule } from '@nestjs/testing';
import { FibonacciService } from './fibonacci.service';
import { FibonacciWorkerHost } from './fibonacci-worker.host';

describe('FibonacciService', () => {
  let service: FibonacciService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FibonacciService, FibonacciWorkerHost],
    }).compile();

    service = module.get<FibonacciService>(FibonacciService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  type fibTest=[input: number, fibval: number]
  it.each<fibTest>([[0,0],[1,1],[2,1],[3,2],[4,3],[5,5]])('should caculate fib(x)',(x,f) => {
    let res = service.calculateFibonacciSync(x);
    expect(res).toBe(f);
  }

  )
});
