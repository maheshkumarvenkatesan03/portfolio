/**
 * Single source of truth for all portfolio content.
 * Every fact here traces back to the resume — edit here, not in components.
 */

export const identity = {
  name: 'Mahesh Kumar V', // formal name (resume, title, schema) — V is the family initial
  displayName: 'Mahesh Kumar',
  role: 'Software Engineer · 2D Rendering & Graphics',
  company: 'Zoho Corporation',
  product: 'Vani',
  title: 'Member Technical Staff',
  location: 'Tamil Nadu, India',
  email: 'maheshkumarvenkatesan03@gmail.com',
  phone: '+91 9789260864',
  resumeFile: '/MaheshKumarV-Resume.pdf',
  tagline:
    'I build the machinery behind an infinite canvas — layout engines, rendering pipelines and a framework that ships from one C++ core to Web, iOS, macOS and Android.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Mahi-Eshu', icon: 'github' },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mahesh-kumar-venkatesan-b27533200/',
      icon: 'linkedin',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/maheshkumarvenkatesan_',
      icon: 'instagram',
    },
  ],
} as const

export const heroStats = [
  { value: '2+', label: 'years of framework engineering' },
  { value: '300+', label: 'bugs hunted & fixed' },
  { value: '4', label: 'platforms, one C++ core' },
  { value: '5×', label: 'recognized by leadership' },
] as const

export const about = {
  lede: `I'm a framework engineer on ${'Zoho Vani'} — a collaborative whiteboard and business-demo platform used by enterprises. My team owns the invisible layer: the layout engine, the data model, the rendering and the cross-platform core everything else stands on.`,
  paragraphs: [
    'The part I love: one shared C++ codebase renders the same canvas everywhere — compiled to WebAssembly for the browser, running native on iOS, macOS and Android, drawing through Skia. When a feature ships, it ships to four platforms at once; when a pixel is wrong, it is wrong everywhere, and I go find out why.',
    'I built Vani’s Auto-Layout engine from its foundation, helped rewrite the product for scale, and have closed 300+ bugs along the way — rendering artifacts, memory leaks, regressions and the kind of customer-critical defects that get fixed the same day they are reported.',
    'Outside the editor I lift heavy things (college powerlifting champion), play volleyball, sketch with a pencil, and have recently started training toward a marathon.',
  ],
  pipeline: {
    core: 'Shared C++ core',
    stages: [
      { label: 'Skia', detail: '2D rendering' },
      { label: 'Protobuf', detail: 'data model' },
      { label: 'Auto-Layout', detail: 'layout engine' },
    ],
    targets: [
      { label: 'Web', detail: 'WebAssembly' },
      { label: 'iOS', detail: 'native' },
      { label: 'macOS', detail: 'native' },
      { label: 'Android', detail: 'native' },
    ],
  },
} as const

export const experience = [
  {
    company: 'Zoho Corporation',
    role: 'Member Technical Staff',
    team: 'Framework team · Vani',
    period: 'Sep 2024 — Present',
    current: true,
    summary:
      'Vani is a collaborative whiteboard and business-demo platform used by enterprises for meetings, knowledge sharing, planning and design workflows. I work on the framework underneath it.',
    highlights: [
      {
        title: 'Built the Auto-Layout engine from its foundation',
        detail:
          'The layout system that Stacks, Mind Maps and Kanban Boards were later built and shipped on. Mind Maps and Kanban became customer-driven features with strong enterprise adoption — and prominent showcases in product demos and expos.',
      },
      {
        title: 'Rewrote for scale',
        detail:
          'Contributed to the product’s large-scale rewrite focused on scalability, cleaner architecture and long-term maintainability — migrating and rebuilding features from the older product model into the new system.',
      },
      {
        title: 'Cross-platform, framework-level debugging',
        detail:
          'Worked across Web, iOS, macOS and Android through a shared C++ codebase, collaborating with platform teams in Xcode and Android Studio to root-cause framework-level issues and deliver fixes.',
      },
      {
        title: '300+ bugs resolved',
        detail:
          'Regressions, rendering problems, memory leaks and critical customer-reported defects — including a production escalation outside my own module, shipped the same day.',
      },
      {
        title: 'Tooling for the people around me',
        detail:
          'Built and maintained internal APIs for QA automation workflows, supported design teams building templates on Auto-Layout, and folded AI into daily development — from repetitive tasks to complete end-to-end features spanning multiple repositories.',
      },
    ],
  },
] as const

