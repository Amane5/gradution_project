import { BadRequestException, Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { RagService } from 'src/rag/rag.service';
import { AskQuestionDto } from './dto/ask-question.dto';

@Injectable()
export class QuestionService {
    constructor(
        private readonly aiService:AiService ,
        private readonly ragService:RagService
        ){}

    async handleQuestion(body : AskQuestionDto , question: string , childId: number){

        if(!body.question || body.question.trim() === ''){
            throw new BadRequestException("Qustion is required")
        }
        if(!body.childId){
            throw new BadRequestException("child id is required")
        }

        const children = [
            {id: 1 , age: 5},
            {id: 2 , age: 8}
        ]
        
        const child = children.find(c => c.id === body.childId)
        if(!child){
            throw new BadRequestException("Child not found")
        }
        const age = child.age
        const context = this.ragService.findRelevantContent(question)
        console.log("Context", context)
        const answer = await this.aiService.generateAnswerWithContext(question, context , age)
        console.log("Question:" , question)
        console.log("Context", context)

        return {
            explanation: answer,
            imagePrompt: question,
            quiz: "Can you answer this?",
        }
    }
}
