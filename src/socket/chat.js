

import prisma from "../prisma";

const chat = (io, req) => {
    io.on("connection", (socket) =>{
        console.log("Cliente:", socket.id);

        socket.on("joinRoom", ({ pacient_id, psy_id}) =>{
            if(!pacient_id || !psy_id) return;

            const ids = [pacient_id, psy_id].sort((a,b)=> a - b);
            const room = `conversa_${ids[0]}_${ids[1]}`;

            socket.join(room);
            console.log(`Sala ${room} aberta com ${socket.id}. `);
        });

         socket.on("sendMessage", async ({ pacient_id, psy_id, content }) => {
            try {
                const senderId = socket.user.id;
                const senderRole = socket.user.role;

                
                if (senderRole === "Pacient" && senderId !== pacient_id) return;
                if (senderRole === "Psy" && senderId !== psy_id) return;

                const ids = [pacient_id, psy_id].sort((a, b) => a - b);
                const room = `chat_${ids[0]}_${ids[1]}`;

                const message = await prisma.message.create({
                    data: {
                        content,
                        pacient_id,
                        psy_id,
                        sender_role: senderRole
                    }
                });

                io.to(room).emit("newMessage", message);

            } catch (error) {
                console.error(error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Desconectado:", socket.id);
        });
    })
};

export default chat;