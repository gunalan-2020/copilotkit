import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Dashboard } from '../dashboard/entities/dashboard.entity';
import { CreateChatMessageDto, UpdateChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private messageRepository: Repository<ChatMessage>,
    @InjectRepository(Dashboard)
    private dashboardRepository: Repository<Dashboard>,
  ) {}

  async findOrCreateByUser(userId: string, createDto: CreateChatMessageDto): Promise<{ chat: Chat; message: ChatMessage; isNewDashboard: boolean }> {
    const dashboards = await this.dashboardRepository.find({
      where: { userId },
      relations: ['chat'],
      order: { createdAt: 'DESC' },
      take: 1,
    });

    let chat: Chat;
    let isNewDashboard = false;

    if (dashboards.length === 0) {
      const dashboard = this.dashboardRepository.create({
        name: `Dashboard ${new Date().toLocaleDateString()}`,
        description: '',
        userId,
        data: {},
      });
      const savedDashboard = await this.dashboardRepository.save(dashboard);

      chat = this.chatRepository.create({
        dashboardId: savedDashboard.id,
      });
      await this.chatRepository.save(chat);
      isNewDashboard = true;
    } else {
      chat = dashboards[0].chat;
      if (!chat) {
        chat = this.chatRepository.create({
          dashboardId: dashboards[0].id,
        });
        await this.chatRepository.save(chat);
      }
    }

    const maxOrder = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.chatId = :chatId', { chatId: chat.id })
      .select('MAX(message.order)', 'max')
      .getRawOne();

    const message = this.messageRepository.create({
      ...createDto,
      chatId: chat.id,
      order: (maxOrder?.max ?? -1) + 1,
    });
    const savedMessage = await this.messageRepository.save(message);

    return { chat, message: savedMessage, isNewDashboard };
  }

  async findOneByDashboard(dashboardId: string, userId: string): Promise<Chat> {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id: dashboardId },
    });
    if (!dashboard || dashboard.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    let chat = await this.chatRepository.findOne({
      where: { dashboardId },
      relations: ['messages'],
    });
    
    if (!chat) {
      chat = this.chatRepository.create({ dashboardId });
      chat = await this.chatRepository.save(chat);
    }
    return chat;
  }

  async addMessage(
    dashboardId: string,
    userId: string,
    createDto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    const chat = await this.findOneByDashboard(dashboardId, userId);

    const maxOrder = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.chatId = :chatId', { chatId: chat.id })
      .select('MAX(message.order)', 'max')
      .getRawOne();

    const message = this.messageRepository.create({
      ...createDto,
      chatId: chat.id,
      order: (maxOrder?.max ?? -1) + 1,
    });
    return this.messageRepository.save(message);
  }

  async getMessages(dashboardId: string, userId: string): Promise<ChatMessage[]> {
    await this.findOneByDashboard(dashboardId, userId);
    return this.messageRepository.find({
      where: { chatId: (await this.getChatId(dashboardId)) },
      order: { order: 'ASC' },
    });
  }

  private async getChatId(dashboardId: string): Promise<string> {
    const chat = await this.chatRepository.findOne({
      where: { dashboardId },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat.id;
  }

  async clearMessages(dashboardId: string, userId: string): Promise<void> {
    const chat = await this.findOneByDashboard(dashboardId, userId);
    await this.messageRepository.delete({ chatId: chat.id });
  }

  async updateTitle(
    dashboardId: string,
    userId: string,
    updateDto: UpdateChatDto,
  ): Promise<Chat> {
    const chat = await this.findOneByDashboard(dashboardId, userId);
    Object.assign(chat, updateDto);
    return this.chatRepository.save(chat);
  }
}
