import express from "express";
import cors from "cors";
import prisma from "./prisma.js";
import authRoutes from "./routes/auth.routes.js"
import pacientRoutes from "./routes/pacient.routes.js"
import psyRoutes from "./routes/psy.routes.js"
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/auth_middleware.js";


const app = express();

app.use(cookieParser());

app.use(cors(
  {
    origin: [
      "http://localhost:3001"
    ],
    credentials: true, 
  }
));

app.use(express.json());

app.use("/auth", authRoutes)
app.use("/pacient", pacientRoutes)
app.use("/psy", psyRoutes)

app.get("/", async (req, res) => {
  try {
  
    await prisma.$connect();
    res.json({ message: "Conexão com a DB: OK " });
  } catch (error) {
    res.status(500).json({ message: "Erro na conexão com a DB ", error: error.message });
  } finally {
    await prisma.$disconnect();
  }
});

export default app;
