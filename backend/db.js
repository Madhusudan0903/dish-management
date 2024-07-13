const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://madhusudan09mss:gFxPayJnJKTg9I6G@cluster0.oiyzrxz.mongodb.net/dish-management?retryWrites=true&w=majority&appName=Cluster0');
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB", error.message);
  }
};

module.exports = connectDB;
