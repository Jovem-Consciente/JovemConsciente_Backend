import jwt from "jsonwebtoken";

const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Token não fornecido"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        socket.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        return next(new Error("Token inválido"));
    }
};

export default socketAuth;