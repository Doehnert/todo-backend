import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { TodoModule } from './app/todo/todo.module';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './auth/auth.module';
import { GcpTranslateService } from './language/gcp-translate/gcp-translate.service';
import { GcpTranslateController } from './language/gcp-translate/gcp-translate.controller';
import { HistoryModule } from './app/history/history.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TodoModule,
    UsersModule,
    AuthModule,
    HistoryModule,
  ],
  controllers: [GcpTranslateController, GcpTranslateController],
  providers: [GcpTranslateService],
})
export class AppModule {}
