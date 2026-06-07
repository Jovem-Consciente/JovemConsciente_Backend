import express from "express";
import authorizeRoles from "../middlewares/role_middleware.js"
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { get_data_chat, listMessages } from "../controllers/message_controller.js";

export const router = express.Router()

router.get("/get_messages", authMiddleware, authorizeRoles("Pacient"), listMessages);
router.get("/get_data_chat/:id", authMiddleware, authorizeRoles("Pacient", "Psy"), get_data_chat);

export default router;