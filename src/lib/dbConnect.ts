import mongoose from "mongoose";

type connectionObject = {
  isConnected?: boolean;
};

const connection: connectionObject = {};

const mongoDBConnect = async () => {
  if (connection.isConnected) {
    console.log("Database already connected");
    return;
  }

  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL || "");

    const host = connect.connection.host;

    console.log("DB is connected to: " + host);
  } catch (error: any) {
    console.log("Error connecting to MongoDB: " + error.message || "");
    process.exit(1);
  }
};

export default mongoDBConnect;
