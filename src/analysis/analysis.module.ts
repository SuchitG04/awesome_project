import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { OpenaiModule } from '../openai/openai.module';
import { Document } from '../database/entities/document.entity';
import { AIAnalysis } from '../database/entities/ai-analysis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, AIAnalysis]),
    OpenaiModule
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService],
  exports: [AnalysisService]
})
export class AnalysisModule {}
