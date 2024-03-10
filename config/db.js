import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to MongoDB ${connect.connection.host}`)
    }
    catch (error) {
        console.log(`Error connecting ${process.env.MONGO_URL} DB ${error}`)
    }
};

export default connectDB;