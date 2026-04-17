import express from "express";


import { authMiddleware } from "../middlewares/auth_middleware.js";
import { createConsultation, get_data_chat, listConsultation, listMessages } from "../controllers/pacient_controller.js";
import authorizeRoles from "../middlewares/role_middleware.js"


const router = express.Router()

////////////////// POST ROUTES ///////////////////////
router.post("/add_consult", authMiddleware, authorizeRoles("Pacient"), createConsultation);

///////////////// GET ROUTES ////////////////////////

router.get("/list_consults", authMiddleware, authorizeRoles("Pacient"), listConsultation);
router.get("/get_messages", authMiddleware, authorizeRoles("Pacient"), listMessages);
router.get("/get_data_chat/:id", authMiddleware, authorizeRoles("Pacient"), get_data_chat);
export default router;
