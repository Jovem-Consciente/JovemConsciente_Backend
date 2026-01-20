import prisma from "../prisma";

export const catchMessages = async({
    id,
    role
})=>{
    return await prisma.$transaction(async(tx)=>{
    
        let messages;

        if( role === "Admin"){
            consultations = await prisma.consultation.findMany({
                include:{
                    pacient: true,
                    psy: true
                }
            });
        }else if( role === "Pacient"){
            consultations = await prisma.consultation.findMany({
              
                where:{
                    pacient_id: id
                }
            });
        } else if (role === "Psy"){
            consultations = await prisma.consultation.findMany({
                where:{
                    psy_id: id
                },
               
            });
        }else{
            throw new Error("Perfil inválido");
        }
        return messages;      
        
    });
};