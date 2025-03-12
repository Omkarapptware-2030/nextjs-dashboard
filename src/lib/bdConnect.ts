import mongoose from "mongoose";
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log(" database is connected successfully");
    return;
  } else {
    console.log("sorry database is not connected");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully");
    console.log("connection", db.connections);
    console.log("DB", db);
  } catch (error) {
    console.log("database connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;
