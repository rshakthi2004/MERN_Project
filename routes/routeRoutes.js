import express from "express";
import { getAllRoutes } from "../controllers/routeController.js";
import protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllRoutes);

export default router;
