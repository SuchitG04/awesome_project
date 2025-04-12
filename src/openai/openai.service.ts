import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(OpenaiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OpenAI API key is not set. AI features will not work.');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async generateSummary(content: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes documents concisely.'
          },
          {
            role: 'user',
            content: `Please provide a concise summary of the following document:\n\n${content}`
          }
        ],
        max_tokens: 300,
      });

      return response.choices[0].message.content || 'No summary generated';
    } catch (error) {
      this.logger.error(`Error generating summary: ${error.message}`);
      return 'Unable to generate summary at this time.';
    }
  }

  async suggestCategories(content: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that suggests relevant categories or tags for documents.'
          },
          {
            role: 'user',
            content: `Please suggest 3-5 relevant categories or tags for the following document. Return only the tags as a comma-separated list with no additional text:\n\n${content}`
          }
        ],
        max_tokens: 100,
      });

      const categoriesText = response.choices[0].message.content || '';
      // Clean up the categories text and return as a comma-separated string
      return categoriesText
        .split(',')
        .map(category => category.trim())
        .filter(category => category.length > 0)
        .join(',');
    } catch (error) {
      this.logger.error(`Error suggesting categories: ${error.message}`);
      return '';
    }
  }

  async answerQuestion(documentContent: string, question: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers questions based on the provided document content. Only answer based on the information in the document.'
          },
          {
            role: 'user',
            content: `Document content:\n\n${documentContent}\n\nQuestion: ${question}\n\nPlease answer the question based only on the information in the document.`
          }
        ],
        max_tokens: 500,
      });

      return response.choices[0].message.content || 'Unable to answer the question based on the document content.';
    } catch (error) {
      this.logger.error(`Error answering question: ${error.message}`);
      return 'Unable to process the question at this time.';
    }
  }
}
