import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import { JWT_SECRET } from '../config/auth.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (!token || !/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'care-n-share-api',
      audience: 'care-n-share-web'
    });

    const user = await userRepository.findById(decoded.sub);

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({
        error: 'Sessão expirada ou encerrada'
      });
    }

    req.user = {
      id: user.id,
      type: user.type
    };

    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export default authMiddleware;