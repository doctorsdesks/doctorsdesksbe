import { Test, TestingModule } from '@nestjs/testing';
import { DfoService } from './dfo.service';

describe('DfoService', () => {
  let service: DfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DfoService],
    }).compile();

    service = module.get<DfoService>(DfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
