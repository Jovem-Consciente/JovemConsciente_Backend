import prisma from "../prisma.js"
import express from "express";



export const list_psy = async(req, res)=>{

    try {
        const data_psy = await prisma.psy.findMany();

        const formatted = data_psy.map(p =>({
            id: p.id,
            name: p.name,
            email: p.email,
            gender: p.gender,
            phone: p.phone,
            address: p.address,
            url_profile: p.psy?.profile_photo
            ? `http://localhost:3000/${p.psy.profile_photo}`
            : null,
        }));

        return res.status(200).json(formatted);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
};


export const get_data_psy = async(res)=>{

    try {
        const id_psy = Number(req.params.id)

        const psy_data = await prisma.psy.findFirst({
            where:{
                id: id_psy,
            }

        })
        const formatted = psy_data.map(p =>({
            id: p.id,
            name: p.name,
            email: p.email,
            gender: p.gender,
            address: p.address,
            url_profile: p.psy?.profile_photo
            ? `http://localhost:3000/${p.psy.profile_photo}`
            : null,
        }));

        return res.status(200).json(formatted);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
}

export const get_consults_psy = async(req, res)=>{

    try {
        const id_psy = Number(req.params.id)

        const psy_consults = await prisma.consultation.findMany({
            where:{
                psy_id: id_psy,
            }

        })
        const formatted = psy_consults.map(c =>({
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




