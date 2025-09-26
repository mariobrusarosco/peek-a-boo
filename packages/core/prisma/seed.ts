import { PrismaClient } from '@prisma/client';
import type { UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

// Initialize the Prisma client
const prisma = new PrismaClient();

// Ensure the client is connected
prisma.$connect();

async function main() {
  console.log('Starting seed...');

  // Create dummy users
  const users = [
    {
      name: 'Admin User',
      email: 'admin@peek-a-boo.dev',
      password: await hash('password123', 10),
      role: 'ADMIN',
    },
    {
      name: 'Regular User',
      email: 'user@peek-a-boo.dev',
      password: await hash('password123', 10),
      role: 'MEMBER',
    },
  ];

  // Insert users and store their IDs
  const createdUsers = await Promise.all(
    users.map(async (user) => {
      return prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role as UserRole,
        },
      });
    })
  );

  console.log(`Created ${createdUsers.length} users`);

  // Create dummy projects
  const projects = [
    { name: 'Web Application', userId: createdUsers[0].id },
    { name: 'Mobile App', userId: createdUsers[0].id },
    { name: 'API Service', userId: createdUsers[0].id },
    { name: 'E-commerce Platform', userId: createdUsers[1].id },
    { name: 'Dashboard', userId: createdUsers[1].id },
    { name: 'Marketing Site', userId: createdUsers[1].id },
  ];

  // Insert projects
  const createdProjects = await Promise.all(
    projects.map(async (project) => {
      return prisma.project.create({
        data: {
          name: project.name,
          userId: project.userId,
        },
      });
    })
  );

  console.log(`Created ${createdProjects.length} projects`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
