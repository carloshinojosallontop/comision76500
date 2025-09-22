import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, index: true },
    thumbnails: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);
export default Product;
