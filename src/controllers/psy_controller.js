import prisma from "../prisma.js"
import { catchConsultation } from "../utils/consultation.js";

export const assum_consult = async(req, res) =>{
  try {
    const {id, role} = req.user
    const id_consult = Number(req.params.id)
    
    const psy = await prisma.psy.findFirst({
      where:{
        user_id: id
      }
    });

    if (role !== "Psy") {
      return res.status(403).json({ error: "Apenas psicólogos" });
    }

    await prisma.consultation.update({
      where:{
        id: id_consult
      },
      data:{
        psy_id: psy.id
      }
    })

      return res.status(200).json({message: "Consulta atribuida"});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno" });
    }
 
};

export const my_consults = async (req, res) => {
  try {
    const { id } = req.user;

    const psy = await prisma.psy.findFirst({
      where:{
        user_id: id
      }
    });
    const consultations = await prisma.consultation.findMany({
      where: {
        psy_id: psy.id, 
      },
      include: {
        pacient: true, 
      },
      orderBy: {
        dateTime: "asc",
      },
    });

    const formatted = consultations.map(c => ({
      id: c.id,
      reason: c.reason,
      type: c.type,
      pacient_name: c.pacient?.name ?? "Desconhecido",
      pacient_email: c.pacient?.email ?? "",
      url_profile: c.pacient?.profile_photo
        ? `http://localhost:3000/${c.pacient.profile_photo}`
        : null,
      date: c.dateTime.toISOString().split("T")[0],
      time: c.dateTime.toISOString().split("T")[1].slice(0, 5),
    }));

    console.log(formatted);
    return res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar consultas" });
  }
};



export const listConsultation = async (req, res) => {
  try {
    const { id, role } = req.user;

    const consultations = await catchConsultation({ id, role });

     const formatted = consultations.map(c => ({
      id: c.id,
      reason: c.reason,
      type: c.type,
      psy_name: c.psy?.name ?? "Não definido",
      date: c.dateTime.toISOString().split("T")[0],
      time: c.dateTime.toISOString().split("T")[1].slice(0, 5),
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};


export const get_data_chat = async (req, res) => {
  try {
    const id_consult = Number(req.params.id);

    const consult = await prisma.consultation.findFirst({
      where: {
        id: id_consult
      },
      include: {
        pacient: true,
        psy: true
      }
    });

    if (!consult) {
      return res.status(404).json({ error: "Consulta não encontrada" });
    }
    console.log(consult);
    return res.json({
      pacient: {
        email: consult.pacient.email,
        name: consult.pacient.name,
        phone: consult.pacient.phone,
        photo_profile: consult.pacient.profile_photo
          ? `http://localhost:3000/${consult.pacient.profile_photo}`
          : null,
      },
      
    }
  );

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
}


