import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TestType } from '../entities/test-result.entity';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('leaderboard')
  async getLeaderboard(
    @Query('testType') testType?: TestType,
    @Query('limit') limit?: number,
  ) {
    return this.statsService.getLeaderboard(
      testType,
      limit ? parseInt(limit.toString()) : 100,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserStats(@Request() req) {
    return this.statsService.getUserStats(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('progress')
  async getUserProgress(
    @Request() req,
    @Query('days') days?: number,
  ) {
    return this.statsService.getUserProgress(
      req.user.id,
      days ? parseInt(days.toString()) : 30,
    );
  }

  @Get('global')
  async getGlobalStats() {
    return this.statsService.getGlobalStats();
  }
}
