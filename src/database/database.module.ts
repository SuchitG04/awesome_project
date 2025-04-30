import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Document } from '../database/entities/document.entity';
import { Tag } from '../database/entities/tag.entity';
import { TagsOnDocuments } from '../database/entities/tags-on-documents.entity';
import { AIAnalysis } from '../database/entities/ai-analysis.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_URL', 'database.sqlite'),
        entities: [Document, Tag, TagsOnDocuments, AIAnalysis],
        synchronize: true, // Set to false in production
        autoLoadEntities: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
