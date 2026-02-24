import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { Chat } from '../chat/entities/chat.entity';
import { CreateDashboardDto, UpdateDashboardDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Dashboard)
    private dashboardRepository: Repository<Dashboard>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async create(userId: string, createDto: CreateDashboardDto): Promise<Dashboard> {
    const chat = this.chatRepository.create({});
    await this.chatRepository.save(chat);

    const dashboard = this.dashboardRepository.create({
      ...createDto,
      userId,
      chat,
    });
    return this.dashboardRepository.save(dashboard);
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
    Object.assign(dashboard, updateDto);
    return this.dashboardRepository.save(dashboard);
  }

  async remove(id: string, userId: string): Promise<void> {
    const dashboard = await this.findOne(id, userId);
    await this.dashboardRepository.remove(dashboard);
  }
}
