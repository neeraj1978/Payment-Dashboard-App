"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./schemas/payment.schema");
let PaymentsService = class PaymentsService {
    paymentModel;
    constructor(paymentModel) {
        this.paymentModel = paymentModel;
    }
    async createPayment(createPaymentDto) {
        const createdPayment = new this.paymentModel(createPaymentDto);
        return createdPayment.save();
    }
    async findAllPayments(filterDto) {
        const { startDate, endDate, status, method, page = '1', limit = '10' } = filterDto;
        const query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        else if (startDate) {
            query.createdAt = { $gte: new Date(startDate) };
        }
        else if (endDate) {
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
    async findPaymentById(id) {
        const payment = await this.paymentModel.findById(id).exec();
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID "${id}" not found`);
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
        const last7DaysData = [];
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map