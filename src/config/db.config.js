import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/db_ecommerce";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB", mongoose.connection.name))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
