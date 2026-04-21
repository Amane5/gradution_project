import { Body, Controller, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AskQuestionDto } from './dto/ask-question.dto';

@Controller('ask')
export class QuestionController {
    constructor(private readonly questionService:QuestionService){}
    @Post()
    async askQuestion(@Body() body:AskQuestionDto) {
        const {question, childId} = body
        return this.questionService.handleQuestion(body ,question, childId)
    }
}

