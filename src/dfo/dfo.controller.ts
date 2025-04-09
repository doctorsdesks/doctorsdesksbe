import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { RequestHeaderInterceptor } from 'src/common/interceptors/request-header.interceptor';
import { DfoService } from './dfo.service';
import { UpdateDfoDto } from './dto/update-dfo.dto';
import { CreateDfoDto } from './dto/create-dfo.dto';

@Controller('/v1/dfo')
@UseInterceptors(RequestHeaderInterceptor)
@UseFilters(HttpExceptionFilter)
export class DfoController {
  constructor(private readonly dfoService: DfoService) {}

  @Get()
  async getDfo(
    @Query('doctor') doctorId: string,
  ): Promise<CreateDfoDto | null> {
    return this.dfoService.getDfo(doctorId);
  }

  @Post('/add/:doctorId')
  addDfo(@Body() updateDfo: UpdateDfoDto, @Param('doctorId') doctorId: string) {
    return this.dfoService.addDfo(doctorId, updateDfo);
  }

  @Delete('/:doctorId/:dfoKey')
  deleteDfo(
    @Param('doctorId') doctorId: string,
    @Param('dfoKey') dfoKey: string,
  ) {
    return this.dfoService.deleteDfo(doctorId, dfoKey);
  }
}
