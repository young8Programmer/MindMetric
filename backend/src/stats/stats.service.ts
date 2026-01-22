import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { TestResult, TestType } from '../entities/test-result.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TestResult)
    private testResultRepository: Repository<TestResult>,
  ) {}

  async getLeaderboard(testType?: TestType, limit: number = 100) {
    let query = this.testResultRepository
      .createQueryBuilder('tr')
      .select([
        'u.id',
        'u.email',
        'u.username',
        'u.firstName',
        'u.lastName',
        'MAX(tr.score) as maxScore',
        'AVG(tr.score) as avgScore',
      ])
      .innerJoin('tr.user', 'u')
      .groupBy('u.id')
      .orderBy('maxScore', 'DESC')
      .limit(limit);

    if (testType) {
      query = query.where('tr.testType = :testType', { testType });
    }

    const results = await query.getRawMany();

    return results.map((result, index) => ({
      rank: index + 1,
      userId: result.u_id,
      email: result.u_email,
      username: result.u_username,
      firstName: result.u_firstName,
      lastName: result.u_lastName,
      maxScore: parseFloat(result.maxScore),
      avgScore: parseFloat(result.avgScore),
    }));
  }

  async getUserStats(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['testResults'],
    });

    if (!user) {
      return null;
    }

    const stats = {
      totalTests: user.testResults.length,
      brainAge: user.brainAge,
      testsByType: {
        reactionTime: user.testResults.filter(
          (r) => r.testType === TestType.REACTION_TIME,
        ).length,
        sequenceMemory: user.testResults.filter(
          (r) => r.testType === TestType.SEQUENCE_MEMORY,
        ).length,
        verbalMemory: user.testResults.filter(
          (r) => r.testType === TestType.VERBAL_MEMORY,
        ).length,
      },
      bestScores: {
        reactionTime: await this.getBestScore(userId, TestType.REACTION_TIME),
        sequenceMemory: await this.getBestScore(
          userId,
          TestType.SEQUENCE_MEMORY,
        ),
        verbalMemory: await this.getBestScore(userId, TestType.VERBAL_MEMORY),
      },
      recentTests: user.testResults
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10),
    };

    return stats;
  }

  async getGlobalStats() {
    const totalUsers = await this.userRepository.count();
    const totalTests = await this.testResultRepository.count();

    const avgBrainAge = await this.userRepository
      .createQueryBuilder('u')
      .select('AVG(u.brainAge)', 'avgBrainAge')
      .where('u.brainAge IS NOT NULL')
      .getRawOne();

    const testsByType = await this.testResultRepository
      .createQueryBuilder('tr')
      .select('tr.testType', 'testType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('tr.testType')
      .getRawMany();

    return {
      totalUsers,
      totalTests,
      avgBrainAge: avgBrainAge ? parseFloat(avgBrainAge.avgBrainAge) : null,
      testsByType: testsByType.reduce((acc, item) => {
        acc[item.testType] = parseInt(item.count);
        return acc;
      }, {}),
    };
  }

  private async getBestScore(userId: string, testType: TestType) {
    const result = await this.testResultRepository.findOne({
      where: { userId, testType },
      order: { score: 'DESC' },
    });

    return result
      ? {
          score: result.score,
          reactionTime: result.reactionTime,
          level: result.level,
          correctAnswers: result.correctAnswers,
          createdAt: result.createdAt,
        }
      : null;
  }

  async getUserProgress(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await this.testResultRepository
      .createQueryBuilder('tr')
      .where('tr.userId = :userId', { userId })
      .andWhere('tr.createdAt >= :startDate', { startDate })
      .orderBy('tr.createdAt', 'ASC')
      .getMany();

    // Group by date
    const progressByDate = results.reduce((acc, result) => {
      const date = result.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(result);
      return acc;
    }, {});

    return Object.entries(progressByDate).map(([date, tests]: [string, any]) => ({
      date,
      count: tests.length,
      avgScore:
        tests.reduce((sum: number, t: TestResult) => sum + Number(t.score), 0) /
        tests.length,
    }));
  }
}
