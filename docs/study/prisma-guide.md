# Prisma: A Comprehensive Study Guide

## What is Prisma?

Prisma is a next-generation ORM (Object-Relational Mapping) for Node.js and TypeScript. It consists of three main tools:

1. **Prisma Client**: Auto-generated and type-safe query builder
2. **Prisma Migrate**: Declarative data modeling and migration system
3. **Prisma Studio**: GUI to view and edit data in your database

## Why Prisma for Peek-a-boo?

For our feature flag management platform, Prisma provides:

- **Type Safety**: Automatically generated TypeScript types
- **Intuitive API**: Simple, readable query syntax
- **Schema-First Approach**: Clear database structure definition
- **Migrations**: Easy database evolution as requirements change
- **Relations**: Simplified handling of complex relationships between entities

## Core Concepts

### Prisma Schema

The Prisma schema (`.prisma` file) is the central configuration point:

```prisma
// Define the data source
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Define the generator
generator client {
  provider = "prisma-client-js"
}

// Define your models
model User {
  id        String    @id @default(cuid())
  name      String?
  email     String    @unique
  projects  Project[]
}

model Project {
  id      String  @id @default(cuid())
  name    String
  userId  String
  user    User    @relation(fields: [userId], references: [id])
}
```

### Key Components in the Schema

- **Models**: Represent tables in your database
- **Fields**: Represent columns in a table
- **Attributes**: Configure models and fields (prefixed with `@` or `@@`)
- **Data Types**: Define the type of each field
- **Relations**: Define connections between models

## Deep Dive: Prisma Data Modeling

### Model Definition

Models are the core building blocks in Prisma. Each model:

- Maps to a table in your database
- Defines a shape for a specific entity in your application
- Contains fields, attributes, and relations

```prisma
model Feature {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Field Types

Prisma supports various scalar types that map to database column types:

| Prisma Type | TypeScript Type | Database Type (PostgreSQL) |
|-------------|-----------------|----------------------------|
| String      | string          | text, varchar              |
| Boolean     | boolean         | boolean                    |
| Int         | number          | integer                    |
| Float       | number          | double precision           |
| DateTime    | Date            | timestamp                  |
| Json        | object          | jsonb                      |
| Bytes       | Buffer          | bytea                      |
| Decimal     | Decimal         | decimal                    |
| BigInt      | bigint          | bigint                     |

Optional fields are denoted with a question mark:

```prisma
model User {
  id       String  @id @default(cuid())
  name     String? // Optional field
  email    String  // Required field
}
```

### Field Attributes

Attributes modify the behavior of fields:

```prisma
model User {
  id        String    @id @default(cuid())  // Primary key with auto-generated CUID
  email     String    @unique                 // Unique constraint
  role      String    @default("USER")        // Default value
  createdAt DateTime  @default(now())        // Default to current timestamp
  updatedAt DateTime  @updatedAt             // Auto-updates on record change
  score     Float     @db.Real               // Native database type
  tags      String[]                         // Array field (PostgreSQL only)
}
```

### Model Attributes

Model-level attributes affect the entire model:

```prisma
model ApiKey {
  id      String @id @default(cuid())
  key     String
  userId  String
  user    User   @relation(fields: [userId], references: [id])
  
  @@unique([userId, key])  // Composite unique constraint
  @@index([key])           // Index for performance
  @@map("api_keys")        // Map to different table name
}
```

### Relations

Prisma supports several types of relations between models:

#### One-to-Many Relation

```prisma
model User {
  id       String    @id @default(cuid())
  name     String
  projects Project[] // One user has many projects
}

model Project {
  id     String @id @default(cuid())
  name   String
  userId String
  user   User   @relation(fields: [userId], references: [id]) // Many projects belong to one user
}
```

#### Many-to-Many Relation

```prisma
model Post {
  id      String   @id @default(cuid())
  title   String
  tags    Tag[]    @relation("PostToTag") // Many posts have many tags
}

model Tag {
  id     String @id @default(cuid())
  name   String @unique
  posts  Post[] @relation("PostToTag") // Many tags belong to many posts
}
```

#### One-to-One Relation

```prisma
model User {
  id       String    @id @default(cuid())
  name     String
  profile  Profile?  // One user has one profile
}

model Profile {
  id      String @id @default(cuid())
  bio     String
  userId  String @unique
  user    User   @relation(fields: [userId], references: [id]) // One profile belongs to one user
}
```

#### Self-Relations

```prisma
model Employee {
  id          String     @id @default(cuid())
  name        String
  managerId   String?    
  manager     Employee?  @relation("ManagerToEmployee", fields: [managerId], references: [id])
  subordinates Employee[] @relation("ManagerToEmployee")
}
```

### Enums

Enums define a fixed set of values:

```prisma
enum Role {
  USER
  ADMIN
  EDITOR
}

