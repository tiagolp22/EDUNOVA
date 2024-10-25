// routes/payments.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middleware/auth');
const { body, param } = require('express-validator');

// All routes below require authentication
router.use(authenticateToken);

// Create a new payment
router.post('/', [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('course_id').isInt().withMessage('Course ID must be an integer'),
    body('amount').isDecimal({ min: 0 }).withMessage('Amount must be a positive decimal'),
    body('status').isIn(['pending', 'completed', 'failed']).withMessage('Status must be pending, completed, or failed'),
    body('payment_gateway_response').optional().isJSON().withMessage('Payment gateway response must be a valid JSON')
], paymentController.createPayment);

// Get all payments
router.get('/', paymentController.getAllPayments);

// Get a payment by ID
router.get('/:id', [
    param('id').isInt().withMessage('Payment ID must be an integer')
], paymentController.getPaymentById);

// Update a payment
router.put('/:id', [
    param('id').isInt().withMessage('Payment ID must be an integer'),
    body('amount').optional().isDecimal({ min: 0 }).withMessage('Amount must be a positive decimal'),
    body('status').optional().isIn(['pending', 'completed', 'failed']).withMessage('Status must be pending, completed, or failed'),
    body('payment_gateway_response').optional().isJSON().withMessage('Payment gateway response must be a valid JSON')
], paymentController.updatePayment);

// Delete a payment
router.delete('/:id', [
    param('id').isInt().withMessage('Payment ID must be an integer')
], paymentController.deletePayment);

module.exports = router;
