import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dashboard } from '../../dashboard/entities/dashboard.entity';

@Entity('charts')
export class Chart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Dashboard, (dashboard) => dashboard.charts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dashboardId' })
  dashboard: Dashboard;

  @Column()
  dashboardId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
