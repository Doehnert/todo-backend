import { ApiProperty } from '@nestjs/swagger';
import { TodoEntity } from 'src/app/todo/entity/todo.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'histories' })
export class HistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ nullable: true })
  task: string;

  @ApiProperty()
  @Column({ default: false })
  isTranslated: boolean;

  @Column({ name: 'is_done', type: 'smallint', width: 1 })
  @ApiProperty()
  isDone: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @ManyToOne(() => TodoEntity, (todo) => todo.histories)
  todo: TodoEntity;
}
