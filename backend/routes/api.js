const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const courseRoutes = require('./courses');
const enrollmentRoutes = require('./enrollments');
const mediaRoutes = require('./media');
const paymentRoutes = require('./payments');
const progressRoutes = require('./progress');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/media', mediaRoutes);
router.use('/payments', paymentRoutes);
router.use('/progress', progressRoutes);

module.exports = router;