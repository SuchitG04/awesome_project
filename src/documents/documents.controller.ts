import { Controller, Get, Post, Body, Param, Delete, Put, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { SearchDocumentDto } from './dto/search-document.dto';

@ApiTags('documents')
@Controller('api/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The document has been successfully created.' })
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all documents' })
  findAll() {
    return this.documentsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search documents by title or content' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return matching documents' })
  search(@Query() searchDocumentDto: SearchDocumentDto) {
    return this.documentsService.search(searchDocumentDto.query || '');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document by id' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the document' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The document has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The document has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Document not found' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
