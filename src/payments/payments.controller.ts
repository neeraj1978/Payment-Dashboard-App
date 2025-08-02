// src/payments/payments.controller.ts
import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpStatus, HttpCode } from '@nestjs/common'; // <-- Zaroori decorators import kiye
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto'; // DTO import kiya
import { GetPaymentsFilterDto } from './dto/get-payments-filter.dto';
import { AuthGuard } from '@nestjs/passport'; // AuthGuard import kiya

@Controller('payments') // Yeh base path '/payments' set karta hai 
@UseGuards(AuthGuard('jwt')) // JWT Guard lagaya saare endpoints ko secure karne ke liye
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post() // <-- Yeh decorator POST requests ko /payments par handle karega 
  @HttpCode(HttpStatus.CREATED) // Optional: HTTP status code for successful creation
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto); // Service method call kiya
  }

  @Get('stats') // GET /payments/stats endpoint ke liye [cite: 44]
  async getPaymentStats() {
    return this.paymentsService.getPaymentStats();
  }

  @Get() // GET /payments endpoint ke liye (list with filters, pagination) [cite: 41]
  async getPayments(@Query() filterDto: GetPaymentsFilterDto) {
    return this.paymentsService.findAllPayments(filterDto);
  }

  @Get(':id') // GET /payments/:id endpoint ke liye (view a single payment) [cite: 42]
  async getPaymentById(@Param('id') id: string) {
    return this.paymentsService.findPaymentById(id);
  }
}