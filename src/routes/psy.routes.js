import express from "express";


import { authMiddleware } from "../middlewares/auth_middleware.js";
import { assum_consult, listConsultation, my_consults } from "../controllers/psy_controller.js";
import authorizeRoles from "../middlewares/role_middleware.js"
import { get_data_chat } from "../controllers/psy_controller.js";


const router = express.Router()

////////////////// POST ROUTES ///////////////////////
router.put("/assum_consult/:id", authMiddleware, authorizeRoles("Psy", "Admin"), assum_consult);

///////////////// GET ROUTES ////////////////////////

router.get("/list_consults", authMiddleware, authorizeRoles("Psy"), listConsultation)
router.get("/list_myconsults", authMiddleware, authorizeRoles("Psy"), my_consults)
router.get("/get_data_chat/:id", authMiddleware, authorizeRoles("Psy"), get_data_chat);

export default router;
