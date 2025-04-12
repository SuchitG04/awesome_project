import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenaiService } from '../openai/openai.service';

@Injectable()
export class AnalysisService {
  constructor(
    private prisma: PrismaService,
    private openaiService: OpenaiService,
  ) {}

  async analyzeDocument(documentId: string) {
    // Find the document
    const document = await this.prisma.document.findUnique({
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
    const existingAnalysis = await this.prisma.aIAnalysis.findUnique({
      where: { documentId },
    });

    let analysis;
    if (existingAnalysis) {
      // Update existing analysis
      analysis = await this.prisma.aIAnalysis.update({
        where: { documentId },
        data: {
          analysis: summary,
          categories,
        },
      });
    } else {
      // Create new analysis
      analysis = await this.prisma.aIAnalysis.create({
        data: {
          documentId,
          analysis: summary,
          categories,
        },
      });
    }

    // Update document with summary
    await this.prisma.document.update({
      where: { id: documentId },
      data: { summary },
    });

    return analysis;
  }

  async getAnalysis(documentId: string) {
    // Find the document
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Find existing analysis
    const analysis = await this.prisma.aIAnalysis.findUnique({
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
    const document = await this.prisma.document.findUnique({
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
