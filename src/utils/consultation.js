import prisma from "../prisma.js";

export const addConsultation = async({
    type,
    reason,
    notes,
    pacient_id,
    dateTime,
    gender_pref,
    time_to_take,
  

})=>{
    return await prisma.$transaction(async(tx)=> {
        const consult = await tx.consultation.create({
            data:{
                type: type,
                reason: reason,
                notes: notes,
                pacient_id: pacient_id,
                dateTime: dateTime,
                time_to_take: time_to_take,
                gender_pref: gender_pref
            }
        });
        return consult
    });
};

export const catchConsultation = async({
    id,
    role
})=>{
    return await prisma.$transaction(async(tx)=>{
        console.log(role)
        let consultations;

        if( role === "Admin"){
            consultations = await prisma.consultation.findMany();
            
        }else if( role === "Pacient"){
            pacient_data = await prisma.pacient.findFirst({
                where:{
                    user_id: id
                }
            });
            consultations = await prisma.consultation.findMany({
                where:{
                    pacient_id: pacient_data.id
                },
                include: {
                    psy: true
                }
            });
        } else if (role === "Psy"){
          
            consultations = await prisma.consultation.findMany({
               where: {
                    psy_id: null
                },
                orderBy: {
                    dateTime: "asc"
                }
               
            });
        }else{
            throw new Error("Perfil inválido");
        }
        return consultations;      
        
    });
};

export const getAvailablePsychologist = async (gender, dateTime, durationMinutes) => {

  const endDateTime = new Date(dateTime.getTime() + durationMinutes * 60000);

  

  return await prisma.psy.findFirst({
    where: {
        ...(gender && gender !== "Sem preferencia" && { gender }),

        consultations: {
        none: {
            OR: [
            { dateTime: { lt: dateTime } },      // consulta existente termina antes do início
            { dateTime: { gte: endDateTime } },  // consulta existente começa depois do fim
            ],
        },
        },
    },
    select: {
        id: true,
    },
 });

};
