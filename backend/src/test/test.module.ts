import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestResult } from '../entities/test-result.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestResult, User])],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
