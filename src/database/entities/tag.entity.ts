import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany('TagsOnDocuments', 'tag', {
    cascade: true,
    onDelete: 'CASCADE'
  })
  documents: any[];
}
