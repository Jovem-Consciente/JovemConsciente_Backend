import express from "express";


import { authMiddleware } from "../middlewares/auth_middleware.js";
import { createConsultation, get_auth_consults } from "../controllers/consult_controller.js";
import authorizeRoles from "../middlewares/role_middleware.js"
import { get_data_chat, listMessages } from "../controllers/message_controller.js";


const router = express.Router()

////////////////// POST ROUTES ///////////////////////
router.post("/add_consult", authMiddleware, authorizeRoles("Pacient"), createConsultation);

///////////////// GET ROUTES ////////////////////////

router.get("/list_my_consults", authMiddleware, authorizeRoles("Pacient"), get_auth_consults);
router.get("/get_messages", authMiddleware, authorizeRoles("Pacient"), listMessages);
router.get("/get_data_chat/:id", authMiddleware, authorizeRoles("Pacient"), get_data_chat);

export default router;
