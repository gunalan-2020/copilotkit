import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  content: string;

  @IsEnum(['user', 'assistant', 'system'])
  @IsOptional()
  role?: 'user' | 'assistant' | 'system';

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateChatDto {
  @IsString()
  @IsOptional()
  title?: string;
}
