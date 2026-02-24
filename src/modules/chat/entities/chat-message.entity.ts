import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Chat } from './chat.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'user' })
  role: 'user' | 'assistant' | 'system';

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Index('chat_message_order_idx')
  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @Column()
  chatId: string;

  @CreateDateColumn()
  createdAt: Date;
}
