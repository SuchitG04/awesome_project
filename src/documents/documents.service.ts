import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDocumentDto: CreateDocumentDto) {
    const { tags, ...documentData } = createDocumentDto;
    
    // Create document with tags if provided
    return this.prisma.document.create({
      data: {
        ...documentData,
        tags: tags && tags.length > 0 ? {
          create: tags.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        } : undefined,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.document.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    const { tags, ...documentData } = updateDocumentDto;
    
    // Check if document exists
    const existingDocument = await this.prisma.document.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!existingDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // If tags are provided, update them
    if (tags) {
      // Delete existing tags
      await this.prisma.tagsOnDocuments.deleteMany({
        where: { documentId: id },
      });

      // Create new tag connections
      await Promise.all(
        tags.map(async (tagName) => {
          const tag = await this.prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });

          return this.prisma.tagsOnDocuments.create({
            data: {
              documentId: id,
              tagId: tag.id,
            },
          });
        })
      );
    }

    // Update document data
    return this.prisma.document.update({
      where: { id },
      data: documentData,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    // Check if document exists
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Delete document (cascade will handle related entities)
    return this.prisma.document.delete({
      where: { id },
    });
  }

  async search(query: string) {
    if (!query) {
      return this.findAll();
    }

    // For SQLite, we'll use a simpler search without case-insensitive mode
    // We'll convert both the search query and the fields to lowercase for case-insensitive search
    const lowerQuery = query.toLowerCase();

    // Get all documents first
    const documents = await this.prisma.document.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Filter documents manually for case-insensitive search
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) || 
      doc.content.toLowerCase().includes(lowerQuery)
    );
  }
}