model User {
  id    String @id @default(cuid())
  name  String
  role  Role   @default(USER)
}
```

### Advanced Modeling Techniques

#### Composite Types (Preview Feature)

```prisma
/// @zod.import(z.string().min(3))
type Address {
  street  String
  city    String
  state   String
  zip     String
  country String
}

model Customer {
  id      String  @id @default(cuid())
  name    String
  address Address
}
```

#### Implicit Many-to-Many Relations

```prisma
model Post {
  id       String    @id @default(cuid())
  title    String
  // No explicit relation field needed
  categories Category[]
}

model Category {
  id     String @id @default(cuid())
  name   String
  // No explicit relation field needed
  posts  Post[]
}
```

#### Polymorphic Relations (Workaround)

```prisma
model Comment {
  id            String  @id @default(cuid())
  content       String
  commentableId String
  commentableType String // 'Post' or 'Image'
}

model Post {
  id       String @id @default(cuid())
  title    String
  // Comments must be fetched separately with filtering
}

model Image {
  id       String @id @default(cuid())
  url      String
  // Comments must be fetched separately with filtering
}
```

### Schema Organization Best Practices

1. **Group Related Models**: Keep related models close together
2. **Use Comments**: Document complex relationships or business rules
3. **Consistent Naming**: Use singular nouns for model names
4. **Field Order**: Keep ID and required fields at the top
5. **Separation of Concerns**: Split large schemas into multiple files (requires Prisma's schema extensions feature)

### Schema Evolution Strategies

1. **Additive Changes**: Add new optional fields or models
2. **Rename with @map**: Use `@map` to rename fields without data loss
3. **Multi-Stage Migrations**: For complex changes, use multiple migrations
4. **Data Migrations**: Use Prisma Client in migration scripts for data transformations

## Basic CRUD Operations

### Create

```typescript
// Create a single record
const newUser = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com',
  },
});

// Create a record with relations
const newProject = await prisma.project.create({
  data: {
    name: 'My Project',
    user: {
      connect: { id: userId }  // Connect to existing user
    }
  },
});
```

### Read

```typescript
// Get all users
const users = await prisma.user.findMany();

// Get user by ID
const user = await prisma.user.findUnique({
  where: { id: userId },
});

// Get with filtering
const adminUsers = await prisma.user.findMany({
  where: { role: 'ADMIN' },
});

// Get with relations
const userWithProjects = await prisma.user.findUnique({
  where: { id: userId },
  include: { projects: true },
});
```

### Update

```typescript
// Update a user
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { name: 'New Name' },
});

// Update or create (upsert)
const upsertUser = await prisma.user.upsert({
  where: { email: 'alice@example.com' },
  update: { name: 'Alice Updated' },
  create: { name: 'Alice', email: 'alice@example.com' },
});
```

### Delete

```typescript
// Delete a user
const deletedUser = await prisma.user.delete({
  where: { id: userId },
});

// Delete many users
const deletedUsers = await prisma.user.deleteMany({
  where: { role: 'GUEST' },
});
```

## Migrations

Prisma Migrate helps you evolve your database schema:

```bash
# Create a migration
pnpm prisma migrate dev --name added_new_field

# Apply migrations in production
pnpm prisma migrate deploy
```

## Best Practices

1. **Keep the schema clean and well-documented**
2. **Use transactions** for operations that need to be atomic
3. **Leverage Prisma's query optimization** features
4. **Validate input data** before passing to Prisma
5. **Use middleware** for cross-cutting concerns
6. **Consider database indexes** for frequently queried fields

## Advanced Features

- **Middleware**: Intercept and modify queries
- **Raw Database Access**: Execute raw SQL when needed
- **Pagination**: Efficiently handle large datasets
- **Aggregations**: Count, sum, average, etc.
- **Nested Writes**: Create related records in a single query
- **Transactions**: Ensure data consistency

## Resources for Learning More

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Examples Repository](https://github.com/prisma/prisma-examples)
- [Prisma Data Guide](https://www.prisma.io/dataguide)
- [TypeScript & Prisma Discord](https://discord.gg/typescript)

## Peek-a-boo Specific Usage

In our feature flag management platform, we use Prisma to:

1. **Define our core domain models** (Users, Projects, Flags, etc.)
2. **Handle relationships** between these entities
3. **Perform database migrations** as we evolve the platform
4. **Generate TypeScript types** for end-to-end type safety
5. **Seed development data** for testing and development
