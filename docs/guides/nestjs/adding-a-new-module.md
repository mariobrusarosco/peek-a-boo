# Adding a New Module in NestJS

## Introduction

If you're familiar with Node.js and Express but new to NestJS, this guide will help you understand how we added the Projects module to our SDK service. NestJS is a framework built on top of Express that adds structure and organization to your Node.js applications through concepts like modules, controllers, and services.

## NestJS vs Express: The Key Differences

| Express | NestJS |
|---------|--------|
| Minimal, unopinionated | Full-featured, opinionated framework |
| Manual organization of routes and middleware | Structured modules, controllers, and services |
| Direct handling of requests/responses | Decorators and dependency injection |
| Manual error handling | Built-in exception filters |
| Middleware-based | Decorator and class-based |

## Understanding the Core NestJS Concepts

### 1. Modules

Modules are the building blocks of a NestJS application. Each module encapsulates a specific feature or domain of your application.

```typescript
@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
```

This is similar to how you might organize your Express app into different route files, but NestJS formalizes this with the `@Module` decorator.

### 2. Controllers

Controllers handle incoming requests and return responses to the client. They're similar to Express route handlers but more structured.

```typescript
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }
}
```

In Express, this would look like:

```javascript
router.get('/projects', async (req, res) => {
  const projects = await projectsService.getAllProjects();
  res.json(projects);
});

router.post('/projects', async (req, res) => {
  const project = await projectsService.createProject(req.body);
  res.json(project);
});
```

### 3. Services

Services contain the business logic of your application. They're injected into controllers and other services.

```typescript
@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  async getAllProjects(): Promise<Project[]> {
    return this.prismaService.findMany('project') as Promise<Project[]>;
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    // Implementation...
  }
}
```

In Express, you might have a similar service file, but you'd have to manually import and instantiate it.

### 4. DTOs (Data Transfer Objects)

DTOs define the shape of data coming into your application. They're used for validation and type safety.

```typescript
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Project name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Project name cannot exceed 50 characters' })
  name: string;
}
```

In Express, you might validate request bodies manually or use middleware like `express-validator`.

## Step-by-Step: How We Added the Projects Module

### 1. Create the Module Structure

First, we created the directory structure for our module:

```
src/
└── projects/
    ├── dto/
    │   └── create-project.dto.ts
    ├── projects.controller.ts
    ├── projects.service.ts
    └── projects.module.ts
```

### 2. Define the DTO

We created a DTO to validate incoming project creation requests:

```typescript
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Project name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Project name cannot exceed 50 characters' })
  name: string;
}
```

The decorators come from the `class-validator` package and automatically validate incoming requests.

### 3. Create the Service

Next, we implemented the service with the business logic:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Project } from '@peek-a-boo/shared/node_modules/.prisma/client';
import type { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  async getAllProjects(): Promise<Project[]> {
    return this.prismaService.findMany('project') as Promise<Project[]>;
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    // Mock implementation for now
    return {
      id: `project-${Date.now()}`,
      name: createProjectDto.name,
      userId: 'mock-user-id',
      createdAt: new Date(),
      updatedAt: new Date()
    } as Project;
  }
}
```

The `@Injectable()` decorator makes this service available for dependency injection.

### 4. Implement the Controller

Then, we created the controller to handle HTTP requests:

```typescript
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import type { Project } from '@peek-a-boo/shared/node_modules/.prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
  }

  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }
}
```

The `@Controller('projects')` decorator defines the base route for all endpoints in this controller.

### 5. Define the Module

Finally, we tied everything together with a module:

```typescript
import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
```

This module:
- Imports the PrismaModule to access the database
- Registers the ProjectsController to handle HTTP requests
- Provides the ProjectsService for dependency injection
- Exports the ProjectsService so other modules can use it

### 6. Register the Module in the App Module

The final step was to register our new module in the app module:

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { FeatureFlagsModule } from './feature-flags/feature-flags.module';
import { HealthModule } from './health/health.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FeatureFlagsModule,
    HealthModule,
    ProjectsModule,  // Our new module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Express vs NestJS: A Practical Comparison

Let's compare how you'd implement a simple project creation endpoint in both frameworks:

### Express Implementation

```javascript
// projectsRouter.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const projectsService = require('./projectsService');

router.post(
  '/projects',
  [
    body('name').isString().notEmpty().isLength({ min: 3, max: 50 })
      .withMessage('Project name must be between 3 and 50 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const project = await projectsService.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;

// projectsService.js
const db = require('./database');

async function createProject(data) {
  // Implementation...
}

module.exports = { createProject };

// app.js
const express = require('express');
const app = express();
const projectsRouter = require('./projectsRouter');

app.use(express.json());
app.use(projectsRouter);

app.listen(3000);
```

### NestJS Implementation

```typescript
// create-project.dto.ts
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}

// projects.service.ts
@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}
  
  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    // Implementation...
  }
}

// projects.controller.ts
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createProject(createProjectDto);
  }
}

// projects.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}

// app.module.ts
@Module({
  imports: [ProjectsModule],
})
export class AppModule {}

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

## Benefits of the NestJS Approach

1. **Structured Organization**: Clear separation of concerns with modules, controllers, and services
2. **Dependency Injection**: Automatic injection of dependencies makes testing easier
3. **Decorators**: Simplify common tasks like route handling and validation
4. **TypeScript Integration**: First-class TypeScript support for better type safety
5. **Scalability**: Modular architecture makes it easier to scale large applications
6. **Consistency**: Enforces a consistent structure across your application

## Conclusion

NestJS adds structure and organization to your Node.js applications, making them more maintainable and scalable. While it has a steeper learning curve than Express, the benefits become clear as your application grows.

By following the module-based architecture we used for the Projects feature, you can easily add new features to your NestJS application in a consistent and maintainable way.

## Further Learning Resources

- [NestJS Official Documentation](https://docs.nestjs.com/)
- [NestJS Fundamentals Course](https://courses.nestjs.com/)
- [NestJS vs Express](https://blog.logrocket.com/nestjs-vs-express-js/)
- [NestJS GitHub Repository](https://github.com/nestjs/nest)
