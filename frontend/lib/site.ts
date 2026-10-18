// Single source of truth for the portfolio's content. The page, the JSON-LD,
// llms.txt / llms-full.txt and the sitemap all read from here.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://mohitgujarati.vercel.app'
).replace(/\/$/, '');
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefix a path in /public with the deploy base path (for plain <a>/<img> tags). */
export const asset = (path: string) => `${BASE_PATH}${path}`;
/**
 * Absolute URL for a path, used in metadata, sitemap, JSON-LD and llms.txt. Page paths get the trailing slash the
 * site serves (`trailingSlash: true`), so search engines never see a redirecting URL; files keep their extension.
 */
export const absolute = (path = '/') => {
  const [pathname, hash] = path.split('#');
  const page = pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(pathname) ? pathname : `${pathname}/`;
  return `${SITE_URL}${page}${hash ? `#${hash}` : ''}`;
};

/** Primary pages, in navigation order. The desktop nav shows Work through Research. */
export const pages = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/experience', 'Experience'],
  ['/about', 'About'],
  ['/research', 'Research'],
  ['/contact', 'Contact'],
] as const;

export const profile = {
  name: 'Mohit Gujarati',
  role: 'Full-Stack Software Engineer',
  company: 'Gabriel AI',
  location: 'Phoenix, AZ',
  email: 'mohitgujarati11@gmail.com',
  github: 'https://github.com/MohitGujarati',
  linkedin: 'https://www.linkedin.com/in/mohitgujarati/',
  resume: '/Mohit_Gujarati_Resume.pdf',
  summary:
    'Full-stack software engineer building mobile and web apps with Kotlin, React Native, React and Next.js. I build data layers, integrate APIs, and develop AI products, from streaming Gemini pipelines to voice calling workflows.',
  short:
    'Full-stack software engineer building mobile, web and AI products with Kotlin, React Native, React and Next.js.',
};

export type Job = {
  hash: string;
  head?: boolean;
  /** Timeline label for past roles; the current role shows a badge instead. */
  stage?: string;
  role: string;
  company: string;
  start: string; // ISO yyyy-mm
  end?: string;
  dates: string;
  points: string[];
  tags: string[];
};

