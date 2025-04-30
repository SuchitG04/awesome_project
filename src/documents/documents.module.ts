import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from '../database/entities/document.entity';
import { Tag } from '../database/entities/tag.entity';
import { TagsOnDocuments } from '../database/entities/tags-on-documents.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Tag, TagsOnDocuments])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService]
})
export class DocumentsModule {}
