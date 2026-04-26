import { Injectable } from '@nestjs/common';
import { knowledgeBase } from './knowledge';

@Injectable()
export class RagService {
    findRelevantContent(question:string) : string {
        const lowerQuestion = question.toLowerCase()
        for(const item of knowledgeBase){
            if (lowerQuestion.includes(item.topic) || item.content.includes(lowerQuestion)){
                return item.content
            }
        }
        return ""
    }
}
