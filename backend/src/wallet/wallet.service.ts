import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from '../entities/user.entity';
import { Transaction, TransactionStatus, TransactionType } from '../entities/transaction.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class WalletService {
  private readonly clickpaymeApiUrl = 'https://api.click.uz/v2/merchant';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async createPayment(userId: string, createPaymentDto: CreatePaymentDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create transaction record
    const transaction = this.transactionRepository.create({
      userId,
      type: createPaymentDto.type,
      amount: createPaymentDto.amount,
      status: TransactionStatus.PENDING,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    try {
      // Create payment with ClickPayme
      const paymentData = {
        amount: createPaymentDto.amount,
        merchant_id: process.env.CLICKPAYME_MERCHANT_ID,
        service_id: process.env.CLICKPAYME_SERVICE_ID,
        transaction_param: savedTransaction.id,
      };

      const response = await axios.post(
        `${this.clickpaymeApiUrl}/payment/create`,
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CLICKPAYME_SECRET_KEY}`,
          },
        },
      );

      // Update transaction with ClickPayme transaction ID
      savedTransaction.clickpaymeTransactionId = response.data.payment_id;
      await this.transactionRepository.save(savedTransaction);

      return {
        transactionId: savedTransaction.id,
        paymentUrl: response.data.payment_url,
        clickpaymeTransactionId: response.data.payment_id,
      };
    } catch (error) {
      savedTransaction.status = TransactionStatus.FAILED;
      await this.transactionRepository.save(savedTransaction);
      throw new BadRequestException('Payment creation failed');
    }
  }

  async verifyPayment(transactionId: string, clickpaymeTransactionId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['user'],
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    try {
      // Verify payment with ClickPayme
      const response = await axios.get(
        `${this.clickpaymeApiUrl}/payment/status/${clickpaymeTransactionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLICKPAYME_SECRET_KEY}`,
          },
        },
      );

      if (response.data.status === 'paid') {
        transaction.status = TransactionStatus.COMPLETED;
        await this.transactionRepository.save(transaction);

        // Update user balance or premium status
        if (transaction.type === TransactionType.DEPOSIT) {
          await this.userRepository.increment(
            { id: transaction.userId },
            'balance',
            Number(transaction.amount),
          );
        } else if (transaction.type === TransactionType.PREMIUM_PURCHASE) {
          await this.userRepository.update(transaction.userId, {
            isPremium: true,
          });
        }

        return { success: true, transaction };
      }

      return { success: false, transaction };
    } catch (error) {
      throw new BadRequestException('Payment verification failed');
    }
  }

  async getUserTransactions(userId: string) {
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getUserBalance(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return {
      balance: user?.balance || 0,
      isPremium: user?.isPremium || false,
    };
  }

  async purchasePremium(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isPremium) {
      throw new BadRequestException('User already has premium');
    }

    const premiumPrice = 50000; // 50,000 UZS (adjust as needed)

    if (user.balance < premiumPrice) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create transaction
    const transaction = this.transactionRepository.create({
      userId,
      type: TransactionType.PREMIUM_PURCHASE,
      amount: premiumPrice,
      status: TransactionStatus.COMPLETED,
    });

    await this.transactionRepository.save(transaction);

    // Deduct balance and activate premium
    await this.userRepository.update(userId, {
      balance: user.balance - premiumPrice,
      isPremium: true,
    });

    return { success: true, transaction };
  }
}
