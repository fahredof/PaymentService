const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    idPayment: Number,
    cartAuth: String,
    totalCost: Number,
    idOrder: Number
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;