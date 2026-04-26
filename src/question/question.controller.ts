import { Body, Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

@Controller('ask')
export class QuestionController {
    constructor(private readonly questionService:QuestionService){}
    
    @UseGuards(JwtAuthGuard)
    @Post()
    async askQuestion(@Body() body: AskQuestionDto, @Req() req) {
        console.log('🔥 CONTROLLER HIT');
      return this.questionService.handleQuestion(
        body,
        body.question,
        req.user.sub 
      );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':conversationId/messages')
    getMessages(@Param('conversationId') id:string, @Req() req){
        return this.questionService.getConversationMessages(Number(id), req.user.sub)
    }
}


