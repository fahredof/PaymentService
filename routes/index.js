const express = require("express");
const router = express.Router();
const Order = require("../schema/orders");

const log4js = require('log4js');
const logger = log4js.getLogger("server");
logger.level = 'info';

router.post("/order", (req, res) => {
    if (req.body.idPayment !== undefined && req.body.cartAuth !== undefined
        && req.body.totalCost !== undefined && req.body.idOrder !== undefined) {
        if (Number.isInteger(req.body.idPayment) && typeof req.body.totalCost === "number"
        && Number.isInteger(req.body.idOrder)) {
            Order.create(req.body)
                .then((data) => {
                    res.send(data);
                })
                .catch(error => {
                    logger.info(error);
                    res.send(error);
                });
        } else {
            logger.info("Invalid data type in post request");
            res.send("Invalid data type in post request");
        }
    } else {
        logger.info("Failed to make post request");
        res.send("Failed to make post request");
    }
});

module.exports = router;