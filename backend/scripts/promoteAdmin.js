import 'dotenv/config';
import prisma from '../src/config/database.js';

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error('Uso: node scripts/promoteAdmin.js email@exemplo.com');
  process.exit(1);
}

try {
  const admin = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });

  console.log('Conta promovida a administrador:');
  console.log(admin);
} catch (error) {
  if (error.code === 'P2025') {
    console.error('Nenhuma conta foi encontrada com esse e-mail.');
  } else {
    console.error('Não foi possível promover a conta:', error.message);
  }

  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
