import "dotenv/config";
import app from "./app.js";
import prisma from "./prisma.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Conexão com a DB: OK ✅");
  } catch (error) {
    console.error("Erro na conexão com a DB ❌", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
    console.log(`Acede em: http://localhost:${PORT}/`);
  });
};

startServer();

