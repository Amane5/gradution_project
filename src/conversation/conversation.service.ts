import { prisma } from '@/lib/prisma';
import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationService {
    async createConversation (dto:CreateConversationDto){
        const {childId, question}= dto
        const conversation = await prisma.conversation.create({
            data:{
                childId,
                title:question.slice(0,50)
            }
        })
        return {
            message:"Conversation created",
            data: conversation
        }
    }

    async getConversations(childId:number){
        const conversations = await prisma.conversation.findMany({
            where:{childId},
            orderBy:{createdAt:"desc"},
            select:{
                id:true,
                title:true,
                createdAt:true
            }
        })
        return{
            message:"Conversation fetched",
            data:conversations
        }
    }
}
