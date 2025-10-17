import express from "express";
import { shorternUrl} from "../controllers/urlController.js";

const router = express.Router();

router.post("/shortern", shorternUrl);

export default router;