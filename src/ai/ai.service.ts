import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';

@Injectable()
export class AiService {
    private openai: OpenAI
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        })
    }
    
    async generateAnswerWithContext(question: string,context : string , age: number): Promise<string> {
        try {
          const response = await this.openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
              {
                role: 'system',
                content: `
                You are a teacher for children.

                Use this information to answer:
                ${context}
                
                Explain to a ${age}-year-old child.
                Use simple words and examples.
      `,
              },
              {
                role: 'user',
                content: question,
              },
            ],
          });
          console.log("API KEY:", process.env.OPENAI_API_KEY);
          return response.choices[0].message.content || 'No answer';
        } catch (error) {
            console.error("AI ERROR:", error);
          
            // 🔥 fallback + RAG
            if (context) {
              return `🤖 Simple explanation:         
          ${context}`;
            }
          
            return this.generateFallbackAnswer(question, age);
          }
      }

    private generateFallbackAnswer(question: string, age: number): string {
      if (age <= 6) {
        return `🤖 Let's learn together!
    
    The answer is simple: ${question}
    
    Imagine it like a story... things happen in a fun way!
    
    Can you think about it? 😊`;
      }
    
      return `🤖 Simple explanation:
    
    ${question} has a simple explanation, and we can understand it step by step.
    
    Think about it carefully, and try to answer this:
    What do you think is the reason?`;
    }

    async generateTitle(question: string): Promise<string> {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content: 'Generate a very short title (max 5 words) for this question.',
            },
            {
              role: 'user',
              content: question,
            },
          ],
        });
    
        return response.choices[0].message.content || 'New Chat';
      } catch (error) {
        console.error('TITLE AI ERROR:', error);
    
        // fallback
        return question.split(' ').slice(0, 4).join(' ');
      }
    }

    async analyzeImage(imagePath: string, age: number): Promise<string> {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Explain this image for a ${age} year old child in simple words`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      });

      return response.choices[0].message.content || "No image explanation";
    }

    async speechToText(audioPath: string): Promise<string> {
      const response = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: "gpt-4o-transcribe",
      });
    
      return response.text;
    }
}
