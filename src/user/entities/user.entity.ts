import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number; // 标记为主键，值自动生成

  @Column({ length: 50, nullable: false, unique: true })
  username: string;

  @Column({ length: 100, nullable: false })
  password: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 100, nullable: true })
  avatar: string;

  @Column({
    length: 100,
    nullable: true,
    comment: '用户角色 0-普通用户 1-管理员',
  })
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
