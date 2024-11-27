const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment } = require('../models');

class PaymentService {
  async processPayment({ amount, userId, courseId, paymentMethod }) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method: paymentMethod,
      confirm: true
    });

    const payment = await Payment.create({
      user_id: userId,
      course_id: courseId,
      amount,
      status: paymentIntent.status,
      payment_gateway_response: paymentIntent
    });

    return payment;
  }

  async createRefund(paymentId) {
    const payment = await Payment.findByPk(paymentId);
    const refund = await stripe.refunds.create({
      payment_intent: payment.payment_gateway_response.id
    });

    await payment.update({
      status: 'refunded',
      refund_data: refund
    });

    return refund;
  }
}

module.exports = new PaymentService();