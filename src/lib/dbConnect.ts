import mongoose from "mongoose";
require('dotenv').config();
type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already  connected to DB");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log(db);
    console.log("DB connected Successfully");
  } catch (error) {
    console.log("DB connection failed!.");

    process.exit(1);
  }
}
export default dbConnect;