export const experience: Job[] = [
  {
    hash: 'a7c3e19',
    head: true,
    role: 'Full-Stack Engineer',
    company: 'Gabriel AI',
    start: '2026-08',
    dates: 'Aug 2026 - Present',
    points: [
      'Designed, developed, tested, and deployed a production full-stack feature using Django REST, React, TypeScript, and AWS ElastiCache (Redis/Valkey), implementing intelligent caller ID routing across a shared pool of **65 numbers**. Resolved a production retry-queue data integrity bug, developed **125 automated pytest unit tests**, and validated functionality through live-call testing before release.',
      'Implemented environment-specific ElevenLabs text-to-speech configuration with validated production fallbacks, preventing invalid settings from disrupting paid voicemail generation; added automated unit test coverage.',
      'Engineered technical SEO across the site with per-page metadata, Open Graph previews, JSON-LD structured data (FAQ, Breadcrumb, Article), and an auto-generated sitemap. Wrote an automated audit script that maintains **100% structured-data coverage**, built headless-Chrome checks for responsiveness and console errors, and fixed a Next.js static-export prefetch bug to restore instant client-side navigation.',
      'Migrated a production marketing site from Create React App to Next.js, rebuilding **60+ pages** as a static export on AWS Amplify. Built reusable, config-driven page templates so new industry and feature pages ship from a single content file, and added Contentful CMS blogs, GA4 event tracking, and a Cloudflare Turnstile-protected voice-demo flow.',
    ],
    tags: [
      'Django REST',
      'React',
      'TypeScript',
      'Next.js',
      'Redis/Valkey',
      'AWS Amplify',
      'ElevenLabs',
      'pytest',
      'Contentful',
      'GA4',
    ],
  },
  {
    hash: '4f2b8d0',
    stage: 'Product engineering',
    role: 'Software Engineer',
    company: 'TNM Software Solutions',
    start: '2023-05',
    end: '2024-06',
    dates: 'May 2023 - Jun 2024',
    points: [
      'Cut device power consumption by **30% fleet-wide** by building battery-efficient location services in Kotlin, using the Google Geofencing API and motion sensors to reduce GPS polling.',
      'Improved app performance by **50%** and removed UI-thread bottlenecks by refactoring the legacy codebase to MVVM with Kotlin Coroutines for non-blocking I/O.',
      'Shipped production Android and web apps from scratch, working in daily stand-ups and weekly sprints with the backend and QA teams.',
    ],
    tags: ['Kotlin', 'Android', 'Geofencing API', 'MVVM', 'Coroutines'],
  },
  {
    hash: 'e91c5a7',
    stage: 'The foundation',
    role: 'Android Developer Trainee',
    company: 'Tops Technology Inc.',
    start: '2022-05',
    end: '2023-05',
    dates: 'May 2022 - May 2023',
    points: [
      'Built and released user-facing features with Android UI components and Material Design in Kotlin, and published them to the Google Play Store.',
      'Designed normalized Room/SQLite schemas that sped up queries and made offline-first data sync reliable.',
      'Structured MVVM repositories with clear UI, domain and data layers, integrating REST APIs through Retrofit, Coroutines and LiveData.',
    ],
    tags: ['Kotlin', 'Room', 'SQLite', 'Retrofit', 'Material Design'],
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  dates: string;
  /** One-line description on the home page. */
  tagline: string;
  /** Short description in the project index. */
  summary: string;
  /** Full description on the case study and in machine-readable profiles. */
  pitch: string;
  platform: string;
  repository: string;
  points: string[];
  decisions: string[];
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: 'shop-circle',
    name: 'Shop Circle',
    kind: 'Social commerce / Mobile',
    dates: 'Jun - Aug 2026',
    tagline: 'A shared space for discovering products and the people behind them.',
    summary: 'Social discovery and commerce, together in one mobile experience.',
    pitch:
      'A cross-platform social commerce app with one feed for posts and products, multi-image uploads, optimistic likes, ranked discovery, and typo-tolerant search.',
    platform: 'Cross-platform mobile',
    repository: 'https://github.com/MohitGujarati/ShopCircle',
    points: [
      'Relational schema with 6 tables, 10 SQL migrations and 2 engagement-ranked views, secured with **PostgreSQL Row-Level Security** instead of application code.',
      'Google OAuth and username login with deep-link callbacks, plus a CI/CD pipeline from GitHub Actions to a signed APK on Firebase App Distribution.',
    ],
    decisions: [
      'Access rules live beside the relational data, so authorization does not depend on checks in the mobile interface.',
      'Discovery has two distinct jobs: database views rank engagement, while Algolia handles search relevance and typos. Keeping those responsibilities separate lets the feed and search use different ranking logic.',
    ],
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Algolia', 'GitHub Actions'],
  },
  {
    slug: 'recall-ai',
    name: 'Recall AI',
    kind: 'AI assistant / Android',
    dates: 'Feb - May 2026',
    tagline: 'A meeting assistant that listens, remembers, and helps you act.',
    summary: 'Live meetings turned into transcripts, answers, and practical next steps.',
    pitch:
      'A voice-driven meeting assistant that transcribes live audio, answers questions about the meeting, and handles tasks like setting alarms and reminders for to-dos.',
    platform: 'Android',
    repository: 'https://github.com/MohitGujarati/RecallAI--Intelligent-Meeting-Assistant',
    points: [
      'Real-time streaming pipeline built on the **Gemini API**, Kotlin Coroutines and StateFlow, with a fully declarative Jetpack Compose UI.',
      'Offline-first persistence with Room, normalized schemas and SQL-to-Flow queries. CI/CD handles secure API key injection, tests, linting and Firebase test builds.',
    ],
    decisions: [
      'Live session state and saved meeting data have different lifecycles. StateFlow carries changing state from the streaming pipeline; Room exposes persisted data through observable queries.',
      'Offline-first storage keeps saved data available without a connection. AI answers still depend on Gemini, so local persistence and online inference remain separate concerns.',
    ],
    tags: ['Kotlin', 'Jetpack Compose', 'Hilt', 'Room', 'Flow', 'Gemini API'],
  },
  {
    slug: 'lummina',
    name: 'Lummina',
    kind: 'AI learning / Full-stack web',
    dates: 'Mar - May 2026',
    tagline: 'A learning platform built around conversation, practice, and feedback.',
    summary: 'A learning platform that moves from conversation to practice.',
    pitch:
      'An AI learning platform with streaming chat, quiz generation, AI grading, study guides, and real-time voice exams.',
    platform: 'Full-stack web',
    repository: 'https://github.com/MohitGujarati/lummina-core',
    points: [
      'A **ReAct-based agent orchestrator** with multi-step pipelines and structured outputs that automatically regenerates any quiz scoring below 70%.',
      'AI requests go through Express so Gemini and Supabase credentials stay on the server. Responses stream to the client over SSE, and voice exams run on WebSockets with Gemini Live.',
    ],
    decisions: [
      'Text responses need a server-to-client stream; voice exams need an ongoing two-way exchange. SSE and WebSockets serve those different communication patterns.',
      'Quiz evaluation adds a check between generation and delivery. Regenerating low-scoring quizzes adds another model step, while giving the pipeline a defined quality threshold.',
    ],
    tags: ['React 19', 'Vite', 'Express.js', 'Gemini Live', 'WebSocket', 'Supabase'],
  },
];

