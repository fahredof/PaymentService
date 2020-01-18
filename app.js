const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Eureka = require('eureka-js-client').Eureka;

const app = express();

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


async function start() {
    try {
        mongoose.connect("mongodb://localhost/payment-db",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
        const server = app.listen(0, () => {
            const port = server.address().port;
            logger.info(`Server is listening port:${port}\n`);
            const clientEureka = new Eureka({
                instance: {
                    app: 'Payment',
                    hostName: `Payment:${randomString(32)}`,
                    ipAddr: '127.0.0.1',
                    vipAddress: 'Payment',
                    port: {
                        '$':port,
                        '@enabled':true
                    },
                    statusPageUrl: `http://localhost:${port}/`,
                    dataCenterInfo: {
                        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                        name: 'MyOwn',
                    }
                },
                eureka: {
                    host: 'localhost',
                    port: 8761,
                    servicePath: '/eureka/apps'
                }
            });

            clientEureka.start(error => {
                console.log(clientEureka.getInstancesByAppId('Payment')[0]);
                console.log(error || 'eureka started');
            });
        });
        app.use(bodyParser.json());
        app.use("/payment", require("./routes/index"));
    } catch (error) {
        logger.info(error);
    }
}

start();