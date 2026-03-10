import mongoose from "mongoose";
import dns from "dns";

export const connectDB = async () => {
  try {
    // Force Node to use these DNS resolvers (fixes SRV ECONNREFUSED in Node)
    dns.setServers(["1.1.1.1", "8.8.8.8"]);

    console.log("Mongo URI loaded:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};
