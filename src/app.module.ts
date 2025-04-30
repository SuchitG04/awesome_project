import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentsModule } from './documents/documents.module';
import { AnalysisModule } from './analysis/analysis.module';
import { OpenaiModule } from './openai/openai.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DocumentsModule,
    AnalysisModule,
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
