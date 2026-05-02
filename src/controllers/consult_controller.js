import express from "express"
import prisma from "../prisma.js"
import { addConsultation, catchConsultation, getAvailablePsychologist } from "../utils/consultation.js";


//criar consulta
export const createConsultation = async (req, res) => {
  const { type, reason, notes, gender_pref, time, date, time_to_take } = req.body;
  const { id: user_id } = req.user;
  console.log(user_id);

  const pacient= await prisma.pacient.findFirst(
    {
      where:{ 
      user_id: user_id
    }}
  )

  try {
   
    const dateTime = new Date(`${date}T${time}:00`); 

    const psychologist = await getAvailablePsychologist(
      gender_pref,
      dateTime,
      Number(time_to_take) 
    );

    if (!psychologist) {
      return res.status(404).json({
        message: "Nenhum psicólogo disponível para esta data e hora"
      });
    }

    const consultation = await addConsultation({
      type: type,
      reason: reason,
      notes:notes,
      dateTime: dateTime,
      time_to_take: time_to_take,
      gender_pref: gender_pref,
      pacient_id: pacient.id,
    });

    return res.status(201).json({
      message: "Consulta registada com sucesso",
      consultation
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//listar consults paciente
export const list_consullts = async (req, res) => {
  try {
    const user = req.user;
    
    const consultations = await catchConsultation({id: user.id, role:user.role});

    let formatted = [];

    console.log(consultations);

    if (user.role === 'Psy') {
      formatted = consultations.map(c => ({
        id: c.id,
        reason: c.reason,
        type: c.type,
        status: c.status,
        pacient_name: c.pacient?.name ?? "Desconhecido",
        pacient_email: c.pacient?.email ?? "",
        url_profile: c.pacient?.profile_photo
          ? `http://localhost:3000/${c.pacient.profile_photo}`
          : null,
        date: c.dateTime.toISOString().split("T")[0],
        time: c.dateTime.toISOString().split("T")[1].slice(0, 5),
      }));
    }

    // ADMIN
    else if (user.role === 'Admin') {
      formatted = consultations.map(c => ({
        id: c.id,
        reason: c.reason,
        type: c.type,
        status: c.status,
        pacient_name: c.pacient?.name ?? "Desconhecido",
        pacient_email: c.pacient?.email ?? "",
        pacient_profile: c.pacient?.profile_photo
          ? `http://localhost:3000/${c.pacient.profile_photo}`
          : null,
        psy_name: c.psy?.name ?? "Desconhecido",
        psy_email: c.psy?.email ?? "",
        psy_profile: c.psy?.profile_photo
          ? `http://localhost:3000/${c.psy.profile_photo}`
          : null,
        date: c.dateTime.toISOString().split("T")[0],
        time: c.dateTime.toISOString().split("T")[1].slice(0, 5),
      }));
    }

    else {
      return res.status(403).json({ message: "Invalid role" });
    }

    return res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// pegar as consultas do user autenticado

export const get_auth_consults = async (req, res) => {

  try {
    const user  = req.user;
    let auth_data;
    let whereCondition = {};
    let include = {};

    if (user.role === "Pacient") {
      auth_data = await prisma.pacient.findFirst({
        where: { user_id: user.id }
      });

      if (!auth_data) {
        return res.status(404).json({ message: "Pacient not found" });
      }

      whereCondition = { pacient_id: auth_data.id };
      include = { psy: true };
    }

    else if (user.role === "Psy") {
      auth_data = await prisma.psy.findFirst({
        where: { user_id: user.id }
      });

      if (!auth_data) {
        return res.status(404).json({ message: "Psychologist not found" });
      }

      whereCondition = { psy_id: auth_data.id };
      include = { pacient: true };
    }

    else {
      return res.status(403).json({ message: "Invalid role" });
    }
    const consults = await prisma.consultation.findMany({
      where: whereCondition,
      include
    });

    
    const formatted = consults.map(c => ({
      id: c.id,
      reason: c.reason,
      type: c.type,
      status: c.status,
      psy_name: c.psy?.name,
      pacient_name: c.pacient?.name,
      date: c.dateTime.toISOString().split("T")[0],
      time: c.dateTime.toISOString().split("T")[1].slice(0, 5),
      phone: auth_data.phone,
      name: auth_data.name,
      email: auth_data.email,
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar consultas" });
  }
};


// export const list_consult_pacient= async (req, res) => {
//   try {
//     const { id} = req.user;
//     const pacient= await prisma.pacient.findFirst(
//       {
//         where:{ 
//         user_id: id
//       }}

//     )

//     const pacient_id = pacient.id;
//     const consultations = await prisma.consultation.findMany({
//       where: { pacient_id },
//       include: {
//         psy: true
//       }
//     });
//      const formatted = consultations.map(c => ({
//       id: c.id,
//       reason: c.reason,
//       type: c.type,
//       psy_name: c.psy?.name || "A definir...",
//       date: c.dateTime.toISOString().split("T")[0],
//       time: c.dateTime.toISOString().split("T")[1].slice(0, 5),
//       phone: pacient.phone,
//       name: pacient.name,
//       email:pacient.email,
//     }));
//     console.log(consultations);
//     return res.status(200).json(formatted);

//   } catch (error) {
//     console.error(error);
//     return res.status(400).json({ error: error.message });
//   }
// };


//listar consults psicologo



// export const list_consult_psy = async (req, res) => {
//   try {
//     const { id } = req.user;

//     const psy = await prisma.psy.findFirst({
//       where:{
//         user_id: id
//       }
//     });
//     const consultations = await prisma.consultation.findMany({
//       where: {
//         psy_id: psy.id, 
//       },
//       include: {
//         pacient: true, 
//       },
//       orderBy: {
//         dateTime: "asc",
//       },
//     });

//     const formatted = consultations.map(c => ({
//       id: c.id,
//       reason: c.reason,
//       type: c.type,
//       pacient_name: c.pacient?.name ?? "Desconhecido",
//       pacient_email: c.pacient?.email ?? "",
//       url_profile: c.pacient?.profile_photo
//         ? `http://localhost:3000/${c.pacient.profile_photo}`
//         : null,
//       date: c.dateTime.toISOString().split("T")[0],
//       time: c.dateTime.toISOString().split("T")[1].slice(0, 5),
//     }));

//     console.log(formatted);
//     return res.status(200).json(formatted);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Erro ao buscar consultas" });
//   }
// };

// assumir consult psicologo


export const assum_consult = async(req, res) =>{
  try {
    const {id, role} = req.user()
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

//listar consultas pendentes

export const consult_pending = async(res)=>{

};

//listar consultas realizadas

export const consult_attended = async(res)=>{

}

//listar consultas canceladas

export const consult_canceled = async(res)=>{

}



