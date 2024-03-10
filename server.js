

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan"
import connectDB from "./config/db.js";

import cors from 'cors';

import path from 'path'

// import authRoute from "./routes/authRoute.js";
import authRoutes from './routes/authRoute.js'
import categoryRoute from './routes/categoryRoutes.js';
import productRoute from './routes/productRoutes.js';

// configure .env
dotenv.config()


// rest object
const app = express();
const port = process.env.port || 8080;

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// database config
connectDB();

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoute);
app.use('/api/v1/product', productRoute);
app.use(express.static(path.join(__dirname, './client/build'));)

// rest api
app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

//  run listen
app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
})