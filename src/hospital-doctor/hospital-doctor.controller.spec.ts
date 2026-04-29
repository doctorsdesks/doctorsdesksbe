import { Test, TestingModule } from '@nestjs/testing';
import { HospitalDoctorController } from './hospital-doctor.controller';

describe('HospitalDoctorController', () => {
  let controller: HospitalDoctorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalDoctorController],
    }).compile();

    controller = module.get<HospitalDoctorController>(HospitalDoctorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
