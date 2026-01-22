import { IsEnum, IsNumber, IsOptional, IsObject } from 'class-validator';
import { TestType } from '../../entities/test-result.entity';

export class SubmitTestDto {
  @IsEnum(TestType)
  testType: TestType;

  @IsNumber()
  score: number;

  @IsOptional()
  @IsNumber()
  reactionTime?: number;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsOptional()
  @IsNumber()
  correctAnswers?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
