import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { TranslationService } from './translation.service';

@Controller('v1/translations')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get()
  getAppointment() {
    return this.translationService.getTranslations();
  }
}
