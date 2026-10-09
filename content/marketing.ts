import type {
  ComparisonRow,
  FaqEntry,
  Feature,
  HeroContent,
  PricingPlan,
  Stat,
  Testimonial,
} from "./types";

/**
 * Copy is written to match the WordPress content on the live install, which is
 * finance and fintech focused — so the marketing surface and the blog read as
 * one product rather than two unrelated sites.
 */

export const hero: HeroContent = {
  badge: "Now with real-time scenario modelling",
  headline: ["Financial clarity,", "engineered for", "the close."],
  subhead:
    "Ledgerline unifies accounts, forecasts and board reporting into one live model. Stop reconciling spreadsheets at midnight and start closing the month before lunch.",
  primaryCta: { label: "Start free", href: "/pricing" },
  secondaryCta: { label: "Read the blog", href: "/blog" },
  proofPoints: [
    "SOC 2 Type II",
    "No card required",
    "Set up in a morning",
  ],
};

export const logos = [
  "NORTHWIND",
  "ARCFIELD",
  "MERIDIAN",
  "HALCYON",
  "BRIGHTVALE",
  "SUTTON & CO",
  "KESTREL",
];

export const features: Feature[] = [
  {
    id: "ledger",
    eyebrow: "Unified ledger",
    title: "Every account, reconciled continuously",
    description:
      "Connect banks, cards, payroll and your accounting system once. Ledgerline normalises the chart of accounts and keeps the ledger current — so the number you quote in a meeting is the number that was true a minute ago.",
    bullets: [
      "260+ institution connections with automatic retry",
      "Rule-based categorisation you can actually read",
      "Immutable audit trail on every adjustment",
    ],
  },
  {
    id: "forecast",
    eyebrow: "Scenario modelling",
    title: "Forecasts that survive contact with reality",
    description:
      "Build a driver-based model, then branch it. Compare hiring plans, pricing changes and funding scenarios side by side, with variance against actuals updating as the month progresses.",
    bullets: [
      "Unlimited branches off any baseline",
      "Driver-level sensitivity in one click",
      "Variance alerts before the quarter slips",
    ],
  },
  {
    id: "reporting",
    eyebrow: "Board reporting",
    title: "The pack writes itself",
    description:
      "Define each schedule once and Ledgerline assembles the pack on your cadence — formatted, footnoted and tied to source. Export to PDF, or share a live link that stays current.",
    bullets: [
      "Board-ready templates, fully editable",
      "Figures traceable back to the transaction",
      "Scheduled delivery to investors and lenders",
    ],
  },
];

export const stats: Stat[] = [
  { value: 9.4, suffix: " days", label: "Average close time, down from 23", precision: 1 },
  { value: 260, suffix: "+", label: "Bank and ledger integrations" },
  { value: 99.98, suffix: "%", label: "Reconciliation accuracy", precision: 2 },
  { value: 4, prefix: "$", suffix: "B+", label: "Cash under management" },
];

export const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For founders running finance themselves.",
    monthly: 0,
    annual: 0,
    features: [
      "2 connected accounts",
      "Rolling 12-month forecast",
      "Monthly close checklist",
      "Community support",
    ],
    cta: { label: "Start free", href: "/contact" },
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For teams who close monthly and report to a board.",
    monthly: 89,
    annual: 71,
    features: [
      "Unlimited connected accounts",
      "Scenario branching and variance alerts",
      "Automated board pack",
      "Role-based permissions",
      "Priority support with a named contact",
    ],
    cta: { label: "Start 14-day trial", href: "/contact" },
    featured: true,
  },
  {
    id: "scale",
    name: "Scale",
    tagline: "For finance functions with audit and consolidation needs.",
    monthly: null,
    annual: null,
    customLabel: "Custom",
    features: [
      "Multi-entity consolidation",
      "Audit-ready evidence export",
      "SSO, SCIM and custom retention",
      "Dedicated implementation team",
      "99.9% uptime SLA",
    ],
    cta: { label: "Talk to sales", href: "/contact" },
  },
];

export const comparison: ComparisonRow[] = [
  { label: "Connected accounts", values: { starter: "2", growth: "Unlimited", scale: "Unlimited" } },
  { label: "Forecast horizon", values: { starter: "12 months", growth: "60 months", scale: "Custom" } },
  { label: "Scenario branches", values: { starter: "1", growth: "Unlimited", scale: "Unlimited" } },
  { label: "Board pack automation", values: { starter: false, growth: true, scale: true } },
  { label: "Multi-entity consolidation", values: { starter: false, growth: false, scale: true } },
  { label: "SSO and SCIM", values: { starter: false, growth: false, scale: true } },
  { label: "Audit evidence export", values: { starter: false, growth: true, scale: true } },
  { label: "Support", values: { starter: "Community", growth: "Priority", scale: "Dedicated team" } },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "We cut the close from three weeks to nine days in one quarter. The part I did not expect was how much argument it removed — everyone is finally reading the same number.",
    name: "Priya Raman",
    role: "VP Finance",
    company: "Northwind Logistics",
    initials: "PR",
  },
  {
    quote:
      "Our board pack used to eat a full week of my analyst's time. It now assembles itself on the 3rd and she spends that week on the hiring model instead.",
    name: "Daniel Okafor",
    role: "CFO",
    company: "Arcfield Health",
    initials: "DO",
  },
  {
    quote:
      "The audit trail sold it internally. Every figure in the pack walks back to a transaction, which made our first Type II dramatically less painful.",
    name: "Hannah Lindqvist",
    role: "Head of Controlling",
    company: "Meridian Group",
    initials: "HL",
  },
  {
    quote:
      "Scenario branching changed how we talk about runway. We model the hiring plan and the pricing change together instead of arguing about two spreadsheets.",
    name: "Marcus Bell",
    role: "Co-founder",
    company: "Halcyon Labs",
    initials: "MB",
  },
];

export const faqs: FaqEntry[] = [
  {
    question: "How long does implementation actually take?",
    answer:
      "Starter and Growth are self-serve — connect your accounts and the ledger backfills 24 months of history, usually within an hour. Scale deployments involving multi-entity consolidation typically run two to four weeks with our implementation team.",
  },
  {
    question: "Does Ledgerline replace our accounting system?",
    answer:
      "No, and it is not trying to. Your general ledger stays the system of record. Ledgerline sits on top of it, reconciling continuously and handling the forecasting and reporting layer that accounting systems do badly.",
  },
  {
    question: "What happens to our data if we leave?",
    answer:
      "You can export the full ledger, every model version and all historical packs as CSV and PDF at any time, without asking us. We delete your data within 30 days of cancellation, or immediately on request.",
  },
  {
    question: "Can we switch between monthly and annual billing?",
    answer:
      "Yes, at any point. Moving to annual credits the unused portion of your current month. Moving back to monthly takes effect at the end of the paid term.",
  },
  {
    question: "Is there a limit on users?",
    answer:
      "Growth and Scale include unlimited viewers; you are billed per editor. Starter is capped at two users, which is usually a founder and an accountant.",
  },
];
