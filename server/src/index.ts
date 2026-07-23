import express from "express";
import cors from "cors";
import router from "./routes/route";

const app = express();
const PORT = process.env.PORT || 1001;

app.use(express.json())
app.use(cors());
app.disable('x-powered-by');

app.use('/', router)
app.use('/', router)
app.use('/', router)
app.use('/', router)
app.use('/', router)

app.listen(PORT, () => {
    console.log(`Server is listening in http://localhost:${PORT}`); 
});