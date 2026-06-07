import express from "express"
import prisma from "../prisma.js";


export const list_pacients = async(req, res) => {

    try {
        const data_pacient = await prisma.pacient.findMany();
        
        const formatted = data_pacient.map(p =>({
            id: p.id,
            name: p.name,
            email: p.email,
            gender: p.gender,
            phone: p.phone,
            address: p.address,
            url_profile: p.pacient?.profile_photo
            ? `http://localhost:3000/${p.pacient.profile_photo}`
            : null,
        }));
        console.log(formatted);
        return res.status(200).json(formatted);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
};

export const get_data_pacient = async(res)=>{

    try {
        const id_pacient = Number(req.params.id)

        const pacient_data = await prisma.pacient.findFirst({
            where:{
                id: id_pacient,
            }

        })
        const formatted = pacient_data.map(p =>({
            id: p.id,
            name: p.name,
            email: p.email,
            gender: p.gender,
            address: p.address,
            url_profile: p.pacient?.profile_photo
            ? `http://localhost:3000/${p.pacient.profile_photo}`
            : null,
        }));

        return res.status(200).json(formatted);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
}

export const get_consults_pacient = async(res)=>{

    try {
        const id_pacient = Number(req.params.id)

        const pacient_consults = await prisma.consultation.findMany({
            where:{
                pacient_id: id_pacient,
            }

        })
        const formatted = pacient_consults.map(c =>({
            id: c.id,
            reason: c.reason,
            type: c.type,
            status: c.status,
            psy_name: c.psy?.name,
            date: c.dateTime.toISOString().split("T")[0],
            time: c.dateTime.toISOString().split("T")[1].slice(0, 5),
        }));

        return res.status(200).json(formatted);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
}


