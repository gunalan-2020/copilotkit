import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chart } from './entities/chart.entity';
import { Dashboard } from '../dashboard/entities/dashboard.entity';
import { CreateChartDto, UpdateChartDto } from './dto/chart.dto';

@Injectable()
export class ChartService {
  constructor(
    @InjectRepository(Chart)
    private chartRepository: Repository<Chart>,
    @InjectRepository(Dashboard)
    private dashboardRepository: Repository<Dashboard>,
  ) {}

  async create(createDto: CreateChartDto): Promise<Chart> {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id: createDto.dashboardId },
    });
    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }
    const chart = this.chartRepository.create(createDto);
    return this.chartRepository.save(chart);
  }

  async findAllByDashboard(dashboardId: string): Promise<Chart[]> {
    return this.chartRepository.find({
      where: { dashboardId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Chart> {
    const chart = await this.chartRepository.findOne({
      where: { id },
      relations: ['dashboard'],
    });
    if (!chart) {
      throw new NotFoundException('Chart not found');
    }
    if (chart.dashboard.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return chart;
  }

  async update(id: string, userId: string, updateDto: UpdateChartDto): Promise<Chart> {
    const chart = await this.findOne(id, userId);
    Object.assign(chart, updateDto);
    return this.chartRepository.save(chart);
  }

  async remove(id: string, userId: string): Promise<void> {
    const chart = await this.findOne(id, userId);
    await this.chartRepository.remove(chart);
  }
}
