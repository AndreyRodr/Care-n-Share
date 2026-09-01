const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      });
    }

    if (!allowedRoles.includes(req.user.type)) {
      return res.status(403).json({
        error: 'Você não tem permissão para realizar esta ação'
      });
    }

    return next();
  };
};

export default authorizeRoles;