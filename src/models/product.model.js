import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    timestamp: {type: Number, require: true},
    title: {type: String, require: true},
    description: String,
    code: String,
    thumbnails: String,
    price: {type: Number, require: true},
    stock: {type: Number, require: true},
    category: String
});

const productModel = mongoose.model("product", productSchema);

export default productModel;