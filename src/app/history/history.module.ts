import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryEntity])],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
