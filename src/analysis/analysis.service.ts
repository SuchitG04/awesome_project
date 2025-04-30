import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../database/entities/document.entity';
import { AIAnalysis } from '../database/entities/ai-analysis.entity';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(AIAnalysis)
    private aiAnalysisRepository: Repository<AIAnalysis>,
    private openaiService: OpenaiService,
  ) {}

  async analyzeDocument(documentId: string) {
    // Find the document
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Generate summary using OpenAI
    const summary = await this.openaiService.generateSummary(document.content);

    // Suggest categories using OpenAI (now returns a comma-separated string)
    const categories = await this.openaiService.suggestCategories(document.content);

    // Create or update the analysis
    // First check if analysis exists
    const existingAnalysis = await this.aiAnalysisRepository.findOne({
      where: { documentId },
    });

    let analysis;
    if (existingAnalysis) {
      // Update existing analysis
      existingAnalysis.analysis = summary;
      existingAnalysis.categories = categories;
      analysis = await this.aiAnalysisRepository.save(existingAnalysis);
    } else {
      // Create new analysis
      const newAnalysis = this.aiAnalysisRepository.create({
        documentId,
        analysis: summary,
        categories,
      });
      analysis = await this.aiAnalysisRepository.save(newAnalysis);
    }

    // Update document with summary
    await this.documentRepository.update(documentId, { summary });

    return analysis;
  }

  async getAnalysis(documentId: string) {
    // Find the document
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Find existing analysis
    const analysis = await this.aiAnalysisRepository.findOne({
      where: { documentId },
    });

    // If no analysis exists, create one
    if (!analysis) {
      return this.analyzeDocument(documentId);
    }

    return analysis;
  }

  async answerQuestion(documentId: string, question: string) {
    // Find the document
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Use OpenAI to answer the question based on document content
    const answer = await this.openaiService.answerQuestion(
      document.content,
      question,
    );

    return { question, answer };
  }
}
