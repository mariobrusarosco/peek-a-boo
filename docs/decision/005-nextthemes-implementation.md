# ADR 005: Theme Management with next-themes

## Date
2023-03-24

## Status
Accepted

## Context
Our Feature Flag SaaS platform requires a robust theming system to provide users with visual preferences (light, dark, and system modes). We need a solution that:

- Respects user preferences across sessions
- Handles server-side rendering (SSR) challenges in Next.js
- Works seamlessly with our Tailwind CSS and Shadcn UI setup
- Provides a clean, accessible API for theme switching
- Avoids common pitfalls like flash of incorrect theme (FOIT)

## Decision Drivers
- Developer experience and ease of implementation
- End-user experience and accessibility
- Integration with existing technology stack
- Performance and avoiding UI flicker
- Support for browser/OS system preferences

## Considered Options
1. **Manual Implementation**: Custom theme handling with context and localStorage
2. **CSS-only Approach**: Using `prefers-color-scheme` media queries
3. **next-themes**: Specialized library for Next.js theming
4. **Tailwind CSS Dark Mode Plugin**: Using Tailwind's built-in dark mode
5. **Component Library Theming**: Using a UI library with theme support

## Decision
We will implement theme management using the **next-themes** library, coupled with Tailwind CSS configured for class-based dark mode.

## Rationale
`next-themes` is specifically designed for Next.js applications and provides robust solutions for the common challenges in implementing themes:

### Core Features and Benefits
- **Theme Persistence**: Uses localStorage (with cookie fallback) to remember user theme preferences
- **SSR Handling**: Prevents theme "flashing" during initial load with proper hydration handling
- **System Preference Support**: Uses `prefers-color-scheme` media query with real-time updates
- **Clean API**: Provides an intuitive hook-based API for theme management
- **Tailwind Integration**: Works perfectly with Tailwind's dark mode 'class' strategy

### Implementation Details
- The library handles theme changes by modifying the HTML element class or attribute
- Enables a "system" theme option that respects OS/browser preferences
- Prevents layout shifts and flickering during theme transitions
- Small bundle size (~1KB) with no dependencies

### Performance Considerations
- Hydration mismatch handling with `suppressHydrationWarning`
- Option to disable transitions during theme change to prevent flicker
- Client-side only rendering of theme toggle components

## Implementation
Our implementation includes:

1. **ThemeProvider**: Wraps the application to provide theme context
   ```tsx
   <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
     {children}
   </ThemeProvider>
   ```

2. **Theme Toggle Component**: Allows users to switch between themes
   ```tsx
   const { theme, setTheme } = useTheme();
   // UI to toggle between 'light', 'dark', and 'system'
   ```

3. **CSS Variables**: Theme-specific variables in light and dark variants
   ```css
   :root {
     --background: 0 0% 100%;
     --foreground: 0 0% 3.9%;
   }
   .dark {
     --background: 0 0% 3.9%;
     --foreground: 0 0% 98%;
   }
   ```

4. **Tailwind Configuration**: Class-based dark mode strategy
   ```js
   // tailwind.config.js
   darkMode: ['class', '[data-theme="dark"]'],
   ```

## Consequences

### Positive
- Seamless theme switching without page refresh
- System preference detection and real-time updates
- Proper handling of SSR and hydration
- Persistent theme preference across sessions
- Accessibility improvements for users who need specific color schemes

### Negative
- Additional dependency in the project
- Potential for complex debugging of hydration issues
- Slight increase in client JavaScript bundle

### Neutral
- Need to design components with both themes in mind
- CSS variables require consistent application across custom components

## Alternatives Not Chosen

### Manual Implementation
While offering more control, a manual implementation would require handling all edge cases ourselves, including SSR hydration issues, persistence, and system preference detection.

### CSS-only Approach
Using only CSS media queries would limit users to system preference without the ability to override, reducing user choice.

### Tailwind Dark Mode Plugin Alone
Tailwind's dark mode support is excellent but doesn't handle theme persistence, switching UI, or system preference detection.

### Component Library Theming
Would tie us to specific component implementations and potentially limit our custom design system.

## References
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Next.js Documentation on SSR](https://nextjs.org/docs/basic-features/data-fetching) 