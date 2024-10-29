import { Test, TestingModule } from '@nestjs/testing';
import { JsonparseService } from './jsonparse.service';

describe('JsonparseService', () => {
  let service: JsonparseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonparseService],
    }).compile();

    service = module.get<JsonparseService>(JsonparseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get some data', async () => {
    await service.getData();
  });


  it('should get datalinebyline', async () => {
    await service.callit();
  });

  it('should get getJSONinBatches', async () => {
    await service.getJSONListInBatches();
  }, 15000);
  
});
