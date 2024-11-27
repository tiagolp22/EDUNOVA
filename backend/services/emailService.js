const nodemailer = require('nodemailer');
const { createTransport } = require('nodemailer');
const pug = require('pug');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(to, subject, template, data) {
    const html = pug.renderFile(
      path.join(__dirname, `../views/emails/${template}.pug`),
      data
    );

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendEnrollmentConfirmation(userEmail, courseName) {
    await this.sendEmail(
      userEmail,
      'Enrollment Confirmation',
      'enrollment',
      { courseName }
    );
  }

  async sendPaymentConfirmation(userEmail, courseName, amount) {
    await this.sendEmail(
      userEmail,
      'Payment Confirmation',
      'payment',
      { courseName, amount }
    );
  }
}

module.exports = new EmailService();