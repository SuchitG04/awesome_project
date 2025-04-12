import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { QuestionDto } from './dto/question.dto';

@ApiTags('analysis')
@Controller('api/analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get(':documentId')
  @ApiOperation({ summary: 'Get AI-generated analysis for a document' })
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the analysis' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  getAnalysis(@Param('documentId') documentId: string) {
    return this.analysisService.getAnalysis(documentId);
  }

  @Post(':documentId/analyze')
  @ApiOperation({ summary: 'Generate new analysis for a document' })
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the analysis' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  analyzeDocument(@Param('documentId') documentId: string) {
    return this.analysisService.analyzeDocument(documentId);
  }

  @Post(':documentId/question')
  @ApiOperation({ summary: 'Answer a question about a specific document' })
  @ApiParam({ name: 'documentId', description: 'Document ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the answer' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  answerQuestion(
    @Param('documentId') documentId: string,
    @Body() questionDto: QuestionDto,
  ) {
    return this.analysisService.answerQuestion(documentId, questionDto.question);
  }
}
