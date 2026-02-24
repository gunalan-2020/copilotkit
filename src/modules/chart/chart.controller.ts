import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChartService } from './chart.service';
import { CreateChartDto, UpdateChartDto } from './dto/chart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('charts')
@UseGuards(JwtAuthGuard)
export class ChartController {
  constructor(private chartService: ChartService) {}

  @Post()
  create(@Body() createDto: CreateChartDto) {
    return this.chartService.create(createDto);
  }

  @Get('dashboard/:dashboardId')
  findAll(@Param('dashboardId') dashboardId: string) {
    return this.chartService.findAllByDashboard(dashboardId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.chartService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateDto: UpdateChartDto,
  ) {
    return this.chartService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.chartService.remove(id, req.user.id);
  }
}
