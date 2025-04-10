import {
  Controller,
  Get,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { GetConfigDto } from './dto/get-config.dto';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@Controller('v1/config')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getConfig(@Query() getConfigDto: GetConfigDto) {
    return this.configService.getConfigByType(getConfigDto.type);
  }
}
