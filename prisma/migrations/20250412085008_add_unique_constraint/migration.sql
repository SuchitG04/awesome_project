/*
  Warnings:

  - A unique constraint covering the columns `[documentId]` on the table `AIAnalysis` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AIAnalysis_documentId_key" ON "AIAnalysis"("documentId");
