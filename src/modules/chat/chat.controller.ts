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
import { ChatService } from './chat.service';
import { CreateChatMessageDto, UpdateChatDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('dashboard/:dashboardId')
  findOne(@Param('dashboardId') dashboardId: string, @Request() req: any) {
    return this.chatService.findOneByDashboard(dashboardId, req.user.id);
  }

  @Get('dashboard/:dashboardId/messages')
  getMessages(@Param('dashboardId') dashboardId: string, @Request() req: any) {
    return this.chatService.getMessages(dashboardId, req.user.id);
  }

  @Post('dashboard/:dashboardId/messages')
  addMessage(
    @Param('dashboardId') dashboardId: string,
    @Request() req: any,
    @Body() createDto: CreateChatMessageDto,
  ) {
    return this.chatService.addMessage(dashboardId, req.user.id, createDto);
  }

  @Delete('dashboard/:dashboardId/messages')
  clearMessages(@Param('dashboardId') dashboardId: string, @Request() req: any) {
    return this.chatService.clearMessages(dashboardId, req.user.id);
  }

  @Put('dashboard/:dashboardId')
  updateTitle(
    @Param('dashboardId') dashboardId: string,
    @Request() req: any,
    @Body() updateDto: UpdateChatDto,
  ) {
    return this.chatService.updateTitle(dashboardId, req.user.id, updateDto);
  }
}
