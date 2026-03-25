import prisma from "../prisma.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import {registerUser} from "../utils/register.js"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";


export const register = async (req, res) => {
  const { name, email, password, role, address, phone, gender } = req.body;
  const filePath = req.file?.path || null;
  try {
    const hashed_password = await hashPassword(password);
   

    const user = await registerUser({
        name,
        email,
        hashed_password,
        role,
        address,
        phone,
        filePath,
        gender
        });

        const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
        );

        res.status(201).json({
        message: "Utilizador criado com sucesso",
        token,
        user: { id: user.id, email: user.email, role: user.role },
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, 
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
    console.log(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const get_data = async(req, res) =>{
  const user = req.user;

    const model =
      user.role === "Pacient"
        ? prisma.pacient
        : user.role === "Psy"
        ? prisma.psy
        : null;

    if (!model) {
      return res.status(400).json({ message: "Role inválido" });
    }

    const user_data = await model.findFirst({
      where: { user_id: user.id }
    });

    if (!user_data) {
      return res.status(404).json({ message: "Usuario nao encontrado" });
    }
    
    return res.json({
      email: user_data.email,
      name: user_data.name,
      phone: user_data.phone,
      photo_profile: user_data.profile_photo
        ? `http://localhost:3000/${user_data.profile_photo}`
        : null,
    });

    
}

