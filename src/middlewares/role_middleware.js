export default function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Você não tem permissão para acessar este recurso"
      });
    }

    next();
  };
}

