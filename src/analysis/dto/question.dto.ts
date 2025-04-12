import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QuestionDto {
  @ApiProperty({
    description: 'The question to answer based on document content',
    example: 'What are the main benefits of artificial intelligence?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;
}
