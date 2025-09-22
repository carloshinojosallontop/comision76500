import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId, // Referencia al modelo de producto
          ref: "Product", // Nombre del modelo referenciado
          required: true,
        },
        quantity: { type: Number, default: 1, min: 1 }, // Cantidad del producto en el carrito
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
