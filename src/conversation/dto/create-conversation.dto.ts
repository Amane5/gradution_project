import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @IsInt()
  childId: number;

  @IsOptional()
  @IsString()
  question?: string;
}