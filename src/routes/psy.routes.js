import express from "express";


import { authMiddleware } from "../middlewares/auth_middleware.js";
import authorizeRoles from "../middlewares/role_middleware.js"
import { assum_consult, get_auth_consults, list_consullts } from "../controllers/consult_controller.js";
import { get_data_chat } from "../controllers/message_controller.js";


const router = express.Router()

////////////////// POST ROUTES ///////////////////////
router.put("/assum_consult/:id", authMiddleware, authorizeRoles("Psy", "Admin"), assum_consult);

///////////////// GET ROUTES ////////////////////////

router.get("/list_consults", authMiddleware, authorizeRoles("Psy"), list_consullts)
router.get("/list_my_consults", authMiddleware, authorizeRoles("Psy"), get_auth_consults)
router.get("/get_data_chat/:id", authMiddleware, authorizeRoles("Psy"), get_data_chat);

export default router;
