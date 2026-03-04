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
  appName: "MediaNorm",                      // Display name (sidebar header, page title)
  projectName: "MediaNorm",                  // Client's product name (tab bar microtext, footer)
  clientName: null as string | null,         // No specific client — never render "null"
  domain: "media-buying",                    // Ad tech / media buying / reconciliation
  aesthetic: "data-dense" as AestheticProfile,        // Compact, monospace metrics, max info per pixel
  demoFormat: "dashboard-app" as DemoFormat,          // Sidebar dashboard layout
  deviceModel: undefined as DeviceModel | undefined,  // Not used for dashboard-app format
  screenCount: undefined as number | undefined,       // Not used for dashboard-app format
} as const;
