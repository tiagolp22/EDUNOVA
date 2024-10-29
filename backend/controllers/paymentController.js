// controllers/paymentController.js

const { Payment } = require("../config/db").models;
const { validationResult } = require("express-validator");

/**
 * Create a new payment
 */
exports.createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_id, course_id, amount, status, payment_gateway_response } =
    req.body;

  try {
    const payment = await Payment.create({
      user_id,
      course_id,
      amount,
      status,
      payment_gateway_response,
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Error creating payment" });
  }
};

/**
 * Get all payments
 */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching payments" });
  }
};

/**
 * Get a payment by ID
 */
exports.getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Error fetching payment" });
  }
};

/**
 * Update a payment
 */
exports.updatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { amount, status, payment_gateway_response } = req.body;

  try {
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    payment.amount = amount || payment.amount;
    payment.status = status || payment.status;
    payment.payment_gateway_response =
      payment_gateway_response || payment.payment_gateway_response;

    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: "Error updating payment" });
  }
};

/**
 * Delete a payment
 */
exports.deletePayment = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findByPk(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    await payment.destroy();
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting payment" });
  }
};
