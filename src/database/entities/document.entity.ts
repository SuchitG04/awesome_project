import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  summary: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('TagsOnDocuments', 'document', {
    cascade: true,
    onDelete: 'CASCADE'
  })
  tags: any[];

  @OneToOne('AIAnalysis', 'document', {
    cascade: true,
    onDelete: 'CASCADE'
  })
  analysis: any;
}
