import mongoose from "mongoose";
import HttpError from "../utils/HttpError.js";

export default function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);

  // 1) Validación de Mongoose (schema)
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Validation error",
      errors: Object.fromEntries(
        Object.entries(err.errors).map(([k, v]) => [k, v.message])
      ),
    });
  }

  // 2) ObjectId inválido (CastError)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  // 3) Índice único (E11000 duplicate key)
  // err.name === 'MongoServerError' && err.code === 11000
  if (err?.code === 11000) {
    return res.status(409).json({
      message: "Duplicate key",
      keyValue: err.keyValue,
    });
  }

  // 4) Errores de dominio (tu clase)
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // 5) JSON malformado (body-parser)
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON body" });
  }

  // 6) Fallback
  return res.status(500).json({ message: "Internal Server Error" });
}
