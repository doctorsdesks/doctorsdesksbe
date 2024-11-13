import { Test, TestingModule } from '@nestjs/testing';
import { DfoController } from './dfo.controller';

describe('DfoController', () => {
  let controller: DfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DfoController],
    }).compile();

    controller = module.get<DfoController>(DfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
