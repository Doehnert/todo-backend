import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from '../history/entities/history.entity';
import { HistoryModule } from '../history/history.module';
import { HistoryService } from '../history/history.service';
import { TodoEntity } from './entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity]),
    TypeOrmModule.forFeature([HistoryEntity]),
    HistoryModule,
  ],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}
