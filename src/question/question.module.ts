import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { AiModule } from 'src/ai/ai.module';
import { RagModule } from 'src/rag/rag.module';

@Module({
  imports: [AiModule , RagModule],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
