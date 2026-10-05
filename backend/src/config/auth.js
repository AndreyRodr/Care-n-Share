const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error(
    'JWT_SECRET deve ser configurado no arquivo .env antes de iniciar a API.'
  );
}

const cookieMaxAge = Number(process.env.COOKIE_MAX_AGE_MS || 3_600_000);

if (!Number.isFinite(cookieMaxAge) || cookieMaxAge <= 0) {
  throw new Error('COOKIE_MAX_AGE_MS deve ser um número positivo.');
}

export const JWT_SECRET = jwtSecret;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const AUTH_COOKIE_NAME = 'care_n_share_token';

export const AUTH_COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/'
};

export const AUTH_COOKIE_OPTIONS = {
  ...AUTH_COOKIE_BASE_OPTIONS,
  maxAge: cookieMaxAge
};