export const education = {
  degree: 'B.Tech, Information Technology',
  school: 'R.M.D. Engineering College',
  place: 'Gummidipoondi, Tamil Nadu',
  period: '2020 — 2024',
  gpa: '9.3 CGPA',
} as const

export type SkillGroup = {
  stage: string
  name: string
  blurb: string
  skills: { name: string; note: string }[]
}

export const arsenal: SkillGroup[] = [
  {
    stage: 'LANGUAGES',
    name: 'Core languages',
    blurb: 'The ones I think in.',
    skills: [
      { name: 'C++', note: 'the shared framework core — my daily language' },
      { name: 'C', note: 'where the pointers live' },
      { name: 'Java', note: 'Android-side platform work' },
      { name: 'JavaScript', note: 'web platform & personal projects' },
    ],
  },
  {
    stage: 'GRAPHICS',
    name: 'Rendering & systems',
    blurb: 'The domain I build in.',
    skills: [
      { name: 'Skia', note: '2D rendering engine behind the canvas' },
      { name: 'WebAssembly', note: 'C++ core compiled for the browser (Emscripten)' },
      { name: 'Protocol Buffers', note: 'designed Auto-Layout’s foundational data model' },
      { name: 'UI & layout systems', note: 'constraint resolution, invalidation, reflow' },
    ],
  },
  {
    stage: 'PRACTICE',
    name: 'What I actually do',
    blurb: 'Day-to-day engineering muscle.',
    skills: [
      { name: 'Framework development', note: 'APIs other teams build features on' },
      { name: 'Performance', note: 'frame budgets, memory graphs, fewer re-layouts' },
      { name: 'Debugging', note: '300+ closed — rendering artifacts to memory leaks' },
      { name: 'Cross-platform delivery', note: 'one change, four platforms, zero drift' },
      { name: 'Test automation', note: 'built the internal portal QA runs on' },
    ],
  },
  {
    stage: 'TOOLING',
    name: 'Tools & environment',
    blurb: 'The bench I work at.',
    skills: [
      { name: 'Xcode & Android Studio', note: 'platform-level debugging' },
      { name: 'Git', note: 'multi-repo feature work' },
      { name: 'Claude Code & Copilot', note: 'AI folded into the daily workflow' },
      { name: 'Next.js', note: 'personal projects on the web side' },
    ],
  },
]

