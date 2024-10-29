import { Test, TestingModule } from '@nestjs/testing';
import { JsonparseController } from './jsonparse.controller';
import { JsonparseService } from './jsonparse.service';

describe('JsonparseController', () => {
  let controller: JsonparseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsonparseController],
      providers: [JsonparseService],
    }).compile();

    controller = module.get<JsonparseController>(JsonparseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
