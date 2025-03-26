import {
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { SlotsService } from './slots.service';

@Controller('/v1/slots')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('/:clinicId/:date')
  getClinicSlots(
    @Param('clinicId') clinicId: string,
    @Param('date') date: string,
  ) {
    return this.slotsService.getClinicSlots(clinicId, date);
  }
}
