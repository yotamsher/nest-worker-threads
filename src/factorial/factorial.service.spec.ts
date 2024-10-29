import { Test, TestingModule } from '@nestjs/testing';
import { FactorialService } from './factorial.service';

describe('FactorialService', () => {
  let service: FactorialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FactorialService],
    }).compile();

    service = module.get<FactorialService>(FactorialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  type fibTest=[input: number, fibval: number]
  it.each<fibTest>([[0,0],[1,1],[2,2],[3,6],[4,24],[5,120]])('should caculate factorial(x)',(x,f) => {
    let res = service.calculateFactorialSync(x);
    expect(res).toBe(f);
  });
});
