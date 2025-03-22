# ADR 006: Dark Theme Update to Shadcn UI Rose Theme

## Date
2023-03-25

## Status
Accepted

## Context
After implementing theme management with next-themes (see ADR 005), we needed to enhance the visual appeal of our dark theme to provide a more modern and engaging user experience. The default dark theme was functional but lacked visual distinction and brand personality.

## Decision Drivers
- User experience and visual appeal
- Brand consistency and uniqueness
- Accessibility considerations
- Compatibility with existing UI components
- Maintenance simplicity

## Considered Options
1. **Custom brand theme**: Design a completely custom theme from scratch
2. **Shadcn UI themes**: Use one of the pre-designed themes from the Shadcn UI themes collection
3. **Modified Shadcn theme**: Start with a Shadcn UI theme and customize it further
4. **Keep current theme**: Maintain the existing neutral dark theme

## Decision
We decided to adopt the **Rose theme** from Shadcn UI's themes collection for our dark mode. The Rose theme provides a vibrant, modern aesthetic with a primary color palette centered around rose/pink tones.

## Rationale
The Rose theme was selected for several reasons:

1. **Visual Distinction**: The rose accents provide a distinctive look compared to many standard dark themes
2. **Aesthetic Appeal**: The theme offers a balanced, modern look that aligns with current design trends
3. **Emotional Response**: The rose tones evoke energy and engagement
4. **Pre-tested Solution**: As a pre-designed theme, it's already been tested for contrast and accessibility
5. **Implementation Simplicity**: Can be implemented by updating CSS variables without structural changes
6. **Consistency**: Works seamlessly with our existing Shadcn UI components

## Implementation
Implementation involved updating the CSS variables in our `globals.css` file to match the Rose theme color palette:

```css
.dark {
  --background: 20 14.3% 4.1%;
  --foreground: 0 0% 95%;
  --card: 24 9.8% 10%;
  --card-foreground: 0 0% 95%;
  --popover: 0 0% 9%;
  --popover-foreground: 0 0% 95%;
  --primary: 346.8 77.2% 49.8%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 15%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 12 6.5% 15.1%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 85.7% 97.3%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 346.8 77.2% 49.8%;
}
```

We also updated chart colors to maintain consistency:

```css
--chart-1: 346.8 77.2% 49.8%;
--chart-2: 326.8 75.2% 45.8%;
--chart-3: 20 70% 50%;
--chart-4: 280 65% 60%;
--chart-5: 300 75% 55%;
```

## Consequences

### Positive
- Enhanced visual appeal in dark mode
- Better brand differentiation
- Improved user engagement through more vibrant UI
- Consistency across UI components
- Easy to implement with minimal code changes

### Negative
- Potential need for adjustments in custom components to work with the new theme
- Slightly harder to differentiate between primary and error states due to similar hue families
- May require future refinement based on user feedback

### Neutral
- Users accustomed to the previous dark theme will need to adapt to the new color scheme
- Some documentation screenshots may need to be updated to reflect the new theme

## References
- [Shadcn UI Themes](https://ui.shadcn.com/themes) 
- [HSL Color Format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) 