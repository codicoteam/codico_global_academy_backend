const express = require('express');
const router = express.Router();
const { Paynow } = require("paynow");
const PayCourse = require('../models/pay_course_schema');



router.post('/web-paynow-me', async (req, res) => {
    const paynow = new Paynow("20035", "57832f6f-bd15-4877-81be-c8e30e390a88");
    paynow.resultUrl = "http://example.com/gateways/paynow/update";
    paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";
    
    try {
        const { 
            customerName, customerEmail, customerPhoneNumber, category, 
            courseImage, currency, description, duration, level, price, 
            title, showPayment, isPaid, paymentStatus 
        } = req.body;

        const invoiceNumber = Math.floor(10000 + Math.random() * 90000);
        const invoice = `Invoice ${invoiceNumber}`;

        let payment = paynow.createPayment(invoice,customerEmail);
        payment.add(title, price);

        paynow.send(payment).then(async (response) => {
            console.log(response.error)
            if (response.success) {
                const newPayment = new PayCourse({ 
                    customerName,
                    customerEmail,
                    customerPhoneNumber,
                    category,
                    courseImage,
                    currency,
                    description,
                    duration,
                    level,
                    price,
                    title,
                    showPayment,
                    isPaid,
                    paymentStatus,
                    pollUrl: response.pollUrl
                });

                await newPayment.save();

                res.json({ redirectURL: response.redirectUrl, pollUrl: response.pollUrl });
            } else {
                res.status(500).json({ error: response.errors });
                console.log(response.errors);
            }
        }).catch((error) => {
            console.log(error + "jriewrqoewr");
            res.status(500).json({ error: error.message });
        });

    } catch (error) {
        console.log(error + "jriewrqoewr");
        res.status(500).json({ error: error.message });
    }
});



const processMobilePayment = async (req, res, method) => {
    const paynow = new Paynow("20035", "57832f6f-bd15-4877-81be-c8e30e390a88");
    paynow.resultUrl = "http://example.com/gateways/paynow/update";
    paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";
    try {
        const { 
            customerName, customerEmail, customerPhoneNumber, category, 
            courseImage, currency, description, duration, level, price, 
            title, showPayment, isPaid, paymentStatus 
        } = req.body;

        const invoiceNumber = Math.floor(10000 + Math.random() * 90000);
        const invoice = `Invoice ${invoiceNumber}`;

        let payment = paynow.createPayment(invoice, customerEmail);
        payment.add(title, price);

        const response = await paynow.sendMobile(payment, customerPhoneNumber, method);

        if (response.success) {
            const newPayment = new PayCourse({ 
                customerName,
                customerEmail,
                customerPhoneNumber,
                category,
                courseImage,
                currency,
                description,
                duration,
                level,
                price,
                title,
                showPayment,
                isPaid,
                paymentStatus,
                pollUrl: response.pollUrl
            });

            await newPayment.save();

            res.json({ pollUrl: response.pollUrl, invoiceNumber });
        } else {
            res.status(500).json({ error: response.errors });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

router.post('/mobile-ecocash-paynow-me', (req, res) => processMobilePayment(req, res, 'ecocash'));
router.post('/mobile-netone-paynow-me', (req, res) => processMobilePayment(req, res, Paynow.Methods.ONEMONEY));
router.post('/mobile-telone-paynow-me', (req, res) => processMobilePayment(req, res, Paynow.Methods.TELECASH));

router.post('/check-status', async (req, res) => {
    const paynow = new Paynow("20035", "57832f6f-bd15-4877-81be-c8e30e390a88");
    paynow.resultUrl = "http://example.com/gateways/paynow/update";
    paynow.returnUrl = "http://example.com/return?gateway=paynow&merchantReference=1234";

    try {
        const { pollUrl } = req.body;
        const status = await paynow.pollTransaction(pollUrl);
        console.log(status);

        if (status.status === "paid") {
            await PayCourse.findOneAndUpdate({ pollUrl }, { paymentStatus: "Paid" });
            return res.status(200).json({ status: status.status, message: "Transaction successful." });
        } else if (status.status === "created") {
            return res.status(202).json({ status: status.status, message: "Transaction initiated but no payment has been made." });
        } 
        else if (status.status === "cancelled") {
            return res.status(202).json({ status: status.status, message: "Transaction initiated and cancelled." });
        } 
        else if (status.status === "sent") {
            return res.status(202).json({ status: status.status, message: "Transaction sent to client for payment." });
        } 
        else {
            return res.status(400).json({ status: status.status, message: "Transaction status unknown or failed." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Get all PayCourse records by customerEmail
router.get('/paycourses/:customerEmail', async (req, res) => {
    try {
        const { customerEmail } = req.params;
        const payCourses = await PayCourse.find({ customerEmail });

        if (payCourses.length === 0) {
            return res.status(404).json({ message: "No payment history found for this user." });
        }

        res.status(200).json(payCourses);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while retrieving payment history.", details: error.message });
    }
});


module.exports = router;
