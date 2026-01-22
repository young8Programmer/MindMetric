import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { User } from '../entities/user.entity';
import { TestResult } from '../entities/test-result.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TestResult])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
