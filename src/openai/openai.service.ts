import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { UserContextService } from 'src/user-context/user-context.service';
import ollama from 'ollama';
import wellnessMentorPrompt from 'src/prompts/wellness-mentor.prompt';
@Injectable()
export class OpenaiService {
  constructor(private readonly context: UserContextService) {}

  private readonly openai = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'process.env.OPENAI_API_KEY',
  });
  private readonly logger = new Logger(OpenaiService.name);

  async generateAIResponse(userID: string, userInput: string) {
    try {
      const systemPrompt = wellnessMentorPrompt;

      const userContext = await this.context.saveAndFetchContext(
        userInput,
        'user',
        userID,
      );
      this.logger.log(userContext);

      const response = await ollama.chat({
        messages: [{ role: 'system', content: systemPrompt }, ...userContext],
        model: 'llama3.2:3b-instruct-q4_K_M',
        keep_alive: 3000,
      });

      const aiResponse = response.message.content;

      await this.context.saveToContext(aiResponse, 'assistant', userID);

      return aiResponse;
    } catch (error) {
      this.logger.error('Error generating AI response', error);
      return 'Sorry, I am unable to process your request at the moment.';
    }
  }
}
