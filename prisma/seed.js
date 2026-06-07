import prisma from "../src/prisma.js"
import { hashPassword } from "../src/utils/hash.js"

async function seeder() {

    await prisma.user.create({
        data:{
            email : "adminjc@gmail.com",
            password: await hashPassword('admin@2026'),
            role: "Admin"
        }
    });

    await prisma.pacient.create({
        data:{
            email : "solangemaria@gmail.com",
            name: 'Solange Maria',
            address: "Maputo Cidade",
            phone: "871234536",
            gender: "Feminino",
            user: {
                create: {
                    email : "solangemaria@gmail.com",
                    password: await hashPassword('solange2026'),
                    role: "Pacient"
                }
            }
        }
    });

     await prisma.pacient.create({
        data:{
            email : "aliananelly@gmail.com",
            name: 'Aliana Nelly',
            address: "Maputo Cidade",
            phone: "871234536",
            gender: "Feminino",
            user: {
                create: {
                    email : "aliananelly@gmail.com",
                    password: await hashPassword('aliana2026'),
                    role: "Pacient"
                }
            }
        }
    });

    await prisma.psy.create({
        data:{
            email : "carlosjonas@gmail.com",
            name: 'Carlos Jonas',
            address: "Maputo Cidade",
            phone: "871234536",
            gender: "masculino",
            profile_photo: "uploads/image_users/1774401050242-413932706.jpg",
            user:{
                create:{
                    email : "carlosjonas@gmail.com",
                    password: await hashPassword('carlos2026'),
                    role: "Psy"
                }
            }
        }
    });

    await prisma.psy.create({
        data:{
            email : "mariadaniel@gmail.com",
            name: 'Maria Daniel',
            address: "Maputo Provincia",
            phone: "871234536",
            gender: "feminino",
            user:{
                create:{
                    email : "mariadaniel@gmail.com",
                    password: await hashPassword('maria2026'),
                    role: "Psy"
                }
            }
        }
    });

    await prisma.consultation.create({
        data:{
            dateTime:"2026-05-20T10:30:00.000Z",
            pacient_id: 1,
            psy_id: 1,
            type: 'Normal',
            reason: 'Ansiedade',
            gender_pref: 'Feminino',
            time_to_take: 60


        }
    });

      await prisma.consultation.create({
        data:{
            dateTime:"2026-05-30T10:30:00.000Z",
            pacient_id: 2,
            psy_id: 1,
            type: 'Normal',
            reason: 'Ansiedade',
            gender_pref: 'Feminino',
            time_to_take: 60,

        }
    });

    await prisma.payment.create({
        data:{
            amount: 50,
            consult_id: 1,
            pacient_id: 1,
        }
    });

     await prisma.payment.create({
        data:{
            amount: 50,
            consult_id: 2,
            pacient_id: 2,
        }
    });
       
}

seeder()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
