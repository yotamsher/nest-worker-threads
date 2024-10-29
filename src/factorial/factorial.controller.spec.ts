import { Test, TestingModule } from '@nestjs/testing';
import { FactorialController } from './factorial.controller';
import { FactorialService } from './factorial.service';

describe('FactorialController', () => {
  let controller: FactorialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FactorialController],
      providers: [FactorialService],
    }).compile();

    controller = module.get<FactorialController>(FactorialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
