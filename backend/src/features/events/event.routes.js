import express from "express";
import {
  createEventController,
  getAllEventsController,
  getUpcomingEventsController,
  deleteEventController
} from "./event.controller.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createEventController);
router.get("/",authMiddleware, getAllEventsController);
router.get("/upcoming",authMiddleware, getUpcomingEventsController);
router.delete("/:id", deleteEventController);
export default router;
