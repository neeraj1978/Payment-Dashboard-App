import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentsFilterDto } from './dto/get-payments-filter.dto';
export declare class PaymentsService {
    private paymentModel;
    constructor(paymentModel: Model<PaymentDocument>);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    findAllPayments(filterDto: GetPaymentsFilterDto): Promise<{
        payments: Payment[];
        total: number;
    }>;
    findPaymentById(id: string): Promise<Payment>;
    getPaymentStats(): Promise<{
        totalPaymentsToday: number;
        totalPaymentsThisWeek: number;
        totalRevenue: any;
        failedTransactionsCount: number;
        revenueLast7Days: {
            date: string;
            revenue: number;
        }[];
    }>;
}
