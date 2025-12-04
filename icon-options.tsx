/**
 * Icon Options for Orbital DB
 *
 * This file contains various icon designs for the Orbital DB application.
 * Each icon can be tested by importing and using in Sidebar.tsx
 *
 * Usage:
 * import { SpaceStationIconV0, SpaceStationIconV1 } from './icon-options';
 */

// =============================================================================
// OPTION 0: Original Space Station Icon
// =============================================================================
// Design: Classic space station with central hub, solar panels, and orbital ring
// Created: Initial design for Orbital DB
// Style: Detailed with multiple elements (hub, panels, arms, ring, antenna)

export function SpaceStationIconV0({ className = "w-8 h-8" }: { className?: string }) {
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


// =============================================================================
// OPTION 1: Minimalist Top-Down Space Station
// =============================================================================
// Design: Futuristic space station viewed from above with 6 symmetrical modules
// Prompt: "A minimalist line-art logo of a futuristic space station seen from
//          above, arranged in a circular shape like a hub with four or six modules
//          extending out symmetrically. Clean geometric lines, no tiny details,
//          optimized for small icon sizes."
// Style: Flat vector, clean lines, no gradients, hexagonal hub with radial modules

export function SpaceStationIconV1({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central hexagonal hub */}
      <path
        d="M 32 20 L 38 24 L 38 32 L 32 36 L 26 32 L 26 24 Z"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Module 1 - Top */}
      <rect
        x="29"
        y="8"
        width="6"
        height="10"
        fill="currentColor"
        opacity="0.7"
        rx="1"
      />
      <line x1="32" y1="18" x2="32" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.8" />

      {/* Module 2 - Top Right */}
      <rect
        x="42"
        y="14"
        width="10"
        height="6"
        fill="currentColor"
        opacity="0.7"
        rx="1"
        transform="rotate(30 47 17)"
      />
      <line x1="38" y1="24" x2="42" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.8" />

      {/* Module 3 - Bottom Right */}
      <rect
        x="42"
        y="44"
        width="10"
        height="6"
        fill="currentColor"
        opacity="0.7"
        rx="1"
        transform="rotate(-30 47 47)"
      />
      <line x1="38" y1="32" x2="42" y2="36" stroke="currentColor" strokeWidth="2" opacity="0.8" />

      {/* Module 4 - Bottom */}
      <rect
        x="29"
        y="46"
        width="6"
        height="10"
        fill="currentColor"
        opacity="0.7"
        rx="1"
      />
      <line x1="32" y1="36" x2="32" y2="46" stroke="currentColor" strokeWidth="2" opacity="0.8" />

      {/* Module 5 - Bottom Left */}
      <rect
        x="12"
        y="44"
        width="10"
        height="6"
        fill="currentColor"
        opacity="0.7"
        rx="1"
        transform="rotate(30 17 47)"
      />
      <line x1="26" y1="32" x2="22" y2="36" stroke="currentColor" strokeWidth="2" opacity="0.8" />

      {/* Module 6 - Top Left */}
      <rect
        x="12"
        y="14"
        width="10"
        height="6"
        fill="currentColor"
        opacity="0.7"
        rx="1"
        transform="rotate(-30 17 17)"
      />
      <line x1="26" y1="24" x2="22" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.8" />

      {/* Outer orbital ring */}
      <circle
        cx="32"
        cy="32"
        r="26"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.25"
      />

      {/* Inner orbital ring */}
      <circle
        cx="32"
        cy="32"
        r="18"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}


// =============================================================================
// OPTION 2: Isometric Modular Space Station
// =============================================================================
// Design: Modern isometric view of a modular space station with geometric modules
// Prompt: "A modern isometric logo featuring a modular space station in orbit.
//          Connected geometric modules forming a ring or cross shape. Angled
//          perspective like an isometric diagram. Subtle gradients for high-tech
//          feel, simple and readable at medium size."
// Style: Isometric perspective, geometric modules, glowing accents

