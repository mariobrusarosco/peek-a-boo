import { PrismaClient, Environment } from '@prisma/client';
import type { UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

// Initialize the Prisma client
const prisma = new PrismaClient();

// Ensure the client is connected
prisma.$connect();

async function main() {
  console.log('Starting seed...');

  // Clean database before seeding
  console.log('Cleaning database...');
  await prisma.featureFlag.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  console.log('Database cleaned successfully!');

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

// Use environment variable for organization ID to keep it consistent across seed runs
const SEED_ORG_ID = process.env.SEED_ORGANIZATION_ID || 'cmhqxjwpw000e2ikeps545uou';

const organizations = [
  {
    id: SEED_ORG_ID,
    name: 'Development Organization',
  },
];

const createdOrganizations = await Promise.all(
  organizations.map(async (organization) => {
    return prisma.organization.upsert({
      where: { id: organization.id },
      update: { name: organization.name },
      create: organization,
    });
  })
);

console.log(`Organization ID: ${createdOrganizations[0].id}`);

const featureFlags = [
  {
    key: 'new-checkout',
    name: 'New Checkout Flow',
    description: 'Enable the redesigned checkout experience',
    enabled: true,
    environment: Environment.DEVELOPMENT,
    organizationId: createdOrganizations[0].id,
    projectId: createdProjects[0].id,
    value: {},
  },
  {
    key: 'new-checkout',
    name: 'New Checkout Flow',
    description: 'Enable the redesigned checkout experience',
    enabled: false,
    environment: Environment.PRODUCTION,
    organizationId: createdOrganizations[0].id,
    projectId: createdProjects[0].id,
    value: {},
  },
  {
    key: 'dark-mode',
    name: 'Dark Mode',
    description: 'Enable dark mode theme',
    enabled: true,
    environment: Environment.DEVELOPMENT,
    organizationId: createdOrganizations[0].id,
    projectId: createdProjects[0].id,
    value: {},
  },
  {
    key: 'premium-features',
    name: 'Premium Features',
    description: 'Unlock premium tier features',
    enabled: false,
    environment: Environment.DEVELOPMENT,
    organizationId: createdOrganizations[0].id,
    projectId: createdProjects[0].id,
    value: {},
  },
];

const createdFeatureFlags = await Promise.all(
  featureFlags.map(async (featureFlag) => {
    return prisma.featureFlag.create({
      data: featureFlag,
    });
  })
);

  console.log(`Created ${createdFeatureFlags.length} feature flags`);
  console.log(`Created ${createdOrganizations.length} organizations`);
  console.log(`Created ${createdProjects.length} projects`);
  console.log(`Created ${createdUsers.length} users`);



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
