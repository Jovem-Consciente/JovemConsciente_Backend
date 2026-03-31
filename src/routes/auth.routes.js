import express from "express"
import {register, login, get_data, get_data_chat, get_messages } from "../controllers/auth_controller.js"
import authorizeRoles from "../middlewares/role_middleware.js"
import { authMiddleware } from "../middlewares/auth_middleware.js";
import role_middleware from "../middlewares/role_middleware.js"

import upload from "../utils/uploads.js"

const router = express.Router()

router.post("/register", upload.single("file"), register);
router.post("/login",upload.none(), login );
router.get("/get_data", authMiddleware, authorizeRoles("Pacient", "Psy"), get_data);
router.get("/get_data_chat/:id", authMiddleware, authorizeRoles("Psy", "Pacient"), get_data_chat);
router.get("/get_data_messages/:id", authMiddleware, authorizeRoles("Psy", "Pacient"), get_messages);

export default router;

