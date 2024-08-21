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

  @Column({
    length: 20,
    nullable: true,
    default: '0',
    comment: '文章状态 1 发布 0 草稿',
  })
  status: string;

  @Column({ length: 200, nullable: true, comment: '文章描述' })
  desc: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  is_top: boolean;

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
