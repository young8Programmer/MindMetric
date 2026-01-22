import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TestType {
  REACTION_TIME = 'reaction_time',
  SEQUENCE_MEMORY = 'sequence_memory',
  VERBAL_MEMORY = 'verbal_memory',
}

@Entity('test_results')
export class TestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.testResults)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: TestType,
  })
  testType: TestType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  score: number;

  @Column({ type: 'int', nullable: true })
  reactionTime: number; // milliseconds for reaction time

  @Column({ type: 'int', nullable: true })
  level: number; // for sequence memory

  @Column({ type: 'int', nullable: true })
  correctAnswers: number; // for verbal memory

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
