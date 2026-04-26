import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { RagService } from 'src/rag/rag.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { prisma } from '@/lib/prisma';

@Injectable()
export class QuestionService {
    constructor(
        private readonly aiService:AiService ,
        private readonly ragService:RagService
        ){}

    private calculateAge(birthDate: Date): number {
        const today = new Date();
        const birth = new Date(birthDate);
        
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    private async mockImageAnalysis(imagePath: string) {
        return `User uploaded an image from path: ${imagePath}. Describe it for a child in simple terms.`;
    }

    private async mockSpeechToText(audioPath: string) {
        return "This is a mock transcription of the audio question";
      }

    async handleQuestion(body : AskQuestionDto , question: string , childId: number, files?: any[]){

        if((!body.question || body.question.trim() === '') && !files){
            throw new BadRequestException("Qustion or file is required")
        }


        const child = await prisma.user.findFirst({
            where:{
                id: childId,
                type:'child'
            }
        })
        
        if(!child){
            throw new NotFoundException("Child not found")
        }

        if (!child.birthDate) {
            throw new BadRequestException({
              message: 'Child birthDate is missing',
              error: 'BIRTHDATE_REQUIRED',
            });
          }
          
        const age = this.calculateAge(child.birthDate);
        let finalQuestion = question || ''
        if (files && files.length>0) {
            for(const file of files){
                if(file.mimetype.startsWith('audio')){
                    const audioText = await this.mockSpeechToText(file.path)
                    finalQuestion = audioText
                }
                if(file.mimetype.startsWith('image')){
                    const imageContext = await this.mockImageAnalysis(file.path);
                    finalQuestion = [finalQuestion, imageContext]
                    .filter(Boolean)
                    .join(' ');
                }
            }
            }
            
        const context = this.ragService.findRelevantContent(finalQuestion)
        const answer = await this.aiService.generateAnswerWithContext(finalQuestion, context , age)
        let conversationId = body.conversationId;
        if (!conversationId) {
            const title = await this.aiService.generateTitle(question)
            const newConversation = await prisma.conversation.create({
                data: {
                childId: childId,
                title:title
                },
            });
    
            conversationId = newConversation.id;
        }    
        
        await prisma.question.create({
            data:{
                question: finalQuestion,
                answer,
                childId,
                conversationId
            }
        })
        console.log("Question:" , question)
        console.log("Context", context)

        return {
            explanation: answer,
            imagePrompt: question,
            quiz: "Can you answer this?",
        }
    }


    async getConversationMessages(conversationId: number, childId:number) {
        const messages = await prisma.question.findMany({
          where: { conversationId , childId},
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            question: true,
            answer: true,
            createdAt: true,
          },
        });
      
        return {
          message: 'messages fetched',
          data: messages,
        };
      }
}