export type CaseStudy = {
  id: string
  kicker: string
  title: string
  problem: string
  built: string
  impact: string
  tech: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'auto-layout',
    kicker: 'Layout engine',
    title: 'Auto-Layout — the engine under the canvas',
    problem:
      'An infinite whiteboard where every element is freely placed is powerful but unstructured. Vani needed elements that arrange, resize and reflow themselves — a real layout system, built into the framework, fast enough to run constantly.',
    built:
      'Built the Auto-Layout feature from its foundation, including the scalable Protocol Buffers structure underneath it — designed so the data model could carry capabilities nobody had scheduled yet. Supported internal design teams building the first templates on top of it.',
    impact:
      'Stacks, Mind Maps and Kanban Boards were all built and shipped on this foundation. Mind Maps and Kanban became customer-driven, enterprise-adopted features and demo-floor highlights. The protobuf design was recognized by the Product Head for enabling multiple major product capabilities; Phase 1 shipped on its committed timeline despite a heavy QA cycle.',
    tech: ['C++', 'Protocol Buffers', 'Layout systems', 'Skia'],
  },
  {
    id: 'cross-platform',
    kicker: 'Platform architecture',
    title: 'One C++ core, four platforms',
    problem:
      'Shipping the same canvas to Web, iOS, macOS and Android without four teams re-implementing every feature — and without the platforms slowly drifting apart.',
    built:
      'Worked in the shared C++ framework that all four platforms run on — WebAssembly in the browser, native elsewhere, rendering through Skia. Contributed to the product’s large-scale rewrite for scalability and cleaner architecture, migrating features from the old product model into the new system.',
    impact:
      'Feature consistency across every platform from a single change. Framework-level issues get root-caused once — in Xcode, Android Studio or the browser — instead of four times.',
    tech: ['C++', 'WebAssembly', 'Skia', 'Xcode', 'Android Studio'],
  },
  {
    id: 'automation-portal',
    kicker: 'Internal tooling',
    title: 'The Automation Portal',
    problem:
      'Developers depended on QA engineers to execute automation runs — a human bottleneck in the middle of every verification loop.',
    built:
      'Built an internal portal that lets developers trigger and manage automation execution directly, and provided the internal APIs that QA’s automation workflows were set up on.',
    impact:
      'Cut the dependency on QA for routine automation, tightening the loop between writing a fix and proving it. Recognized by the manager, team lead and QA lead.',
    tech: ['JavaScript', 'Internal APIs', 'Test automation'],
  },
  {
    id: 'bug-ledger',
    kicker: 'Debugging',
    title: 'The bug ledger — 300+ entries',
    problem:
      'A rendering framework fails in interesting ways: pixels in the wrong place, memory that never comes back, regressions that only appear on one platform, and escalations where a customer is watching the clock.',
    built:
      'Closed 300+ bugs across the framework — regression issues, rendering problems, memory leaks and critical customer-reported defects. When a production escalation landed outside my module while its owner was unavailable, I stepped in, root-caused it with the team and helped ship the fix the same day.',
    impact:
      'Recognized by the Product Head for the escalation response, and by my manager for prioritizing and clearing a high volume of QA-reported issues during Auto-Layout’s Phase 1 release — inside the committed timeline.',
    tech: ['C++', 'Memory profiling', 'Cross-platform debugging'],
  },
]

export const sideQuests = [
  {
    title: 'Crowdfunding platform',
    detail: 'Raise funds for personal needs and community causes.',
    tech: ['Next.js', 'MongoDB'],
  },
  {
    title: 'E-commerce for local shops',
    detail: 'Storefronts with secure checkout for a sweet shop and an electronics store.',
    tech: ['Next.js', 'Payments'],
  },
  {
    title: 'Blood donation system',
    detail: 'Donor registration, discovery and donation coordination.',
    tech: ['Web', 'MongoDB'],
  },
  {
    title: 'Anonymous discussion rooms',
    detail: 'Real-time, room-based chat without identity disclosure.',
    tech: ['WebSockets', 'Real-time'],
  },
] as const

export const recognitions = [
  {
    from: 'Product Head',
    what: 'Scalable protobuf foundation for Auto-Layout',
    detail: 'A data model designed early enough — and well enough — to carry multiple major product capabilities that came later.',
  },
  {
    from: 'Product Head',
    what: 'Critical customer escalation, fixed same-day',
    detail: 'Stepped into a production issue outside my module while its owner was unavailable and helped ship the fix within the day.',
  },
  {
    from: 'Manager',
    what: 'Planning & execution under pressure',
    detail: 'Prioritized and resolved a high volume of QA-reported issues in Auto-Layout’s Phase 1 release — on the committed timeline.',
  },
  {
    from: 'Manager · Team Lead · QA Lead',
    what: 'The Automation Portal',
    detail: 'Internal tooling that reduced developer dependency on QA for automation execution.',
  },
  {
    from: 'Marketing Lead',
    what: 'Customer-requested Auto-Layout features',
    detail: 'Features that became adoption drivers and headline moments in product demonstrations.',
  },
] as const

export const otherAchievements = [
  { what: 'Winner — Interdepartmental Mini Project Competition', detail: 'Fully functional e-commerce web app built with Next.js (2023)' },
  { what: 'Runner-up — International Paper Presentation, VIT', detail: 'Representing R.M.D. Engineering College (2023)' },
  { what: 'Overall Individual Champion — Powerlifting', detail: 'R.M.D. Engineering College (2023)' },
  { what: 'Bronze — Anna University Best Physique', detail: 'Representing R.M.D. Engineering College (2023)' },
] as const

export const interests = [
  'Powerlifting & strength training',
  'Volleyball',
  'Pencil sketching',
  'Bike rides',
  'Marathon training',
] as const
