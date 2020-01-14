const amqp = require("amqplib/callback_api");

function conct(data) {
    return (
        amqp.connect("amqp://localhost", function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                let queue = "paymentStatus";

                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
                console.log(" [x] Sent %s", data);
            });

            setTimeout(function () {
                connection.close();
            }, 500);
        })
    );
}

module.exports = conct;