import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'The title of the document',
    example: 'Introduction to AI',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the document',
    example: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines...',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Tags associated with the document',
    example: ['AI', 'Technology', 'Machine Learning'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
