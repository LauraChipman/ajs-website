// backend/routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CONTACT_EMAIL,
                pass: process.env.CONTACT_EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.CONTACT_RECEIVER_EMAIL,
            subject: `AJ's Website Contact: ${subject}`,
            html: `
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

module.exports = router;
