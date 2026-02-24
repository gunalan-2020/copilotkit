import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Dashboard } from '../modules/dashboard/entities/dashboard.entity';
import { Chart } from '../modules/chart/entities/chart.entity';
import { Chat } from '../modules/chat/entities/chat.entity';
import { ChatMessage } from '../modules/chat/entities/chat-message.entity';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'copilotkit',
  entities: [User, Dashboard, Chart, Chat, ChatMessage],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
});
