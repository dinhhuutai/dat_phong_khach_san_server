const asyncHandle = require("express-async-handler");
const paypal = require("paypal-rest-sdk");

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
        "ARi9FUk_AUHdawUMQbl5BVwFWVA3BPa9TmlHLWywzujJvtKYFJiBBQiWQ7PJkdIbjiitQupeOtcyj60j",
    client_secret:
        "EIky57LfDOEj4IhdpOZcDK38NmlLsrJWdyS8V95L-q75CIdevlc4Gkj23if-e3ZKWDrQAonNLKBts6KA",
});

class PaymentController {
    // [POST] /api/v1/payment/paypal/:id
    paypal = asyncHandle(async (req, res, next) => {
        var create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url:
                    "http://localhost:5000/api/v1/payment/paypal-success",
                cancel_url: "http://cancel.url",
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: "item",
                                sku: "item",
                                price: "1.00",
                                currency: "USD",
                                quantity: 1,
                            },
                        ],
                    },
                    amount: {
                        currency: "USD",
                        total: "1.00",
                    },
                    description: "This is the payment description.",
                },
            ],
        };

        console.log(1);
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(321);
                throw error;
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === "approval_url") {
                        console.log(2);
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
    });

    // [GET] /api/v1/payment/paypal-success
    paypalSuccess = asyncHandle(async (req, res, next) => {
        console.log(12345);
        const payerID = req.query.PayerID;

        var execute_payment_json = {
            payer_id: payerID,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: "1.00",
                    },
                },
            ],
        };

        var paymentId = req.query.paymentId;

        paypal.payment.execute(
            paymentId,
            execute_payment_json,
            function (error, payment) {
                if (error) {
                    console.log(error.response);
                    return res.status(200).json({
                        success: false,
                    });
                    throw error;
                } else {
                    console.log("Get Payment Response");
                    console.log(JSON.stringify(payment));

                    return res.status(200).json({
                        success: true,
                    });
                }
            }
        );
    });
}

module.exports = new PaymentController();
