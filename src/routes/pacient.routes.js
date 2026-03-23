import express from "express";


import { authMiddleware } from "../middlewares/auth_middleware.js";
import { createConsultation, listConsultation, listMessages } from "../controllers/pacient_controller.js";
import authorizeRoles from "../middlewares/role_middleware.js"


const router = express.Router()

////////////////// POST ROUTES ///////////////////////
router.post("/add_consult", authMiddleware, authorizeRoles("Pacient"), createConsultation);

///////////////// GET ROUTES ////////////////////////

router.get("/list_consults", authMiddleware, authorizeRoles("Pacient"), listConsultation);
router.get("/get_messages", authMiddleware, authorizeRoles("Pacient"), listMessages);

export default router;
