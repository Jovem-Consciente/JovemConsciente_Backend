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
       
}

seeder()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
