import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class TagsOnDocuments {
  @PrimaryColumn()
  documentId: string;

  @PrimaryColumn()
  tagId: string;

  @ManyToOne('Document', 'tags', {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'documentId' })
  document: any;

  @ManyToOne('Tag', 'documents', {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'tagId' })
  tag: any;
}