export function SpaceStationIconV2({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for glowing core */}
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </radialGradient>

        {/* Gradient for modules */}
        <linearGradient id="moduleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Planet (background element) */}
      <circle cx="48" cy="48" r="12" fill="currentColor" opacity="0.15" />

      {/* Central core module (isometric cube) */}
      {/* Top face */}
      <path
        d="M 32 26 L 38 22 L 38 28 L 32 32 Z"
        fill="url(#coreGlow)"
        opacity="0.9"
      />
      {/* Left face */}
      <path
        d="M 32 26 L 26 22 L 26 28 L 32 32 Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Front face */}
      <path
        d="M 26 28 L 32 32 L 38 28 L 32 24 Z"
        fill="currentColor"
        opacity="0.85"
      />

      {/* Module 1 - Top Right */}
      <path
        d="M 40 20 L 48 16 L 48 20 L 40 24 Z"
        fill="url(#moduleGradient)"
      />
      <path
        d="M 40 24 L 48 20 L 48 24 L 40 28 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Connector */}
      <line x1="38" y1="25" x2="40" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

      {/* Module 2 - Right */}
      <path
        d="M 42 30 L 50 26 L 50 30 L 42 34 Z"
        fill="url(#moduleGradient)"
      />
      <path
        d="M 42 34 L 50 30 L 50 34 L 42 38 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Connector */}
      <line x1="38" y1="30" x2="42" y2="32" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

      {/* Module 3 - Bottom Right */}
      <path
        d="M 36 36 L 44 32 L 44 36 L 36 40 Z"
        fill="url(#moduleGradient)"
      />
      <path
        d="M 36 40 L 44 36 L 44 40 L 36 44 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Connector */}
      <line x1="34" y1="34" x2="36" y2="36" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

      {/* Module 4 - Left */}
      <path
        d="M 14 26 L 22 22 L 22 26 L 14 30 Z"
        fill="url(#moduleGradient)"
      />
      <path
        d="M 14 30 L 22 26 L 22 30 L 14 34 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Connector */}
      <line x1="26" y1="28" x2="22" y2="26" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

      {/* Module 5 - Top Left */}
      <path
        d="M 16 16 L 24 12 L 24 16 L 16 20 Z"
        fill="url(#moduleGradient)"
      />
      <path
        d="M 16 20 L 24 16 L 24 20 L 16 24 Z"
        fill="currentColor"
        opacity="0.6"
      />
      {/* Connector */}
      <line x1="26" y1="24" x2="24" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />

      {/* Orbital ring (subtle) */}
      <ellipse
        cx="32"
        cy="32"
        rx="22"
        ry="12"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.25"
        transform="rotate(-15 32 32)"
      />

      {/* Glowing accents on core */}
      <circle cx="32" cy="28" r="1.5" fill="currentColor" opacity="0.9" />
      <circle cx="30" cy="26" r="1" fill="currentColor" opacity="0.8" />
      <circle cx="34" cy="26" r="1" fill="currentColor" opacity="0.8" />
    </svg>
  );
}


// =============================================================================
// OPTION 3: Mission Patch Style
// =============================================================================
// Design: Circular badge-style logo with space station orbiting a planet
// Prompt: "A circular 'mission patch' style logo with a stylized space station
//          orbiting a planet. The station curves slightly around the planet to
//          suggest motion, with a thin orbital trail line. The overall shape is
//          a circle so it works as a badge or app icon. Use a limited color
//          palette: dark blue for space, a subtle gradient for the planet, and
//          bright accent colors (white, cyan, or mint) for the station and
//          orbital line. Clean, modern, not retro. No text, no stars cluttering
//          the background, crisp vector shapes."
// Style: Circular badge, clean vectors, minimal palette, orbital motion

