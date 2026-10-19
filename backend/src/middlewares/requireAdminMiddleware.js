export default function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Usuário não autenticado.'
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Apenas administradores podem revisar ONGs.'
    });
  }

  return next();
}