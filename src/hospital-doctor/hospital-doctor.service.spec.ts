import { Test, TestingModule } from '@nestjs/testing';
import { HospitalDoctorService } from './hospital-doctor.service';

describe('HospitalDoctorService', () => {
  let service: HospitalDoctorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalDoctorService],
    }).compile();

    service = module.get<HospitalDoctorService>(HospitalDoctorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
