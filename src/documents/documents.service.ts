import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Document } from '../database/entities/document.entity';
import { Tag } from '../database/entities/tag.entity';
import { TagsOnDocuments } from '../database/entities/tags-on-documents.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(TagsOnDocuments)
    private tagsOnDocumentsRepository: Repository<TagsOnDocuments>
  ) {}

  async create(createDocumentDto: CreateDocumentDto) {
    const { tags, ...documentData } = createDocumentDto;
    
    // Create document
    const document = this.documentRepository.create(documentData);
    await this.documentRepository.save(document);
    
    // Create tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create tag
        let tag = await this.tagRepository.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          await this.tagRepository.save(tag);
        }
        
        // Create relation
        const tagOnDocument = this.tagsOnDocumentsRepository.create({
          documentId: document.id,
          tagId: tag.id,
          document,
          tag
        });
        await this.tagsOnDocumentsRepository.save(tagOnDocument);
      }
    }
    
    // Return document with tags
    return this.findOne(document.id);
  }

  async findAll() {
    const documents = await this.documentRepository.find({
      relations: {
        tags: {
          tag: true
        }
      }
    });
    return documents;
  }

  async findOne(id: string) {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: {
        tags: {
          tag: true
        }
      }
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    const { tags, ...documentData } = updateDocumentDto;
    
    // Check if document exists
    const existingDocument = await this.documentRepository.findOne({
      where: { id },
      relations: { tags: true }
    });

    if (!existingDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Update document data
    await this.documentRepository.update(id, documentData);

    // If tags are provided, update them
    if (tags) {
      // Delete existing tags
      await this.tagsOnDocumentsRepository.delete({ documentId: id });

      // Create new tag connections
      for (const tagName of tags) {
        // Find or create tag
        let tag = await this.tagRepository.findOne({ where: { name: tagName } });
        if (!tag) {
          tag = this.tagRepository.create({ name: tagName });
          await this.tagRepository.save(tag);
        }
        
        // Create relation
        const tagOnDocument = this.tagsOnDocumentsRepository.create({
          documentId: id,
          tagId: tag.id
        });
        await this.tagsOnDocumentsRepository.save(tagOnDocument);
      }
    }

    // Return updated document with tags
    return this.findOne(id);
  }

  async remove(id: string) {
    // Check if document exists
    const document = await this.documentRepository.findOne({
      where: { id }
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Delete document (cascade will handle related entities)
    await this.documentRepository.delete(id);
    return { id };
  }

  async search(query: string) {
    if (!query) {
      return this.findAll();
    }

    // For SQLite, we need to use LIKE for search
    // We'll use the % wildcard for partial matches
    const searchPattern = `%${query}%`;
    
    const documents = await this.documentRepository.find({
      where: [
        { title: Like(searchPattern) },
        { content: Like(searchPattern) }
      ],
      relations: {
        tags: {
          tag: true
        }
      }
    });

    return documents;
  }
}