export function SpaceStationIconV3({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Planet gradient - subtle depth */}
        <radialGradient id="planetGradient" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
        </radialGradient>
      </defs>

      {/* Outer badge circle - defines the circular badge shape */}
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.2"
        fill="none"
      />

      {/* Planet - positioned lower right */}
      <circle
        cx="40"
        cy="40"
        r="16"
        fill="url(#planetGradient)"
      />

      {/* Orbital path - elliptical curve around planet */}
      <ellipse
        cx="32"
        cy="32"
        rx="24"
        ry="20"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 2"
        opacity="0.35"
        fill="none"
        transform="rotate(-25 32 32)"
      />

      {/* Space station - positioned on orbital path (top left quadrant) */}
      {/* Central hub */}
      <circle
        cx="18"
        cy="22"
        r="3"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Solar panel - left */}
      <rect
        x="10"
        y="20.5"
        width="6"
        height="3"
        fill="currentColor"
        opacity="0.7"
        rx="0.5"
      />

      {/* Solar panel - right */}
      <rect
        x="21"
        y="20.5"
        width="6"
        height="3"
        fill="currentColor"
        opacity="0.7"
        rx="0.5"
      />

      {/* Motion trail - suggests orbital movement */}
      <path
        d="M 12 18 Q 8 16, 6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M 10 20 Q 6 18, 4 14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.3"
        fill="none"
      />

      {/* Accent highlights on station */}
      <circle cx="18" cy="22" r="1" fill="currentColor" opacity="1" />
      <circle cx="16.5" cy="21" r="0.5" fill="currentColor" opacity="0.8" />
      <circle cx="19.5" cy="21" r="0.5" fill="currentColor" opacity="0.8" />
    </svg>
  );
}


// =============================================================================
// OPTION 4: HUD Wireframe Schematic
// =============================================================================
// Design: Technical HUD-style wireframe schematic with neon glow effect
// Prompt: "A HUD-style logo of a space station drawn as a thin neon wireframe,
//          like a technical schematic. The station is centered and slightly
//          rotated, made of geometric modules connected to a circular core.
//          Background is nearly black with faint grid lines or concentric
//          circles to suggest scanning or targeting. Lines are a single bright
//          accent color (e.g., teal or electric blue) with subtle glow. No text,
//          no gradients on shapes, just neon-style strokes and a hint of
//          technical overlays."
// Style: Wireframe HUD, technical schematic, neon glow, minimal fills

