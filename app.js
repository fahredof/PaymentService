const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Eureka = require('eureka-js-client').Eureka;

const app = express();

const PORT = 8080;

const log4js = require("log4js");
const logger = log4js.getLogger("server");
logger.level = 'info';

function randomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const randomStr = randomString(32);

async function start() {
    try {
        mongoose.connect("mongodb://mongo:27017/payment-db",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
        app.listen(PORT, () => {
            logger.info(`Server is listening port:${PORT}\n`);
            const clientEureka = new Eureka({
                instance: {
                    instanceId: `Payment:${randomStr}`,
                    app: 'PAYMENT',
                    hostName: `payment`,
                    ipAddr: '127.0.0.1',
                    vipAddress: 'Payment',
                    port: {
                        '$':PORT,
                        '@enabled':true
                    },
                    statusPageUrl: `http://localhost:${PORT}/info`,
                    dataCenterInfo: {
                        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                        name: 'MyOwn',
                    }
                },
                eureka: {
                    maxRetries: 20,
                    requestRetryDelay: 1000,
                    host: 'eureka',
                    port: 8761,
                    servicePath: '/eureka/apps'
                }
            });
            setTimeout(() => clientEureka.start(error => {
                console.log(error || 'eureka started');
            }), 15000);
        });
        app.use(bodyParser.json());
        app.use("/payment", require("./routes/index"));
    } catch (error) {
        logger.info(error);
    }
}

start();