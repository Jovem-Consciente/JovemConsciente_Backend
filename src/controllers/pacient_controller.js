import express from "express"
import prisma from "../prisma.js";
import { addConsultation, catchConsultation } from "../utils/consultation.js";
import { getAvailablePsychologist } from "../utils/consultation.js";

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


export const listConsultation = async (req, res) => {
  try {
    const { id, role } = req.user;
    const pacient= await prisma.pacient.findFirst(
      {
        where:{ 
        user_id: id
      }}

    )

    const pacient_id = pacient.id;
    const consultations = await catchConsultation({ pacient_id, role });

     const formatted = consultations.map(c => ({
      id: c.id,
      reason: c.reason,
      type: c.type,
      psy_name: c.psy?.name ?? "A definir",
      date: c.dateTime.toISOString().split("T")[0],
      time: c.dateTime.toISOString().split("T")[1].slice(0, 5),
      phone: pacient.phone,
      name: pacient.name,
      email:pacient.email,
    }));

    return res.status(200).json(formatted);

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};



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

