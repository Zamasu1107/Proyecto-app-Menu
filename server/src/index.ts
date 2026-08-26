import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import router from "./routes/route";
import authrouter from "./routes/auth.route";

const app = express();
const PORT = process.env.PORT || 1001;

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
app.disable('x-powered-by');

app.use('/', router)
app.use('/', authrouter)

app.listen(PORT, () => {
    console.log(`Server is listening in http://localhost:${PORT}`); 
});