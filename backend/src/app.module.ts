import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TestModule } from './test/test.module';
import { StatsModule } from './stats/stats.module';
import { WalletModule } from './wallet/wallet.module';
import { User } from './entities/user.entity';
import { TestResult } from './entities/test-result.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'mindmetric',
      entities: [User, TestResult, Transaction],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    TestModule,
    StatsModule,
    WalletModule,
  ],
})
export class AppModule {}
