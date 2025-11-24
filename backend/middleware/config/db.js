import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const connectDb = async() => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(process.env.MONGODB_URL, options);
        console.log("MongoDB Connected Successfully");
        
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        // Retry connection after 5 seconds
        setTimeout(connectDb, 5000);
    }
}

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected! Attempting to reconnect...');
    connectDb();
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    connectDb();
});

export default connectDb;
