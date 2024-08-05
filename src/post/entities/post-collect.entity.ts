import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('post_collect')
export class PostCollectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  user_id: number;

  @Column({ type: 'numeric' })
  post_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
