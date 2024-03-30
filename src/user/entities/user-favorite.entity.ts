import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('user_favorite')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  user_id: string;

  @Column({ type: 'varchar' })
  post_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;
}
