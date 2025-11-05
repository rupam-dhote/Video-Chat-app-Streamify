import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDb Connected : ${conn.connection.host}`);
  } catch (err) {
    console.log("Error in Connecting to MongoDb : ",err);
    process.exit(1);
  }
};
