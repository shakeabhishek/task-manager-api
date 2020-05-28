const express = require('express')
const router = new express.Router()
const nodemailer = require('nodemailer');

router.post('/send', (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'iib.developer.portal@gmail.com',
            pass: process.env.GMAIL_PASSWORD
        }
    });
    
    let mailOptions = {
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send()
        }
        res.send()
    });
})

module.exports = router