export function SpaceStationIconV4({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Neon glow filter for wireframe effect */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background grid - faint concentric circles (targeting/scanning effect) */}
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
      <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />

      {/* Crosshair/targeting lines */}
      <line x1="32" y1="4" x2="32" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="32" y1="54" x2="32" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="4" y1="32" x2="10" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />
      <line x1="54" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.12" />

      {/* Central core - circular wireframe hub */}
      <circle
        cx="32"
        cy="32"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.9"
        filter="url(#neonGlow)"
      />

      {/* Inner core detail */}
      <circle
        cx="32"
        cy="32"
        r="3"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
        filter="url(#neonGlow)"
      />

      {/* Module 1 - Top (rotated 15 degrees) */}
      <g transform="rotate(-15 32 32)">
        {/* Connecting strut */}
        <line x1="32" y1="26" x2="32" y2="16" stroke="currentColor" strokeWidth="1.2" opacity="0.8" filter="url(#neonGlow)" />
        {/* Module rectangle */}
        <rect
          x="28"
          y="12"
          width="8"
          height="4"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.8"
          filter="url(#neonGlow)"
        />
        {/* Module detail lines */}
        <line x1="30" y1="12" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <line x1="34" y1="12" x2="34" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      </g>

      {/* Module 2 - Top Right */}
      <g transform="rotate(45 32 32)">
        <line x1="32" y1="26" x2="32" y2="18" stroke="currentColor" strokeWidth="1.2" opacity="0.8" filter="url(#neonGlow)" />
        <rect
          x="29"
          y="14"
          width="6"
          height="4"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.8"
          filter="url(#neonGlow)"
        />
      </g>

      {/* Module 3 - Right */}
      <g transform="rotate(90 32 32)">
        <line x1="32" y1="26" x2="32" y2="16" stroke="currentColor" strokeWidth="1.2" opacity="0.8" filter="url(#neonGlow)" />
        <rect
          x="28"
          y="12"
          width="8"
          height="4"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.8"
          filter="url(#neonGlow)"
        />
        <line x1="30" y1="12" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <line x1="34" y1="12" x2="34" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      </g>

      {/* Module 4 - Bottom Right */}
      <g transform="rotate(135 32 32)">
        <line x1="32" y1="26" x2="32" y2="18" stroke="currentColor" strokeWidth="1.2" opacity="0.8" filter="url(#neonGlow)" />
        <rect
          x="29"
          y="14"
          width="6"
          height="4"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.8"
          filter="url(#neonGlow)"
        />
      </g>

      {/* Module 5 - Bottom */}
      <g transform="rotate(180 32 32)">
        <line x1="32" y1="26" x2="32" y2="16" stroke="currentColor" strokeWidth="1.2" opacity="0.8" filter="url(#neonGlow)" />
        <rect
          x="28"
          y="12"
          width="8"
          height="4"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.8"
          filter="url(#neonGlow)"
        />
        <line x1="30" y1="12" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <line x1="34" y1="12" x2="34" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      </g>

      {/* Module 6 - Bottom Left */}
      <g transform="rotate(225 32 32)">
        <line x1="32" y1="26" x2="32" y2="18" stroke="currentColor" strokeWidth="1.2" opacity="0.8" filter="url(#neonGlow)" />
        <rect
          x="29"
          y="14"
          width="6"
          height="4"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.8"
          filter="url(#neonGlow)"
        />
      </g>

      {/* Module 7 - Left */}
      <g transform="rotate(270 32 32)">
        <line x1="32" y1="26" x2="32" y2="16" stroke="currentColor" strokeWidth="1.2" opacity="0.8" filter="url(#neonGlow)" />
        <rect
          x="28"
          y="12"
          width="8"
          height="4"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.8"
          filter="url(#neonGlow)"
        />
        <line x1="30" y1="12" x2="30" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <line x1="34" y1="12" x2="34" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      </g>

      {/* Module 8 - Top Left */}
      <g transform="rotate(315 32 32)">
        <line x1="32" y1="26" x2="32" y2="18" stroke="currentColor" strokeWidth="1.2" opacity="0.8" filter="url(#neonGlow)" />
        <rect
          x="29"
          y="14"
          width="6"
          height="4"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.8"
          filter="url(#neonGlow)"
        />
      </g>

      {/* Outer scan ring - rotating effect suggested by partial arc */}
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="4 8"
        opacity="0.15"
      />

      {/* Corner brackets - HUD interface elements */}
      <path d="M 8 8 L 8 12 M 8 8 L 12 8" stroke="currentColor" strokeWidth="0.8" opacity="0.2" strokeLinecap="square" />
      <path d="M 56 8 L 56 12 M 56 8 L 52 8" stroke="currentColor" strokeWidth="0.8" opacity="0.2" strokeLinecap="square" />
      <path d="M 8 56 L 8 52 M 8 56 L 12 56" stroke="currentColor" strokeWidth="0.8" opacity="0.2" strokeLinecap="square" />
      <path d="M 56 56 L 56 52 M 56 56 L 52 56" stroke="currentColor" strokeWidth="0.8" opacity="0.2" strokeLinecap="square" />
    </svg>
  );
}


// =============================================================================
// OPTION 5: Minimal Abstract Orbital
// =============================================================================
// Design: Ultra-simplified abstract icon optimized for tiny sizes (favicons, toolbars)
// Prompt: "A highly simplified abstract logo suggesting a space station in orbit:
//          a small central hexagon or circle representing the station, with one
//          or two thin elliptical orbit paths around it, slightly tilted for a
//          sense of motion. One point on the orbit can have a small solid node
//          to suggest a docking module. Very minimal, flat vector, 2–3 colors
//          max (primary accent, neutral, background). No text. Designed to be
//          extremely readable at tiny sizes like favicons and toolbar icons."
// Style: Minimal abstract, flat vector, optimized for small sizes, 2-3 colors

export function SpaceStationIconV5({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer orbital path - thin ellipse, tilted */}
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="18"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
        transform="rotate(-20 32 32)"
      />

      {/* Inner orbital path - smaller ellipse, tilted opposite direction */}
      <ellipse
        cx="32"
        cy="32"
        rx="18"
        ry="12"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
        transform="rotate(15 32 32)"
      />

      {/* Central station - hexagon */}
      <path
        d="M 32 24 L 38 28 L 38 36 L 32 40 L 26 36 L 26 28 Z"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Docking module - small node on outer orbit (top right position) */}
      <circle
        cx="50"
        cy="24"
        r="3.5"
        fill="currentColor"
        opacity="0.8"
      />

      {/* Secondary docking module - smaller node on inner orbit (left position) */}
      <circle
        cx="16"
        cy="36"
        r="2.5"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}