export type Paper = {
  slug: string;
  kind: 'ieee' | 'review';
  badge: string;
  title: string;
  /** Reader-friendly title for the research list. */
  shortTitle: string;
  /** Extra context shown with the abstract. */
  note?: string;
  venue: string;
  year: string;
  coAuthored?: boolean;
  result?: { value: string; label: string };
  abstract: string;
  tags: string[];
  file: string;
};

export const papers: Paper[] = [
  {
    slug: 'parkinsons-detection',
    kind: 'ieee',
    badge: 'IEEE format',
    title: "Parkinson's Disease Detection Using Handwriting: A Hybrid Multi-CNN and Genetic Algorithm Framework",
    shortTitle: 'Parkinson’s detection from handwriting',
    note: 'An academic model study, not a clinically validated diagnostic tool.',
    venue: 'AI700 Applicable Deep Learning / LIU Brooklyn',
    year: '2026',
    coAuthored: true,
    result: { value: '99.2%', label: 'external validation accuracy' },
    abstract:
      "An end-to-end hybrid framework for automated, non-invasive Parkinson's Disease detection from digitized hand-drawn graphomotor biomarkers. It combines deep feature extraction from multiple CNNs (ResNet50, VGG19, InceptionV3), Genetic Algorithm feature selection, XGBoost classification, and SHAP interpretability.",
    tags: ['Deep Learning', 'Multi-CNN', 'Genetic Algorithm', 'XGBoost', 'SHAP', 'Medical AI'],
    file: '/papers/parkinsons-detection-handwriting.pdf',
  },
  {
    slug: 'bert-news-recommendation',
    kind: 'ieee',
    badge: 'IEEE format',
    title: 'Solving Information Overload: Using BERT to Recommend News Articles Related to User Interest',
    shortTitle: 'Personalized news with Sentence-BERT',
    venue: 'CS666 / LIU Brooklyn',
    year: '2025',
    coAuthored: true,
    result: { value: 'SBERT', label: 'semantic ranking over a rich user profile' },
    abstract:
      'A content-based recommendation system that uses Sentence-BERT embeddings and a rich user profile built from explicit preferences, liked articles and reading history. Cosine similarity over all-MiniLM-L6-v2 vectors drives personalized news ranking, avoiding the limits of keyword matching.',
    tags: ['NLP', 'Sentence-BERT', 'Recommender Systems', 'Information Retrieval'],
    file: '/papers/bert-news-recommendation.pdf',
  },
  {
    slug: 'pytorch-vs-tensorflow',
    kind: 'review',
    badge: 'survey',
    title: 'A Comparative Survey of PyTorch vs. TensorFlow for Deep Learning: Usability, Performance, and Deployment',
    shortTitle: 'PyTorch & TensorFlow: a comparison',
    venue: 'AI700 Applicable Deep Learning / LIU Brooklyn',
    year: '2026',
    abstract:
      'Compares the two dominant deep learning frameworks across developer experience, training and inference efficiency, deployment, and ecosystem. Both deliver strong results, but PyTorch leans toward simplicity and research while TensorFlow leans toward a complete production ecosystem, so the right choice depends on which trade-offs matter most.',
    tags: ['PyTorch', 'TensorFlow', 'Deep Learning'],
    file: '/papers/pytorch-vs-tensorflow-survey.pdf',
  },
  {
    slug: 'tensorflow-review',
    kind: 'review',
    badge: 'paper review',
    title: 'TensorFlow: A System for Large-Scale Machine Learning',
    shortTitle: 'Inside TensorFlow’s architecture',
    venue: 'AI700 Applicable Deep Learning / LIU Brooklyn',
    year: '2026',
    abstract:
      'A structured review of the TensorFlow paper: its single dataflow-graph model for computation and mutable state, extensibility through user-level libraries, distributed training, and benchmark performance on image classification and language modeling across CPUs, GPUs and TPUs.',
    tags: ['TensorFlow', 'Dataflow Graphs', 'Distributed Systems'],
    file: '/papers/tensorflow-system-review.pdf',
  },
  {
    slug: 'microservices',
    kind: 'review',
    badge: 'term paper',
    title:
      'Microservices and Distributed Systems: Architectures for Scalable, Fault-Tolerant, and Efficient Modern Applications',
    shortTitle: 'Microservices & distributed systems',
    venue: 'System Design and Analysis / LIU Brooklyn',
    year: '2024',
    abstract:
      'A qualitative analysis of microservices and distributed systems through case studies of Netflix, Uber and ChatGPT, showing how system analysis and design principles (modularity, scalability and fault tolerance) address the limits of monolithic architectures at production scale.',
    tags: ['Microservices', 'Distributed Systems', 'System Design'],
    file: '/papers/microservices-distributed-systems.pdf',
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'languages', items: ['Kotlin', 'TypeScript', 'JavaScript', 'Java', 'Python', 'SQL'] },
  {
    group: 'mobile',
    items: [
      'Jetpack Compose',
      'Android SDK',
      'React Native',
      'Expo',
      'Coroutines',
      'Flow / StateFlow',
      'LiveData',
      'Hilt',
      'Retrofit',
    ],
  },
  {
    group: 'web',
    items: ['React 19', 'Next.js (App Router)', 'MUI', 'Framer Motion', 'Express.js', 'REST APIs', 'WebSocket', 'SSE'],
  },
  {
    group: 'data-cloud',
    items: ['PostgreSQL', 'Supabase', 'SQLite', 'Room', 'Firebase', 'Google Cloud', 'AWS Amplify'],
  },
  { group: 'ai', items: ['Gemini API', 'Gemini Live', 'ReAct agents', 'Structured outputs', 'Voice AI workflows'] },
  {
    group: 'practices',
    items: [
      'MVVM',
      'Clean Architecture',
      'Offline-first',
      'Dependency Injection',
      'GitHub Actions CI/CD',
      'Agile / Scrum',
    ],
  },
];

