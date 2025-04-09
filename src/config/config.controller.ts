import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from './config.service';
import { GetConfigDto } from './dto/get-config.dto';

@Controller('v1/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async getConfig(@Query() getConfigDto: GetConfigDto) {
    return this.configService.getConfigByType(getConfigDto.type);
  }
}
