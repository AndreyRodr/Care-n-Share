export default function requireApprovedOng(req, res, next) {
  if (!req.user || req.user.type !== 'O') {
    return res.status(403).json({
      error: 'Apenas ONGs podem realizar esta ação.'
    });
  }

  if (req.user.verificationStatus !== 'APPROVED') {
    return res.status(403).json({
      error:
        'Sua ONG está pendente de aprovação e não pode realizar esta ação.'
    });
  }

  return next();
}