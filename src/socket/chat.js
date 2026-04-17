const chat = (io) => {
    io.on("connection", (socket) => {

        console.log("user conerctado");
        
        // socket.on("joinConsultation", ({ consultationId }) => {
        //     const room = `consultation_${consultationId}`;
        //     socket.join(room);

        //     console.log(`Entrou na consulta ${consultationId}`);
        // });

    
        // socket.on("sendMessage", async ({ consultationId, content }) => {
        //     try {
        //         const senderId = socket.user.id;
        //         const senderRole = socket.user.role;

                
        //         const message = await prisma.message.create({
        //             data: {
        //                 content,
        //                 sender_role: senderRole,
        //                 consultation_id: consultationId
        //             }
        //         });

        //         // 📡 enviar para sala
        //         const room = `consultation_${consultationId}`;
        //         io.to(room).emit("newMessage", message);

        //     } catch (error) {
        //         console.error(error);
        //     }
        // });

    });
};

export default chat;