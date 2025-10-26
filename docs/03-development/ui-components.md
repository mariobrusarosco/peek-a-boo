# UI Components and Shadcn UI

This guide provides an overview of our UI component system, which is built using Shadcn UI.

## What is Shadcn UI?

[Shadcn UI](https://ui.shadcn.com/) is a collection of reusable components built with Radix UI and styled with Tailwind CSS. Unlike traditional component libraries, Shadcn UI does not provide pre-packaged components. Instead, it offers a CLI tool that allows you to copy high-quality component code directly into your project.

Key benefits of this approach:
- **Full control over the code**: You own the components and can modify them as needed
- **No dependencies to manage**: Components live in your codebase, not as external packages
- **Optimized bundle size**: Only include the components you need
- **Consistent styling**: All components follow the same design system
- **Accessibility**: Built on top of Radix UI primitives, which are fully accessible

## Our Implementation

We've integrated Shadcn UI into our Feature Flag SaaS platform with the following configuration:

- **Style**: New York
- **Color**: Neutral
- **Components**: A curated selection of UI components for building our dashboard and forms

## Available Components

We've included the following components from Shadcn UI:

### Layout Components
- `Card`: For creating content containers with headers, footers, and bodies
- `Sheet`: For slide-out panels, particularly useful for mobile navigation

### Form Components
- `Button`: For actions and submissions
- `Input`: For text input fields
- `Checkbox`: For boolean selections
- `Select`: For dropdown selections
- `Textarea`: For multi-line text input
- `Toggle`: For on/off switches
- `Label`: For form field labels

### Data Display Components
- `Table`: For structured data display
- `Tabs`: For tabbed interfaces
- `Dialog`: For modal dialogs
- `Alert`: For notifications and messages
- `Avatar`: For user avatars
- `Dropdown Menu`: For context menus

## Using the Components

All components are available in the `src/components/ui` directory. Here's how to use them:

```tsx
// Import the component
import { Button } from "@/components/ui/button";

// Use it in your JSX
function MyComponent() {
  return (
    <Button variant="default">Click me</Button>
  );
}
```

## Variants and Props

Most components support various variants and props. For example, the Button component has several variants:

```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

You can refer to the component's source code to see all available props and variants.

## Adding New Components

To add a new component from Shadcn UI:

```bash
pnpm dlx shadcn@latest add [component-name]
```

For example, to add the Dialog component:

```bash
pnpm dlx shadcn@latest add dialog
```

## Customizing Components

Since all components are part of our codebase, you can customize them directly. The components are located in `src/components/ui`.

When customizing, keep in mind:
- Maintain accessibility features
- Follow our design system for consistent styling
- Document any significant changes to component behavior

## Theme and Styling

Shadcn UI uses Tailwind CSS for styling. The theme is configured in `tailwind.config.ts`.

Our base styles are defined in `src/app/globals.css`, which includes:
- Base styles
- Component styles
- Utility styles

## Best Practices

1. **Composition over inheritance**: Compose components together rather than extending them
2. **Maintain accessibility**: Don't remove accessibility attributes from components
3. **Keep it simple**: Use the simplest component that meets your needs
4. **Be consistent**: Follow our design patterns for component usage
5. **Document customizations**: If you modify a component's behavior, document it

## References

- [Shadcn UI Documentation](https://ui.shadcn.com/docs)
- [Radix UI](https://radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/) 