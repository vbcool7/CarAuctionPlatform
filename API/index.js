
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http'; 
import connectDb from './config/connectDb.js';
import rootRouter from './routes/mainRoutes.js';

dotenv.config();
const app = express();

// Create the server instance
const server = http.createServer(app);

app.use(cors({
    origin: [
        "https://codezens.com",
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.use('/api/v1', rootRouter);

app.get("/", (req, res) => {
    res.send("API is running successfully 🚀");
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`App & Socket running on port : ${PORT}`);
});

export default server;