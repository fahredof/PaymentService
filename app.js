const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Eureka = require('eureka-js-client').Eureka;

const app = express();

const log4js = require("log4js");
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

        const clientEureca = new Eureka({

            instance: {
                app: 'Payment',
                ipAddr: '127.0.0.1',
                vipAddress: 'Payment',
                dataCenterInfo: {
                    name: 'MyOwn',
            },

            port: 8082,

        },
            eureca: {
                 serviceUrls:{
                     default: [
                         'http://localhost:8085/eureka'
                     ]
                 },
                host: 'http://localhost:',
                    port: 8085,
                    servicePath: 'eureca'
            },
        });

        clientEureca.start(error => {
            console.log(error || 'eureca started');
        });

    } catch (error) {
        logger.info(error);
    }
}

start();