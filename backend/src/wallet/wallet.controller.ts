import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
  Query,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('payment')
  async createPayment(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.walletService.createPayment(req.user.id, createPaymentDto);
  }

  @Get('payment/verify')
  async verifyPayment(
    @Query('transactionId') transactionId: string,
    @Query('clickpaymeTransactionId') clickpaymeTransactionId: string,
  ) {
    return this.walletService.verifyPayment(transactionId, clickpaymeTransactionId);
  }

  @Get('balance')
  async getBalance(@Request() req) {
    return this.walletService.getUserBalance(req.user.id);
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    return this.walletService.getUserTransactions(req.user.id);
  }

  @Post('premium/purchase')
  async purchasePremium(@Request() req) {
    return this.walletService.purchasePremium(req.user.id);
  }
}
