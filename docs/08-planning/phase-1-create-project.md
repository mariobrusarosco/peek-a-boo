# Phase 1: Project Creation Feature

This document outlines the implementation plan for the "Create Project" feature in the Peek-a-boo platform.

## Overview

The "Create Project" feature allows users to create new projects in the system. Projects are the top-level organizational unit in Peek-a-boo, under which feature flags will be organized.

## Goals

- Allow users to create new projects with a name
- Display created projects in the UI
- Persist projects in the database
- Associate projects with the creating user

## Tasks

### 1. Database Schema Setup

- [x] Define Project model in Prisma schema
- [x] Define User model in Prisma schema
- [x] Create relation between User and Project models
- [x] Create migration for the new models
- [x] Create seed script for test data

### 2. Backend API Implementation

- [x] Create ProjectController in SDK Service (NestJS)
- [x] Implement POST /projects endpoint for project creation
- [x] Implement GET /projects endpoint to list projects
- [x] Add validation for project name
- [x] Add error handling for duplicate projects
- [ ] Write unit tests for the controller
- [ ] Write integration tests for the API endpoints

### 3. Frontend Components

- [x] Create ProjectSearch component for selecting projects
- [x] Create CreateProject component for the project creation form
- [x] Implement form validation
- [x] Add loading and error states
- [x] Style components according to design system

### 4. Frontend-Backend Integration

- [x] Create API client for project endpoints
- [x] Connect CreateProject component to backend API
- [x] Implement optimistic UI updates
- [x] Add error handling and retry logic
- [x] Update project list after creation

### 5. Documentation

- [x] Create database seed guide
- [x] Create Prisma study guide
- [ ] Document API endpoints
- [ ] Add usage examples to README

### 6. Next.js Data Fetching Optimization

- [ ] Refactor Projects page to use Server Components where appropriate
- [ ] Implement proper data fetching patterns (Server Components vs. Client Components)
- [ ] Add proper error handling for Server Components
- [ ] Optimize data loading with Suspense boundaries
- [ ] Implement proper caching strategies

## Implementation Details

### Database Schema

```prisma
model User {
  id        String    @id @default(cuid())
  name      String?
  email     String    @unique
  password  String?
  role      UserRole  @default(MEMBER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  projects  Project[]
}

model Project {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### API Endpoints

#### Create Project

- **URL**: `/projects`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "My New Project"
  }
  ```
- **Response**:
  ```json
  {
    "id": "clj2f8s9g0000qwer1234asdf",
    "name": "My New Project",
    "createdAt": "2025-05-02T22:15:30.123Z",
    "updatedAt": "2025-05-02T22:15:30.123Z",
    "userId": "clj2f8s9g0001qwer1234asdf"
  }
  ```

#### List Projects

- **URL**: `/projects`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "id": "clj2f8s9g0000qwer1234asdf",
      "name": "My New Project",
      "createdAt": "2025-05-02T22:15:30.123Z",
      "updatedAt": "2025-05-02T22:15:30.123Z",
      "userId": "clj2f8s9g0001qwer1234asdf"
    }
  ]
  ```

## Component Design

### CreateProject Component

```tsx
<CreateProject 
  onCreate={(name) => {
    // Call API to create project
    // Update UI on success
  }}
/>
```

### ProjectSearch Component

```tsx
<ProjectSearch 
  projects={projects}
  onSelect={(projectId) => {
    // Handle project selection
  }}
/>
```

## Testing Strategy

1. **Unit Tests**:
   - Test controller methods in isolation
   - Test component rendering and state management

2. **Integration Tests**:
   - Test API endpoints with database interactions
   - Test frontend-backend communication

3. **E2E Tests**:
   - Test complete flow from project creation to display

## Dependencies

- NestJS for backend API
- Next.js for frontend
- Prisma for database access
- shadcn UI components for styling

## Timeline

- Week 1: Database schema and backend API implementation 
- Week 2: Frontend components and integration 
- Week 3: Testing, documentation, and Next.js data fetching optimization: 1 day

Total: 5 days
