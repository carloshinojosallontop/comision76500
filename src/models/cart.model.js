import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true, // Incluye campos virtuales en la salida JSON
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model("Cart", cartSchema);
