import { Module } from '@nestjs/common';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { ClinicModule } from 'src/clinic/clinic.module';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Module({
  imports: [ClinicModule, AppointmentModule],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}
