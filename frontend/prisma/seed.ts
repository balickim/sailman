import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    username: 'Administrator',
    email: 'stiekerosiem@gmail.com',
    hashed_password: '',
    role: 'admin',
  },
  {
    username: 'Moderator',
    email: 'misialekb@o2.pl',
    hashed_password: '',
    role: 'moderator',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  const password = process.env.ADMIN_PASSWORD;
  const hashed_password = await bcrypt.hash(password, 10);

  for (const u of userData) {
    u.hashed_password = hashed_password;

    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
