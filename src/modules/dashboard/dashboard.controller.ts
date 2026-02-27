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
  HttpException,
  HttpStatus,
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
  async update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateDto: UpdateDashboardDto,
  ) {
    try {
      return await this.dashboardService.update(id, req.user.id, updateDto);
    } catch (error) {
      console.error('Update dashboard error:', error);
      throw new HttpException(
        { message: error.message, error: error.response || 'Internal error', stack: error.stack },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.dashboardService.remove(id, req.user.id);
  }
}
