import express from "express";
import authorizeRoles from "../middlewares/role_middleware.js"
import { authMiddleware } from "../middlewares/auth_middleware.js";
import role_middleware from "../middlewares/role_middleware.js";
import { get_consults_pacient, get_data_pacient, list_pacients } from "../controllers/pacient_controller.js";
import { get_consults_psy, get_data_psy, list_psy } from "../controllers/psy_controller.js";
import { list_consullts } from "../controllers/consult_controller.js";

const router = express.Router()

router.get("/list/pacients", authMiddleware, authorizeRoles("Admin"), list_pacients);
router.get("/list/psy", authMiddleware, authorizeRoles("Admin"), list_psy);

router.get("/data/pacient", authMiddleware, authorizeRoles("Admin"), get_data_pacient);
router.get("/data/psy", authMiddleware, authorizeRoles("Admin"), get_data_psy);




export default router;