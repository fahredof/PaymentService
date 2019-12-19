const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

const log4js = require('log4js');
const logger = log4js.getLogger("server");
logger.level = 'info';

async function start() {
    try {
        mongoose.connect("mongodb://localhost/payment-db",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
        app.listen(4000, () => {
            logger.info("Server is listening\n")
        });
        app.use(bodyParser.json());
        app.use("/payment", require("./routes/index"));
    } catch (error) {
        logger.info(error);
    }
}

start();