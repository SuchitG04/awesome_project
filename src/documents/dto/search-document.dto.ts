import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDocumentDto {
  @ApiProperty({
    description: 'Search query for document title or content',
    example: 'artificial intelligence',
    required: false,
  })
  @IsString()
  @IsOptional()
  query?: string;
}
