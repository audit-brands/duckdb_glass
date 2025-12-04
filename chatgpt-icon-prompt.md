# ChatGPT Prompt: Generate Alternative Icons for Orbital DB

## Context
I'm building a desktop database client called "Orbital DB" (a DuckDB client). I currently have a space station icon in my sidebar, and I'd like to explore alternative icon designs that fit the "orbital" theme while being professional and clean.

## Current Icon (for reference)
Here's my current SpaceStationIcon component:

```tsx
function SpaceStationIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central hub */}
      <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.9" />

      {/* Solar panels - left */}
      <rect x="4" y="28" width="16" height="8" fill="currentColor" opacity="0.6" rx="1" />
      <line x1="6" y1="30" x2="18" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="6" y1="32" x2="18" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="6" y1="34" x2="18" y2="34" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

      {/* Solar panels - right */}
      <rect x="44" y="28" width="16" height="8" fill="currentColor" opacity="0.6" rx="1" />
      <line x1="46" y1="30" x2="58" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="46" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="46" y1="34" x2="58" y2="34" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

      {/* Connecting arms */}
      <rect x="20" y="30" width="4" height="4" fill="currentColor" opacity="0.8" />
      <rect x="40" y="30" width="4" height="4" fill="currentColor" opacity="0.8" />

      {/* Orbital ring */}
      <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />

      {/* Antenna */}
      <line x1="32" y1="24" x2="32" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <circle cx="32" cy="14" r="2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
```

## Requirements for New Icons

Please generate **3-5 alternative icon designs** as React/TypeScript components following these guidelines:

### Technical Requirements:
1. **Format**: React/TypeScript functional component
2. **Props**: Accept `className` prop with default `"w-8 h-8"`
3. **SVG specs**:
   - `viewBox="0 0 64 64"`
   - `fill="none"`
   - Use `currentColor` so the icon adapts to text color
4. **Style**: Use `opacity` values for depth/layering
5. **Clean code**: Add comments to describe each visual element

### Design Requirements:
1. **Theme**: Related to "orbital", "space", "database", or "data orbits"
2. **Style**: Modern, minimal, professional (suitable for developer tools)
3. **Simplicity**: Should work at small sizes (16px - 64px)
4. **Recognizable**: Should be distinctive and memorable

### Icon Ideas to Explore:
- Satellite orbiting data
- Orbital paths with nodes
- Planet with rings (like Saturn, but database-themed)
- Constellation pattern
- Database cylinder in orbit
- Abstract orbital pattern
- Duck in orbit (DuckDB reference)
- Data nodes connected by orbital paths

## Output Format

For each icon, provide:

1. **Component name** (e.g., `SatelliteIcon`, `OrbitalRingIcon`, etc.)
2. **Full TypeScript code** ready to copy-paste
3. **Brief description** of the design concept
4. **Usage example** showing how it looks with the className prop

Example output structure:

```tsx
// Icon 1: Satellite Icon
// Design: A simplified satellite with solar panels orbiting around a central point
function SatelliteIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Your SVG elements here */}
    </svg>
  );
}

// Usage:
<SatelliteIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
```

## Goal
I want to compare different icon options and pick one that best represents "Orbital DB" - a modern database client with a space/orbital theme. The icon will be used in:
- Sidebar header (8x8 tailwind units, ~32px)
- Application icon (scaled up to 512px-1024px)
- Marketing materials

Please generate creative, professional alternatives that I can easily integrate into my React/TypeScript codebase!
