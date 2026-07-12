
import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log(`DB Connection Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.log("DB Connection Error :", error);
        process.exit(1);
    }
};

export default connectDb;