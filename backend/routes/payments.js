const router = require('express').Router();
const PaymentController = require('../controllers/PaymentController');
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.use(auth);

router.post('/', rateLimiter('payment'), PaymentController.createPayment);
router.get('/history', PaymentController.getPaymentHistory);

module.exports = router;