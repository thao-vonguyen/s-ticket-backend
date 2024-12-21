// src/paypal/paypal.controller.ts
import { Controller, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('api/orders')
export class PaypalController {
    constructor(private readonly paypalService: PaypalService) { }

    @Post()
    async createOrder(@Body() body: any, @Res() res) {
        try {
            const { purchase_units } = body;
            if (!purchase_units || purchase_units.length === 0) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid purchase units.' });
            }

            const totalAmount = purchase_units[0]?.amount?.value;
            if (!totalAmount || isNaN(totalAmount)) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid total amount.' });
            }

            const { orderId, httpStatusCode } = await this.paypalService.createOrder(totalAmount);

            res.status(httpStatusCode).json({ orderID: orderId });
        } catch (error) {
            console.error('Failed to create order:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create order.' });
        }
    }

    @Post(':orderID/capture')
    async captureOrder(@Param('orderID') orderID: string, @Res() res) {
        try {
            const { jsonResponse, httpStatusCode } = await this.paypalService.captureOrder(orderID);
            res.status(httpStatusCode).json(jsonResponse);
        } catch (error) {
            console.error('Failed to capture order:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to capture order.' });
        }
    }
}
