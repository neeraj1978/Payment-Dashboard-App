// src/payments/payments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema'; // Yeh import sahi hona chahiye
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentsFilterDto } from './dto/get-payments-filter.dto';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const createdPayment = new this.paymentModel(createPaymentDto);
    return createdPayment.save();
  }

  async findAllPayments(filterDto: GetPaymentsFilterDto): Promise<{ payments: Payment[], total: number }> {
    const { startDate, endDate, status, method, page = '1', limit = '10' } = filterDto;
    const query: any = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    if (status) {
      query.status = status;
    }

    if (method) {
      query.method = { $regex: method, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await this.paymentModel.countDocuments(query).exec();
    const payments = await this.paymentModel
      .find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .exec();

    return { payments, total };
  }

  async findPaymentById(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
    return payment;
  }

  async getPaymentStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(0, 0, 0, 0);

    // FIX: Explicitly type the array to resolve the 'never' error
    const last7DaysData: { date: string; revenue: number }[] = []; 

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      const dailyRevenueResult = await this.paymentModel.aggregate([
        { $match: { createdAt: { $gte: date, $lt: nextDay }, status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]).exec();

      last7DaysData.push({
        date: date.toISOString().split('T')[0],
        revenue: dailyRevenueResult.length > 0 ? dailyRevenueResult[0].total : 0,
      });
    }

    const totalPaymentsToday = await this.paymentModel.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    }).exec();

    const totalPaymentsThisWeek = await this.paymentModel.countDocuments({
      createdAt: { $gte: startOfWeek, $lt: endOfWeek },
    }).exec();

    const totalRevenueResult = await this.paymentModel.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]).exec();
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    const failedTransactionsCount = await this.paymentModel.countDocuments({
      status: 'failed',
    }).exec();

    return {
      totalPaymentsToday,
      totalPaymentsThisWeek,
      totalRevenue,
      failedTransactionsCount,
      revenueLast7Days: last7DaysData,
    };
  }
}