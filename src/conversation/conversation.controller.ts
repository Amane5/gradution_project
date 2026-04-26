import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateChildDto } from '@/children/dto/create-child.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversation')
export class ConversationController {
    constructor(private readonly conversationService:ConversationService){}

    //create new conversation
    @Post()
    create(@Body() dto: CreateConversationDto) {
      return this.conversationService.createConversation(dto);
    }

    @Get(':childId')
    getAll(@Param('childId') childId:string){
        return this.conversationService.getConversations(Number(childId))
    }

}
