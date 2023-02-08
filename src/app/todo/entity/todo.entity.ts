import { ApiProperty } from '@nestjs/swagger';
import { HistoryEntity } from 'src/app/history/entities/history.entity';
import { User } from 'src/app/users/entity/user.entity';
import {
  AfterInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'todos' })
export class TodoEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  task: string;

  @Column({ name: 'is_done', type: 'smallint', width: 1 })
  @ApiProperty()
  isDone: number;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty()
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty()
  deletedAt: string;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;

  @OneToMany(() => HistoryEntity, (history) => history.todo, { eager: true })
  histories?: HistoryEntity[];

  constructor(todo?: Partial<TodoEntity>) {
    this.id = todo?.id;
    this.task = todo?.task;
    this.isDone = todo?.isDone;
    this.createdAt = todo?.createdAt;
    this.updatedAt = todo?.updatedAt;
    this.deletedAt = todo?.deletedAt;
  }
}
