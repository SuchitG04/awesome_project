import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class AIAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentId: string;

  @Column()
  analysis: string;

  @Column()
  categories: string; // Comma-separated list of categories

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne('Document', 'analysis')
  @JoinColumn({ name: 'documentId' })
  document: any;
}
