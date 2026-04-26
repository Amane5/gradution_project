import { Body, Controller, Get, Post, Param, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller('ask')
export class QuestionController {
    constructor(private readonly questionService:QuestionService){}
    
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('files', 5))
    async askQuestion(
    @Body() body: AskQuestionDto,
    @UploadedFiles() files: any[],
    @Req() req,
    ) 
    {
    return this.questionService.handleQuestion(
        body,
        body.question,
        req.user.sub,
        files,
    );
    }

//     @Post()
// @UseInterceptors(FileInterceptor('image'))
// async askQuestion(@Req() req) {
//   console.log(req.body);
//   console.log(req.file);
//   return req.body;
// }

    @UseGuards(JwtAuthGuard)
    @Get(':conversationId/messages')
    getMessages(@Param('conversationId') id:string, @Req() req){
        return this.questionService.getConversationMessages(Number(id), req.user.sub)
    }
}


