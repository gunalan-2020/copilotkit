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
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto, UpdateDashboardDto } from './dto/dashboard.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboards')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Post()
  create(@Request() req: any, @Body() createDto: CreateDashboardDto) {
    return this.dashboardService.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.dashboardService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.dashboardService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateDto: UpdateDashboardDto,
  ) {
    return this.dashboardService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.dashboardService.remove(id, req.user.id);
  }
}
