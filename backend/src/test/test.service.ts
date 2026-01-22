import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResult, TestType } from '../entities/test-result.entity';
import { User } from '../entities/user.entity';
import { SubmitTestDto } from './dto/submit-test.dto';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestResult)
    private testResultRepository: Repository<TestResult>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async submitTest(userId: string, submitTestDto: SubmitTestDto) {
    const testResult = this.testResultRepository.create({
      ...submitTestDto,
      userId,
    });

    const savedResult = await this.testResultRepository.save(testResult);

    // Update user's brain age if all tests are completed
    await this.updateBrainAge(userId);

    return savedResult;
  }

  async getUserTests(userId: string, testType?: TestType) {
    const where: any = { userId };
    if (testType) {
      where.testType = testType;
    }

    return this.testResultRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async getBestScore(userId: string, testType: TestType) {
    const result = await this.testResultRepository.findOne({
      where: { userId, testType },
      order: { score: 'DESC' },
    });

    return result || null;
  }

  private async updateBrainAge(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return;

    const reactionTimeResults = await this.testResultRepository.find({
      where: { userId, testType: TestType.REACTION_TIME },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const memoryResults = await this.testResultRepository.find({
      where: { userId, testType: TestType.SEQUENCE_MEMORY },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const verbalResults = await this.testResultRepository.find({
      where: { userId, testType: TestType.VERBAL_MEMORY },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    if (
      reactionTimeResults.length > 0 &&
      memoryResults.length > 0 &&
      verbalResults.length > 0
    ) {
      const brainAge = this.calculateBrainAge(
        reactionTimeResults,
        memoryResults,
        verbalResults,
      );

      await this.userRepository.update(userId, { brainAge });
    }
  }

  private calculateBrainAge(
    reactionResults: TestResult[],
    memoryResults: TestResult[],
    verbalResults: TestResult[],
  ): number {
    // Average reaction time (lower is better)
    const avgReactionTime =
      reactionResults.reduce((sum, r) => sum + (r.reactionTime || 0), 0) /
      reactionResults.length;

    // Average memory level (higher is better)
    const avgMemoryLevel =
      memoryResults.reduce((sum, r) => sum + (r.level || 0), 0) /
      memoryResults.length;

    // Average verbal score (higher is better)
    const avgVerbalScore =
      verbalResults.reduce((sum, r) => sum + (r.correctAnswers || 0), 0) /
      verbalResults.length;

    // Normalize factors (0-100 scale)
    // Reaction time: 200ms = 100, 600ms = 0 (inverse relationship)
    const reactionFactor = Math.max(
      0,
      Math.min(100, ((600 - avgReactionTime) / 400) * 100),
    );

    // Memory: level 10 = 100, level 0 = 0
    const memoryFactor = Math.min(100, (avgMemoryLevel / 10) * 100);

    // Verbal: 50 correct = 100, 0 = 0
    const verbalFactor = Math.min(100, (avgVerbalScore / 50) * 100);

    // Calculate brain age (lower factors = older brain age)
    // Base age 20, max age 80
    const brainAge =
      20 + (80 - 20) * (1 - (reactionFactor + memoryFactor + verbalFactor) / 300);

    return Math.round(brainAge * 10) / 10; // Round to 1 decimal
  }

  async getVerbalWords(count: number = 10): Promise<string[]> {
    // Common words list for verbal memory test
    const words = [
      'apple', 'banana', 'cherry', 'dog', 'elephant', 'forest', 'garden',
      'house', 'island', 'jungle', 'kitten', 'lion', 'mountain', 'ocean',
      'planet', 'queen', 'river', 'sunset', 'tiger', 'umbrella', 'valley',
      'water', 'xylophone', 'yellow', 'zebra', 'adventure', 'beautiful',
      'courage', 'diamond', 'energy', 'freedom', 'guitar', 'happiness',
      'imagine', 'journey', 'kindness', 'library', 'miracle', 'nature',
      'oasis', 'peaceful', 'quality', 'rainbow', 'sunshine', 'treasure',
      'universe', 'victory', 'wonder', 'xenial', 'youthful', 'zealous',
    ];

    // Shuffle and return random words
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
}
