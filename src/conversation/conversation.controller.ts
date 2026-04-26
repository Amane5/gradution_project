import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateChildDto } from '@/children/dto/create-child.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';

@Controller('conversation')
export class ConversationController {
    constructor(private readonly conversationService:ConversationService){}

    //create new conversation
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateConversationDto) {
      return this.conversationService.createConversation(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':childId')
    getAll(@Param('childId') childId:string){
        return this.conversationService.getConversations(Number(childId))
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':conversationId')
    deleteConversation(
      @Param('conversationId', ParseIntPipe) conversationId: number,
      @Req() req,
    ) {
      const childId = req.user.sub;;
      return this.conversationService.deleteConversation(conversationId, childId);
    }
}

