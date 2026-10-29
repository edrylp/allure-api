const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/users", userRoutes);
app.use("/products", productRoutes);


// Local development only
if (require.main === module) {
  const PORT = process.env.PORT || 4000;

  mongoose
    .connect(process.env.MONGODB_STRING, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("MongoDB Connected (local)");
      app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
      process.exit(1);
    });
}

module.exports = { app };