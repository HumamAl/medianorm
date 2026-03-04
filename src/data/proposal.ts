import type { Profile, PortfolioProject } from "@/lib/types";

export const profile: Profile = {
  name: "Humam",
  tagline:
    "React engineer who's built data pipelines, reconciliation systems, and AI-powered parsing tools — and I've already built one for your review in Tab 1.",
  bio: "I read your post about MediaNorm and built this demo to show how I'd approach the reconciliation engine: composite-key matching, configurable tolerance thresholds, and Claude API-powered invoice parsing. Working directly with a founder, no PM layer, iterative shipping — that's exactly how I work.",
  approach: [
    {
      title: "Audit the existing codebase",
      description:
        "Understand the current React + Vite setup, existing parser logic, and Claude API integration before touching anything. Map what's working, what's fragile, and where the matching logic breaks down on edge-case vendor formats.",
    },
    {
      title: "Prototype the reconciliation engine",
      description:
        "Build composite-key matching (station + program + daypart + broadcastWeek + spotLength) with configurable tolerance thresholds. Validate against real buy files you provide — not synthetic test data.",
    },
    {
      title: "Ship incrementally",
      description:
        "Working features every 1-2 weeks. You see real progress, not a big-bang delivery. Each cycle: new parser coverage, a new match rule, or a discrepancy workflow — whatever's highest priority for you.",
    },
    {
      title: "Iterate on edge cases",
      description:
        "Messy vendor formats, missing fields, makegood handling, preempt tracking — the edge cases are where reconciliation actually breaks down. We tune tolerance thresholds and expand parser coverage as real buy data surfaces new patterns.",
    },
  ],
  skillCategories: [
    {
      name: "Core Stack",
      skills: ["React", "TypeScript", "Vite", "Next.js"],
    },
    {
      name: "AI & Parsing",
      skills: [
        "Claude API",
        "AI Integration",
        "Excel Parsing (SheetJS)",
        "PDF Processing",
        "Prompt Engineering",
      ],
    },
    {
      name: "Data & Visualization",
      skills: ["Recharts", "Reconciliation Logic", "Data Pipelines"],
    },
    {
      name: "Deployment",
      skills: ["Vercel", "Tailwind CSS", "shadcn/ui"],
    },
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "payguard",
    title: "PayGuard — Transaction Monitor",
    description:
      "Transaction monitoring dashboard with real-time flagging, linked account tracking, alert management, and prohibited merchant detection. Built matching logic that compares transactions against rule sets with configurable thresholds.",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Recharts"],
    outcome:
      "Compliance monitoring dashboard with transaction flagging, multi-account linking, and alert delivery tracking",
    relevance:
      "Closest direct match — transaction reconciliation, threshold-based flagging, and discrepancy workflows map directly to buy plan vs. invoice matching.",
    liveUrl: "https://payment-monitor.vercel.app",
  },
  {
    id: "wmf-agent",
    title: "WMF Agent Dashboard",
    description:
      "AI-powered customer service agent for Windsor Metal Finishing. Automated email classification, RFQ data extraction with confidence scoring, and human-in-the-loop approval workflow — structured Claude API output piped into an approval queue.",
    tech: ["Next.js", "TypeScript", "Claude API", "n8n", "Microsoft Graph"],
    outcome:
      "Replaced a 4-hour manual quote review process with a 20-minute structured extraction and approval flow",
    relevance:
      "The AI parsing pipeline here — Claude extracting structured fields from unstructured documents with confidence scores — is the same pattern your invoice parser needs.",
    liveUrl: "https://wmf-agent-dashboard.vercel.app",
  },
  {
    id: "data-intelligence",
    title: "Data Intelligence Platform",
    description:
      "Enterprise data analysis platform with multi-source data aggregation, AI-powered insights, and filterable dashboards. Handles heterogeneous input formats — same challenge as reconciling invoices from different station groups.",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui", "Recharts"],
    outcome:
      "Unified analytics dashboard pulling data from multiple sources with interactive charts and filterable insights",
    relevance:
      "Multi-source aggregation with inconsistent formats — the core challenge in parsing invoices from Cox Media vs. Nexstar vs. Gray.",
    liveUrl: "https://data-intelligence-platform-sandy.vercel.app",
  },
  {
    id: "auction-violations",
    title: "Auction Violations Monitor",
    description:
      "Compliance monitoring tool tracking violations, seller behavior, and enforcement actions. Includes automated flagging rules, status workflows for reviewed vs. pending items, and bulk resolution actions.",
    tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
    outcome:
      "Compliance dashboard with violation detection, seller flagging, and enforcement action tracking",
    relevance:
      "The discrepancy review workflow — flag, review, resolve, escalate — mirrors exactly how MediaNorm needs to handle rate variance exceptions.",
    liveUrl: "https://auction-violations.vercel.app",
  },
];
