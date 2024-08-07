import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  user_id: string;

  @Column({ type: 'varchar' })
  post_id: string;

  @Column({ type: 'varchar', nullable: true })
  p_id: string;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