/** Plain-language skill summaries shown on the home and About pages. */
export const capabilities = [
  {
    title: 'Mobile products',
    body: 'Kotlin, Jetpack Compose, React Native and Expo. Offline data, responsive interfaces and background services.',
  },
  {
    title: 'Web & infrastructure',
    body: 'React, Next.js and TypeScript, backed by Express, PostgreSQL and Supabase. Deployment through AWS and GitHub Actions.',
  },
  {
    title: 'Applied AI',
    body: 'Gemini integrations for streaming chat, voice conversations and multi-step agent workflows.',
  },
];

export const education = [
  {
    degree: 'M.S. in Computer Science',
    school: 'Long Island University',
    place: 'Brooklyn, NY',
    dates: 'Sep 2024 - May 2026',
    note: 'GPA 3.9 / 4.0',
    description:
      'Conducted extensive literature review on AI, ML, DL, and software development research papers, applying findings to a comprehensive project. Presented the project for professorial review and synthesized the outcomes into a detailed IEEE-formatted research report.',
    subjects: ['System Design', 'DSA', 'Full Stack Web Development'],
  },
  {
    degree: 'B.Tech in Computer Engineering',
    school: 'Shankersinh Vaghela Institute of Technology',
    place: 'Gujarat, India',
    dates: 'Aug 2016 - Sep 2020',
    subjects: ['Engineering Maths', 'OS', 'Java', 'DSA', 'Computer Networks'],
  },
];

export const awards = [
  'Excellence Award in Graduate Computer Science, LIU Brooklyn',
  'Kotlin Professional Certificate, JetBrains',
  'Member of Google Developer Group @ Long Island University',
];

/** Strip the **bold** markers used in content strings. */
export const plain = (s: string) => s.replace(/\*\*/g, '');
