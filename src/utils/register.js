import prisma from "../prisma.js";

export const registerUser = async({
    name,
    email,
    address,
    phone,
    filePath,
    role,
    hashed_password,
    gender

    })=>{
        return await prisma.$transaction(async(tx) => {
            const user = await tx.user.create({
                data:{
                    email, password: hashed_password,  role
                }
            });

            if( role === "Pacient"){
                await tx.pacient.create({
                    data:{
                        name: name,
                        email: email, 
                        address: address, 
                        phone: phone, 
                        profile_photo: filePath,
                        user_id: user.id,
                        gender: gender
                    },
                });
            };

            if( role === "Psy"){
                await tx.psy.create({
                    data:{
                        name: name,
                        gender: gender, 
                        email: email, 
                        address: address, 
                        phone: phone, 
                        profile_photo: filePath,
                        user_id: user.id
                    },
                });
            };

            return user;
    });
};