// =============================================================================
// OPTION 6: Blueprint Schematic Top View
// =============================================================================
// Design: Monochrome blueprint-style technical drawing from top view
// Prompt: "A monochrome blueprint-style logo of a space station from the top
//          view. The station is a circular core with four symmetric arms
//          extending outward, each ending in a small square or circular module.
//          All shapes are drawn as thin outlines with simple geometry, no
//          shading. Color: single solid color (e.g., deep blue or charcoal) on
//          a transparent or light background. No gradients, no glow, no text.
//          Must remain recognizable when printed in black and white or scaled
//          down to a small size."
// Style: Blueprint/technical drawing, monochrome outlines, top-down view, print-friendly

export function SpaceStationIconV6({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central circular core - outer ring */}
      <circle
        cx="32"
        cy="32"
        r="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      {/* Central core - inner detail ring */}
      <circle
        cx="32"
        cy="32"
        r="5"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* Core center point */}
      <circle
        cx="32"
        cy="32"
        r="2"
        fill="currentColor"
      />

      {/* Arm 1 - Top (North) */}
      {/* Connecting strut */}
      <line
        x1="32"
        y1="24"
        x2="32"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Module - square */}
      <rect
        x="28"
        y="6"
        width="8"
        height="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Module detail - cross inside */}
      <line x1="32" y1="6" x2="32" y2="14" stroke="currentColor" strokeWidth="0.8" />
      <line x1="28" y1="10" x2="36" y2="10" stroke="currentColor" strokeWidth="0.8" />

      {/* Arm 2 - Right (East) */}
      {/* Connecting strut */}
      <line
        x1="40"
        y1="32"
        x2="54"
        y2="32"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Module - circle */}
      <circle
        cx="58"
        cy="32"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Module detail - inner circle */}
      <circle
        cx="58"
        cy="32"
        r="2"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* Arm 3 - Bottom (South) */}
      {/* Connecting strut */}
      <line
        x1="32"
        y1="40"
        x2="32"
        y2="54"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Module - square */}
      <rect
        x="28"
        y="50"
        width="8"
        height="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Module detail - cross inside */}
      <line x1="32" y1="50" x2="32" y2="58" stroke="currentColor" strokeWidth="0.8" />
      <line x1="28" y1="54" x2="36" y2="54" stroke="currentColor" strokeWidth="0.8" />

      {/* Arm 4 - Left (West) */}
      {/* Connecting strut */}
      <line
        x1="24"
        y1="32"
        x2="10"
        y2="32"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Module - circle */}
      <circle
        cx="6"
        cy="32"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Module detail - inner circle */}
      <circle
        cx="6"
        cy="32"
        r="2"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* Blueprint reference marks - corner registration marks */}
      <line x1="2" y1="2" x2="6" y2="2" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="2" y1="2" x2="2" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

      <line x1="62" y1="2" x2="58" y2="2" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="62" y1="2" x2="62" y2="6" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

      <line x1="2" y1="62" x2="6" y2="62" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="2" y1="62" x2="2" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />

      <line x1="62" y1="62" x2="58" y2="62" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="62" y1="62" x2="62" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}


// =============================================================================
// OPTION 7: Minimalist Top-Down with Color Palette
// =============================================================================
// Design: Clean line-art space station from above with specific color scheme
// Prompt: "A minimalist line-art logo of a futuristic space station seen from
//          above, arranged in a circular shape like a hub with six modules
//          extending out symmetrically. Clean geometric lines, no tiny details,
//          optimized for small icon sizes. Use a limited color palette with a
//          deep navy background (#0b1f3a) and bright electric teal accent lines
//          (#15d1d3). The station should clearly read as an orbital structure,
//          not a planet or rocket. Flat vector style, no gradients, no text."
// Style: Minimalist line-art, top-down view, limited color palette, flat vector
// Note: This icon uses specific colors instead of currentColor

