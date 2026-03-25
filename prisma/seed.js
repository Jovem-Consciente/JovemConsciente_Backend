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

     await prisma.psy.create({
        data:{
            email : "carlajonas@gmail.com",
            name: 'Carla Jonas',
            address: "Maputo Cidade",
            phone: "871234536",
            gender: "Feminino",
            user:{
                create:{
                    email : "carlajonas@gmail.com",
                    password: await hashPassword('carla2026'),
                    role: "Psy"
                }
            }
        }
    });
       
}

seeder()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
