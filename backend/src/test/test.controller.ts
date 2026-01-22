import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TestService } from './test.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TestType } from '../entities/test-result.entity';

@Controller('test')
@UseGuards(JwtAuthGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('submit')
  async submitTest(@Request() req, @Body() submitTestDto: SubmitTestDto) {
    return this.testService.submitTest(req.user.id, submitTestDto);
  }

  @Get('history')
  async getTestHistory(
    @Request() req,
    @Query('testType') testType?: TestType,
  ) {
    return this.testService.getUserTests(req.user.id, testType);
  }

  @Get('best-score')
  async getBestScore(
    @Request() req,
    @Query('testType') testType: TestType,
  ) {
    return this.testService.getBestScore(req.user.id, testType);
  }

  @Get('verbal/words')
  async getVerbalWords(@Query('count') count?: number) {
    return this.testService.getVerbalWords(count ? parseInt(count.toString()) : 10);
  }
}
