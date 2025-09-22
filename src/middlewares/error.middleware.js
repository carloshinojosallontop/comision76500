import mongoose from "mongoose";
import HttpError from "../utils/HttpError.js";

export default function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.errors });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "Internal Server Error" });
}
