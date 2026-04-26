import { IsInt, IsOptional, IsString } from 'class-validator';

export class AskQuestionDto {
  @IsString()
  question: string;

  @IsInt()
  childId: number;

  @IsOptional()
  @IsInt()
  conversationId?: number; 
}