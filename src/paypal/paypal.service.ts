import { Injectable } from '@nestjs/common';
import { ApiError, CheckoutPaymentIntent, Client, Environment, LogLevel, OrdersController } from '@paypal/paypal-server-sdk';
import { createClient } from '@supabase/supabase-js';
import * as fx from 'money'; // Import fx đúng cách

@Injectable()
export class PaypalService {
    private readonly client: Client;
    private readonly ordersController: OrdersController;

    constructor() {
        const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error('PayPal client credentials are missing!');
        }

        this.client = new Client({
            clientCredentialsAuthCredentials: {
                oAuthClientId: PAYPAL_CLIENT_ID,
                oAuthClientSecret: PAYPAL_CLIENT_SECRET,
            },
            timeout: 0,
            environment: Environment.Sandbox,  // Sử dụng trực tiếp giá trị Environment.Sandbox
            logging: {
                logLevel: LogLevel.Info,
                logRequest: {
                    logBody: false,
                },
                logResponse: {
                    logHeaders: false,
                },
            },
        });

        this.ordersController = new OrdersController(this.client);

        // Initialize the fx object with proper currency rates
        fx.base = 'VND';
        fx.rates = {
            VND: 1,
            USD: 0.000039,
        };
    }

    async createOrder(totalAmount: string) {
        // Convert the amount from VND to USD using fx
        if (!fx.rates.USD) {
            throw new Error('Currency rates are not set up correctly.');
        }
        const convertedAmount = fx(totalAmount).from('VND').to('USD').toFixed(2);

        const collect = {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
                {
                    amount: {
                        currencyCode: 'USD',
                        value: convertedAmount,
                    },
                },
            ],
        };

        try {
            const response = await this.ordersController.ordersCreate({ body: collect });
            if (response.result && response.result.id) {
                return {
                    orderId: response.result.id,
                    httpStatusCode: response.statusCode,
                };
            } else {
                throw new Error('No order ID returned from PayPal');
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw new Error(error.message);
            }
            throw new Error('Failed to create PayPal order');
        }
    }

    async captureOrder(orderID: string) {
        try {
            const response = await this.ordersController.ordersCapture({ id: orderID });
            return {
                jsonResponse: response.result,
                httpStatusCode: response.statusCode,
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw new Error(error.message);
            }
            throw new Error('Failed to capture PayPal order');
        }
    }
}
