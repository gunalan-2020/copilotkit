import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { Chat } from '../chat/entities/chat.entity';
import { Chart } from '../chart/entities/chart.entity';
import { CreateDashboardDto, UpdateDashboardDto } from './dto/dashboard.dto';

interface DashboardElement {
  id: string;
  type: string;
  chartType?: string;
  title?: string;
  label?: string;
  value?: string | number;
  description?: string;
  config?: Record<string, any>;
  data?: Record<string, any>[];
  columns?: Record<string, string>[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Dashboard)
    private dashboardRepository: Repository<Dashboard>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Chart)
    private chartRepository: Repository<Chart>,
  ) {}

  private async saveElementsAsCharts(dashboardId: string, elements: DashboardElement[]): Promise<void> {
    const chartsToSave: Partial<Chart>[] = [];

    for (const element of elements) {
      if (element.type === 'chart' || element.type === 'metric' || element.type === 'table') {
        chartsToSave.push({
          name: element.title || element.label || element.id,
          type: element.type,
          config: {
            chartType: element.chartType,
            ...element.config,
            description: element.description,
            columns: element.columns,
          },
          data: element.data || [],
          dashboardId,
          isActive: true,
        });
      }
    }

    if (chartsToSave.length > 0) {
      await this.chartRepository.save(chartsToSave);
    }
  }

  private async updateElementsAsCharts(dashboardId: string, elements: DashboardElement[]): Promise<void> {
    await this.chartRepository.delete({ dashboardId });
    await this.saveElementsAsCharts(dashboardId, elements);
  }

  async create(userId: string, createDto: CreateDashboardDto): Promise<Dashboard> {
    const dashboard = this.dashboardRepository.create({
      name: createDto.name,
      description: createDto.description || '',
      userId,
      data: createDto.data || {},
    });
    const savedDashboard = await this.dashboardRepository.save(dashboard);

    const chat = this.chatRepository.create({
      dashboardId: savedDashboard.id,
    });
    await this.chatRepository.save(chat);

    if (createDto.data?.elements && createDto.data.elements.length > 0) {
      await this.saveElementsAsCharts(savedDashboard.id, createDto.data.elements);
    }

    return this.findOne(savedDashboard.id, userId);
  }

  async findAllByUser(userId: string): Promise<Dashboard[]> {
    return this.dashboardRepository.find({
      where: { userId },
      relations: ['charts', 'chat', 'chat.messages'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id },
      relations: ['charts', 'chat', 'chat.messages'],
    });
    if (!dashboard) {
      throw new NotFoundException('Dashboard not found');
    }
    if (dashboard.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return dashboard;
  }

  async update(id: string, userId: string, updateDto: UpdateDashboardDto): Promise<Dashboard> {
    const dashboard = await this.findOne(id, userId);
    
    if (updateDto.name) dashboard.name = updateDto.name;
    if (updateDto.description !== undefined) dashboard.description = updateDto.description;
    if (updateDto.data?.elements) {
      dashboard.data = updateDto.data;
      await this.updateElementsAsCharts(id, updateDto.data.elements);
    }
    
    return this.dashboardRepository.save(dashboard);
  }

  async remove(id: string, userId: string): Promise<void> {
    const dashboard = await this.findOne(id, userId);
    await this.dashboardRepository.remove(dashboard);
  }
}
