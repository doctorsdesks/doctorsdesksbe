import {
  Controller,
  Get,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { GetBannerDto } from './dto/get-banner.dto';
import { BannerService } from './banner.service';

@Controller('v1/banner')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getBanner(@Query() getBannerDto: GetBannerDto) {
    return this.bannerService.getBanner(getBannerDto.phone, getBannerDto.type);
  }
}
