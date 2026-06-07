import express from "express";
import authorizeRoles from "../middlewares/role_middleware.js"
import { authMiddleware } from "../middlewares/auth_middleware.js";
import role_middleware from "../middlewares/role_middleware.js";
import { assum_consult, list_consullts, get_auth_consults, createConsultation } from "../controllers/consult_controller.js";
import { get_consults_psy } from "../controllers/psy_controller.js";
import { get_consults_pacient } from "../controllers/pacient_controller.js";


const router = express.Router()

////////////////// POST ROUTES ///////////////////////
router.post("/add_consult", authMiddleware, authorizeRoles("Pacient"), createConsultation);
router.put("/assum_consult/:id", authMiddleware, authorizeRoles("Psy", "Admin"), assum_consult);

///////////////// GET ROUTES ////////////////////////

router.get("/list_consults", authMiddleware, authorizeRoles("Psy", "Pacient", "Admin"), list_consullts)
router.get("/list_my_consults", authMiddleware, authorizeRoles("Psy", "Pacient"), get_auth_consults)
router.get("/consults/pacient", authMiddleware, authorizeRoles("Admin"), get_consults_pacient);
router.get("/consults/psy", authMiddleware, authorizeRoles("Admin"), get_consults_psy);

export default router;
