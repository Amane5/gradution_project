import { Module } from '@nestjs/common';
import { QuestionModule } from './question/question.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { RagModule } from './rag/rag.module';
import { AuthModule } from './auth/auth.module';
import { ChildrenModule } from './children/children.module';
import { ConversationModule } from './conversation/conversation.module';


@Module({
  imports: [QuestionModule, AiModule, RagModule, AuthModule, ChildrenModule, ConversationModule],
})
export class AppModule {}
