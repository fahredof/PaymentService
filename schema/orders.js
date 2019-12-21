const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    idPayment: Number,
    cartAuth: String,
    userName: String,
    idOrder: Number
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;