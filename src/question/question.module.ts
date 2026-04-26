import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { AiModule } from 'src/ai/ai.module';
import { RagModule } from 'src/rag/rag.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AiModule , RagModule, JwtModule],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
