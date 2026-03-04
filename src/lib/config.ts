// App configuration — single source of truth for all identity/attribution text.
// Layout Builder populates these values from the Creative Brief.

// Aesthetic profiles correspond to [data-theme] blocks in globals.css.
// The Creative Director selects the aesthetic based on research into
// the client's domain, competitors, and brand signals.
// See references/design-system.md for full aesthetic specs.
export type AestheticProfile =
  | "linear"               // Snappy, border-first, dev-tool feel (DEFAULT)
  | "bold-editorial"       // Type-as-design, dramatic whitespace, sharp edges
  | "warm-organic"         // Rounded, earth tones, soft shadows, breathing room
  | "corporate-enterprise" // Dense, structured, authoritative, max information
  | "dark-premium"         // Dark canvas, controlled accent glow, exclusive
  | "neobrutalism"         // Thick borders, offset hard shadows, raw energy
  | "nature-wellness"      // Green, calm, generous space, anti-anxiety pacing
  | "data-dense"           // Compact, monospace metrics, max info per pixel
  | "saas-modern"          // Friendly gradients, approachable, conversion-focused
  | "e-commerce";          // Product-first, clean, conversion-optimized

// Demo format determines the Tab 1 layout architecture.
// The Creative Director selects the format based on research.
// See references/demo-format-patterns.md for format structural specs.
export type DemoFormat =
  | "dashboard-app"              // Sidebar + dashboard + feature pages (DEFAULT)
  | "mobile-app-preview"         // Phone frame with screen navigation
  | "landing-page"               // Full-width scrollable sections
  | "multi-screen-walkthrough"   // Browser frame with screen tabs
  | "split-panel-demo"           // Side-by-side panels
  | "admin-console"              // Dense full-width, minimal chrome
  ;

// Device model for frame rendering (only used with mobile-app-preview, multi-screen-walkthrough)
export type DeviceModel =
  | "iphone-15-pro"
  | "pixel-8"
  | "ipad-pro"
  | "generic-phone"
  | "chrome-browser"
  | "safari-browser"
  ;

// The Creative Director researches the client's domain, competitors, and brand
// signals to select the aesthetic and format. No routing table — decisions are
// evidence-backed and documented in the Creative Brief.

export const APP_CONFIG = {
  appName: "App Name",                       // Display name (sidebar header, page title)
  projectName: "Project Name",               // Client's product name (tab bar microtext, footer)
  clientName: null as string | null,         // Client first name, or null — never render "null"
  domain: "tech",                            // Domain (finance, health, marketplace, tech, etc.)
  aesthetic: "linear" as AestheticProfile,   // Drives data-theme="..." on <html>
  demoFormat: "dashboard-app" as DemoFormat,          // Layout architecture for Tab 1
  deviceModel: undefined as DeviceModel | undefined,  // Device frame model (frame formats only)
  screenCount: undefined as number | undefined,       // Number of screens in frame demos
} as const;
