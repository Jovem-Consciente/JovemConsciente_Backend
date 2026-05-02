import express from "express"
import prisma from "../prisma.js";

//carregar conversas
export const get_data_chat=  async (req, res) =>{

  const id_consult = Number(req.params.id);
  try {
    const consult = await prisma.consultation.findFirst({
      where: {
        id: id_consult
      },
      include: {
        pacient: true,
        psy: true,
        messages: {
          orderBy: {
            timestamp: "asc"
          }
        }
      }
    });

    return res.json({
      pacient: consult.pacient,
      psy: consult.psy,
      messages: consult.messages
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno" });
  }
  
}

//carregar mensagens
export const listMessages = async (req, res) => {
  try {
    const { id, role } = req.user;

    const messages = await catchMessages({ id, role });

     const formatted = messages.map(m => ({
      id: m.id,
      content: m.content,
      sender_role: m.sender_role,
      psy_name: m.psy?.name ,
      date: m.timestamp.toISOString().split("T")[0],
      time: m.timestamp.toISOString().split("T")[1].slice(0, 5),
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

//carregar dados do psicologo
// export const get_data_chat_psy = async (req, res) => {
//   try {
//     const id_consult = Number(req.params.id);

//     const consult = await prisma.consultation.findFirst({
//       where: {
//         id: id_consult
//       },
//       include: {
//         pacient: true,
//         psy: true
//       }
//     });

//     if (!consult) {
//       return res.status(404).json({ error: "Consulta não encontrada" });
//     }
//     console.log(consult);
//     return res.json({
     
//       psy: {
//         email: consult.psy.email,
//         name: consult.psy.name,
//         phone: consult.psy.phone,
//         photo_profile: consult.psy.profile_photo
//           ? `http://localhost:3000/${consult.psy.profile_photo}`
//           : null,
//       }
//     }
//   );

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Erro interno" });
//   }
// }

// // carregar dados do paciente
// export const get_data_chat_pacient = async (req, res) => {
//   try {
//     const id_consult = Number(req.params.id);

//     const consult = await prisma.consultation.findFirst({
//       where: {
//         id: id_consult
//       },
//       include: {
//         pacient: true,
//         psy: true
//       }
//     });

//     if (!consult) {
//       return res.status(404).json({ error: "Consulta não encontrada" });
//     }
//     console.log(consult);
//     return res.json({
//       pacient: {
//         email: consult.pacient.email,
//         name: consult.pacient.name,
//         phone: consult.pacient.phone,
//         photo_profile: consult.pacient.profile_photo
//           ? `http://localhost:3000/${consult.pacient.profile_photo}`
//           : null,
//       },
      
//     }
//   );

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Erro interno" });
//   }
// }