export function SpaceStationIconV7({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle - deep navy */}
      <circle
        cx="32"
        cy="32"
        r="31"
        fill="#0b1f3a"
      />

      {/* Central hub - electric teal outline */}
      <circle
        cx="32"
        cy="32"
        r="8"
        stroke="#15d1d3"
        strokeWidth="2"
      />

      {/* Inner hub detail - concentric ring */}
      <circle
        cx="32"
        cy="32"
        r="5"
        stroke="#15d1d3"
        strokeWidth="1.5"
      />

      {/* Module 1 - Top (0°) */}
      <line
        x1="32"
        y1="24"
        x2="32"
        y2="14"
        stroke="#15d1d3"
        strokeWidth="2"
      />
      <rect
        x="29"
        y="10"
        width="6"
        height="6"
        stroke="#15d1d3"
        strokeWidth="1.5"
      />

      {/* Module 2 - Top Right (60°) */}
      <line
        x1="38.93"
        y1="26"
        x2="43.86"
        y2="22"
        stroke="#15d1d3"
        strokeWidth="2"
      />
      <rect
        x="42.5"
        y="18"
        width="6"
        height="6"
        stroke="#15d1d3"
        strokeWidth="1.5"
        transform="rotate(30 45.5 21)"
      />

      {/* Module 3 - Bottom Right (120°) */}
      <line
        x1="38.93"
        y1="38"
        x2="43.86"
        y2="42"
        stroke="#15d1d3"
        strokeWidth="2"
      />
      <rect
        x="42.5"
        y="40"
        width="6"
        height="6"
        stroke="#15d1d3"
        strokeWidth="1.5"
        transform="rotate(-30 45.5 43)"
      />

      {/* Module 4 - Bottom (180°) */}
      <line
        x1="32"
        y1="40"
        x2="32"
        y2="50"
        stroke="#15d1d3"
        strokeWidth="2"
      />
      <rect
        x="29"
        y="48"
        width="6"
        height="6"
        stroke="#15d1d3"
        strokeWidth="1.5"
      />

      {/* Module 5 - Bottom Left (240°) */}
      <line
        x1="25.07"
        y1="38"
        x2="20.14"
        y2="42"
        stroke="#15d1d3"
        strokeWidth="2"
      />
      <rect
        x="15.5"
        y="40"
        width="6"
        height="6"
        stroke="#15d1d3"
        strokeWidth="1.5"
        transform="rotate(30 18.5 43)"
      />

      {/* Module 6 - Top Left (300°) */}
      <line
        x1="25.07"
        y1="26"
        x2="20.14"
        y2="22"
        stroke="#15d1d3"
        strokeWidth="2"
      />
      <rect
        x="15.5"
        y="18"
        width="6"
        height="6"
        stroke="#15d1d3"
        strokeWidth="1.5"
        transform="rotate(-30 18.5 21)"
      />

      {/* Orbital ring - subtle outer circle */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="#15d1d3"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}


// =============================================================================
// Usage Examples
// =============================================================================

/*
// In Sidebar.tsx, replace the SpaceStationIcon import with:

import { SpaceStationIconV0, SpaceStationIconV1, SpaceStationIconV2, SpaceStationIconV3, SpaceStationIconV4, SpaceStationIconV5, SpaceStationIconV6, SpaceStationIconV7 } from './icon-options';

// Then use in the component:
<SpaceStationIconV0 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
// or
<SpaceStationIconV1 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
// or
<SpaceStationIconV2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
// or
<SpaceStationIconV3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
// or
<SpaceStationIconV4 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
// or
<SpaceStationIconV5 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
// or
<SpaceStationIconV6 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
// or
<SpaceStationIconV7 className="w-8 h-8" />  {/* Note: V7 uses specific colors, not currentColor */}

// To test multiple options side by side:
<div className="flex space-x-4">
  <SpaceStationIconV0 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
  <SpaceStationIconV1 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
  <SpaceStationIconV2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
  <SpaceStationIconV3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
  <SpaceStationIconV4 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
  <SpaceStationIconV5 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
  <SpaceStationIconV6 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
  <SpaceStationIconV7 className="w-8 h-8" />
</div>
*/
