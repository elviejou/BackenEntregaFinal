import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    _id: { type: Number, required: true },
    email: { type: String, required: true },
    timestamp: { type: Number, required: true },
    productos: { type: Array, required: true },
    state: { type: String, default: 'generada' },
});

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;