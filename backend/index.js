import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";
import { redirectUrl } from "./controllers/urlController.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDb();

app.use("/api/url", urlRoutes);
app.get("/:code", redirectUrl);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Running on ${PORT}`))