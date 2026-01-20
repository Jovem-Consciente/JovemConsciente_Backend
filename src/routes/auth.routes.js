import express from "express"
import {register, login } from "../controllers/auth_controller.js"
import { authMiddleware } from "../middlewares/auth_middleware.js"
import role_middleware from "../middlewares/role_middleware.js"

import upload from "../utils/uploads.js"

const router = express.Router()

router.post("/register", upload.single("file"), register);
router.post("/login",upload.none(), login );


export default router;

