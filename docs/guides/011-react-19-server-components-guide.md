# React 19 Server Components & Advanced Patterns Guide

## Overview

This guide covers professional patterns for working with React 19 Server Components, Server Actions, and advanced UX patterns like optimistic updates. Based on real implementation in the peek-a-boo project.

## Table of Contents

1. [Server Components Best Practices](#server-components-best-practices)
2. [Server Actions with useActionState](#server-actions-with-useactionstate)
3. [Optimistic Updates Pattern](#optimistic-updates-pattern)
4. [Data Fetching Strategies](#data-fetching-strategies)
5. [Error Handling](#error-handling)
6. [Performance Optimization](#performance-optimization)
7. [Common Patterns](#common-patterns)

## Server Components Best Practices

### ✅ **DO: Server-side Data Fetching**

```typescript
// ✅ Server Component - runs on server
export default async function ProjectListContainer() {
  // Direct API calls in Server Components
  const projects = await fetchProjects();
  
  if (projects.length === 0) {
    return <EmptyState />;
  }
  
  return <ProjectList projects={projects} />;
}
```

### ✅ **DO: Smart Caching Strategy**

```typescript
// ✅ Professional caching approach
export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(API_ENDPOINTS.PROJECTS.LIST, {
    // Revalidate every 60 seconds, use tags for targeted invalidation
    next: { revalidate: 60, tags: ['projects'] },
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  return response.json();
}
```

### ❌ **AVOID: Client-side Loading States**

```typescript
// ❌ Old pattern - manual loading states
function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProjects().then(setProjects).finally(() => setLoading(false));
  }, []);
  
  if (loading) return <Spinner />;
  return <div>{projects.map(...)}</div>;
}
```

## Server Actions with useActionState

### **The Modern Pattern**

Server Actions + `useActionState` is React 19's official pattern for handling form submissions and data mutations.

```typescript
// 1. Define Server Action with 'use server'
'use server'

export async function createProjectAction(
  prevState: ProjectActionState | null,
  formData: FormData
): Promise<ProjectActionState> {
  const name = formData.get('name') as string;

  // Server-side validation
  if (!name || name.trim().length < 3) {
    return { success: false, error: 'Project name must be at least 3 characters' };
  }

  try {
    const response = await fetch(API_ENDPOINTS.PROJECTS.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    });

    if (!response.ok) {
      return { success: false, error: `Failed to create project: ${response.statusText}` };
    }

    const project = await response.json();
    
    // ✅ Automatic cache invalidation
    revalidatePath('/projects');
    
    return { success: true, project };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}
```

### **Client Component Usage**

```typescript
'use client';

export default function CreateProjectModal({ isOpen, onClose }) {
  // ✅ useActionState handles state management automatically
  const [state, formAction, isPending] = useActionState(createProjectAction, null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <form action={formAction}>
        <Input
          name="name"
          disabled={isPending} // ✅ Built-in pending state
          required
          minLength={3}
          maxLength={50}
        />
        
        {/* ✅ Server-side validation errors */}
        {state?.error && <p className="text-red-500">{state.error}</p>}
        
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </Dialog>
  );
}
```

### **Key Benefits**

- **Automatic state management**: No manual `useState` for loading/error states
- **Server-side validation**: Validation happens on the server
- **Progressive enhancement**: Forms work without JavaScript
- **Built-in error boundaries**: Integrated with React's error handling
- **Cache invalidation**: Automatic with `revalidatePath()`

## Optimistic Updates Pattern

### **The useOptimistic Hook**

React 19's `useOptimistic` provides instant UI updates while the server processes the request.

```typescript
'use client';

export default function OptimisticProjectList({ initialProjects }) {
  // ✅ useOptimistic for instant UI updates
  const [optimisticProjects, addOptimisticProject] = useOptimistic(
    initialProjects,
    (state: Project[], newProject: Project) => [...state, newProject]
  );

  const [state, formAction, isPending] = useActionState(createProjectAction, null);

  // ✅ Enhanced form action with optimistic updates
  const optimisticFormAction = async (formData: FormData) => {
    const name = formData.get('name') as string;
    
    // 🚀 Instant UI update - no waiting for server!
    const optimisticProject: Project = {
      id: `temp-${Date.now()}`, // Temporary ID
      name: name.trim(),
      userId: 'temp-user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to optimistic state immediately
    addOptimisticProject(optimisticProject);

    // Now run the actual server action
    await formAction(formData);
  };

  return (
    <div>
      {/* Display optimistic + real projects */}
      {optimisticProjects.map((project) => {
        const isOptimistic = project.id.startsWith('temp-');
        
        return (
          <div 
            key={project.id}
            className={isOptimistic ? 'opacity-70 animate-pulse' : ''}
          >
            {project.name}
            {isOptimistic && <span>⚡ Saving...</span>}
          </div>
        );
      })}
      
      <form action={optimisticFormAction}>
        <Input name="name" required />
        <Button type="submit">Create Project ⚡</Button>
      </form>
    </div>
  );
}
```

### **Optimistic Update Benefits**

1. **0ms perceived latency**: UI updates instantly
2. **Smart reconciliation**: Server response replaces optimistic state
3. **Automatic rollback**: Failed requests revert optimistic changes
4. **Visual feedback**: Users can distinguish optimistic vs confirmed states

## Data Fetching Strategies

### **Strategy 1: Server Component Data Fetching**

```typescript
// ✅ Best for: Initial page loads, SEO-critical data
export default async function ProjectsPage() {
  // Runs on server, data available at render time
  const projects = await fetchProjects();
  
  return <ProjectList projects={projects} />;
}
```

### **Strategy 2: Parallel Data Fetching**

```typescript
// ✅ Best for: Multiple independent data sources
export default async function DashboardPage() {
  // Fetch multiple data sources in parallel
  const [projects, flags, stats] = await Promise.all([
    fetchProjects(),
    fetchFeatureFlags(),
    fetchStats(),
  ]);

  return (
    <div>
      <ProjectsSummary projects={projects} />
      <FlagsList flags={flags} />
      <StatsWidget stats={stats} />
    </div>
  );
}
```

### **Strategy 3: Streaming with Suspense**

```typescript
// ✅ Best for: Fast initial render + progressive loading
export default function ProjectsPage() {
  return (
    <div>
      <ProjectsHeader /> {/* Renders immediately */}
      
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectListContainer /> {/* Streams when ready */}
      </Suspense>
      
      <Suspense fallback={<StatsSkeleton />}>
        <ProjectStats /> {/* Streams independently */}
      </Suspense>
    </div>
  );
}
```

## Error Handling

### **Server Action Error Handling**

```typescript
'use server'

export async function createProjectAction(prevState, formData) {
  try {
    // Validation
    const name = formData.get('name') as string;
    if (!name?.trim()) {
      return { success: false, error: 'Project name is required' };
    }

    // API call
    const response = await fetch(API_ENDPOINTS.PROJECTS.CREATE, {...});
    
    if (!response.ok) {
      // Log server errors for debugging
      console.error('API Error:', response.status, response.statusText);
      return { 
        success: false, 
        error: `Failed to create project: ${response.statusText}` 
      };
    }

    const project = await response.json();
    revalidatePath('/projects');
    
    return { success: true, project };
  } catch (error) {
    // Log unexpected errors
    console.error('Unexpected error in createProjectAction:', error);
    
    return { 
      success: false, 
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}
```

### **Error Boundaries for Server Components**

```typescript
// app/error.tsx - Page-level error boundary
'use client';

export default function Error({ error, reset }) {
  const isNetworkError = error.message.includes('fetch failed');
  const isAPIError = error.message.includes('API');

  return (
    <div className="error-container">
      <h1>
        {isNetworkError ? 'Connection Error' : 
         isAPIError ? 'Service Unavailable' : 
         'Something went wrong'}
      </h1>
      
      {process.env.NODE_ENV === 'development' && (
        <details>
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
        </details>
      )}
      
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Performance Optimization

### **1. Smart Cache Management**

```typescript
// Use cache tags for targeted invalidation
export async function fetchProjects() {
  return fetch(url, {
    next: { 
      revalidate: 60,           // Revalidate every 60 seconds
      tags: ['projects']        // Tag for targeted invalidation
    }
  });
}

// Invalidate specific cache tags in Server Actions
'use server'
export async function createProject(formData) {
  // ... create project
  
  revalidateTag('projects'); // Only invalidate projects cache
  // or revalidatePath('/projects') for path-based invalidation
}
```

### **2. Request Memoization**

```typescript
// React automatically memoizes identical requests in Server Components
export default async function ProjectsLayout({ children }) {
  const projects = await fetchProjects(); // Request 1
  
  return (
    <div>
      <ProjectsSidebar projects={projects} />
      <main>
        {/* If child components also call fetchProjects(), 
            React reuses the same request */}
        {children}
      </main>
    </div>
  );
}
```

### **3. Streaming for Better Perceived Performance**

```typescript
// Long operations stream progressively
export default function SlowPage() {
  return (
    <>
      <FastComponent />         {/* Renders immediately */}
      
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />       {/* Streams when ready */}
      </Suspense>
    </>
  );
}
```

## Common Patterns

### **Pattern 1: Container/Presentation Split**

```typescript
// Server Component - handles data fetching
export default async function ProjectListContainer() {
  const projects = await fetchProjects();
  
  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }
  
  return <ProjectList projects={projects} />;
}

// Client Component - handles interactions
'use client';
export default function ProjectList({ projects }) {
  const [filter, setFilter] = useState('');
  
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <div>
      <SearchInput value={filter} onChange={setFilter} />
      {filteredProjects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### **Pattern 2: Progressive Enhancement Forms**

```typescript
// Form works without JavaScript
export default function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(createProjectAction, null);

  return (
    <form action={formAction}>
      {/* Basic HTML form - works without JS */}
      <input 
        name="name" 
        required 
        minLength={3}
        disabled={isPending}
      />
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Project'}
      </button>
      
      {/* Enhanced with React for better UX */}
      {state?.error && (
        <div className="error" role="alert">
          {state.error}
        </div>
      )}
    </form>
  );
}
```

### **Pattern 3: Optimistic Updates with Error Recovery**

```typescript
'use client';

export default function OptimisticTodoList({ initialTodos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    initialTodos,
    (state, action) => {
      switch (action.type) {
        case 'add':
          return [...state, action.todo];
        case 'remove':
          return state.filter(todo => todo.id !== action.id);
        case 'toggle':
          return state.map(todo =>
            todo.id === action.id 
              ? { ...todo, completed: !todo.completed }
              : todo
          );
        default:
          return state;
      }
    }
  );

  const addTodo = async (formData) => {
    const text = formData.get('text');
    const optimisticTodo = {
      id: `temp-${Date.now()}`,
      text,
      completed: false,
    };

    // Optimistic update
    addOptimisticTodo({ type: 'add', todo: optimisticTodo });

    // Server action (will replace optimistic state)
    const result = await createTodoAction(formData);
    
    if (!result.success) {
      // Error handling - optimistic state automatically reverts
      toast.error(result.error);
    }
  };

  return (
    <div>
      <form action={addTodo}>
        <input name="text" required />
        <button type="submit">Add Todo</button>
      </form>
      
      {optimisticTodos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo}
          isOptimistic={todo.id.startsWith('temp-')}
        />
      ))}
    </div>
  );
}
```

## Best Practices Summary

### **✅ DO**

- Use Server Components for data fetching and initial rendering
- Leverage `useActionState` for form handling instead of manual state management
- Implement optimistic updates for better UX with `useOptimistic`
- Use proper cache strategies with `revalidate` and `tags`
- Handle errors gracefully with proper error boundaries
- Follow progressive enhancement principles

### **❌ AVOID**

- Manual loading states when Server Components can handle it
- Client-side data fetching for initial page data
- Disabling cache entirely (`cache: "no-store"`) without good reason
- Complex form state management when Server Actions can handle it
- Ignoring error cases and edge conditions

### **🎯 Key Takeaways**

1. **Server Components** eliminate client-side loading states for initial data
2. **Server Actions + useActionState** provide built-in form state management
3. **Optimistic updates** create instant, responsive user experiences
4. **Smart caching** improves performance without sacrificing freshness
5. **Progressive enhancement** ensures accessibility and reliability

## Migration Guide

### **From React 18 to React 19 Patterns**

```typescript
// ❌ React 18 Pattern
function CreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await fetch('/api/projects', { method: 'POST', ... });
      router.refresh(); // Manual cache invalidation
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Manual state management */}
    </form>
  );
}

// ✅ React 19 Pattern
function CreateProject() {
  const [state, formAction, isPending] = useActionState(createProjectAction, null);
  
  return (
    <form action={formAction}>
      {/* Automatic state management */}
      <input name="name" disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
```

## Conclusion

React 19 Server Components and Server Actions represent a paradigm shift toward better performance, user experience, and developer productivity. By following these patterns, you'll build applications that feel instant, work reliably, and are easier to maintain.

The combination of Server Components for data fetching, Server Actions for mutations, and optimistic updates for UX creates a powerful foundation for modern web applications.

---

*This guide is based on real implementation patterns from the peek-a-boo project. For questions or improvements, create an issue in the repository.*