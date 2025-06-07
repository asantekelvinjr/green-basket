import crypto from 'crypto';
import Order from '../models/order.js';

export const paystackWebhook = async (req, res) => {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        const signature = req.headers['x-paystack-signature'];

        if (hash !== signature) {
            return res.status(401).send('Invalid signature');
        }

        const event = req.body;

        if (event.event === 'charge.success') {
            const metadata = event.data.metadata;
            const orderId = metadata?.orderId;

            if (orderId) {
                await Order.findByIdAndUpdate(orderId, {
                    isPaid: true,
                    paymentDetails: event.data,
                });
            }
        }

        return res.sendStatus(200);
    } catch (err) {
        console.error('Webhook error:', err);
        return res.sendStatus(500);
    }
};
