import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 50 })
  author: string;

  @Column({ length: 200, nullable: true })
  cover: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  publish: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publish_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  delete_at: Date;
}
