import { Injectable } from '@nestjs/common';
import { CreateHistoryDto } from './dto/create-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity } from './entities/history.entity';
import { Repository } from 'typeorm';
import { TodoEntity } from '../todo/entity/todo.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto, todo: TodoEntity) {
    const hist = this.historyRepository.create(createHistoryDto);
    hist.todo = todo;

    await this.historyRepository.save(hist);
  }
}
