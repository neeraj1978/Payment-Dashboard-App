import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetPaymentsFilterDto } from './dto/get-payments-filter.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(createPaymentDto: CreatePaymentDto): Promise<import("./schemas/payment.schema").Payment>;
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
    getPayments(filterDto: GetPaymentsFilterDto): Promise<{
        payments: import("./schemas/payment.schema").Payment[];
        total: number;
    }>;
    getPaymentById(id: string): Promise<import("./schemas/payment.schema").Payment>;
}
