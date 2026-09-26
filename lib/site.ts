// Single source of truth for the portfolio's content. The page, the JSON-LD,
// llms.txt / llms-full.txt, the sitemap and the terminal all read from here.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://mohitgujarati.github.io'
).replace(/\/$/, '');
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Prefix a path in /public with the deploy base path (for plain <a>/<img> tags). */
export const asset = (path: string) => `${BASE_PATH}${path}`;
/** Absolute URL for a path, used in metadata, sitemap and llms.txt. */
export const absolute = (path = '/') => `${SITE_URL}${path}`;

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
    'Full-stack software engineer with 3+ years of professional experience building mobile and web apps with Kotlin, React Native, React and Next.js. I build data layers (Room, AWS, Supabase, Firebase), integrate REST APIs, and develop AI products, from streaming Gemini pipelines to voice calling workflows.',
  short: 'Full-stack software engineer building mobile, web and AI products with Kotlin, React Native, React and Next.js.',
};

export type Job = {
  hash: string;
  ref: string;
  head?: boolean;
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
    ref: 'HEAD → main',
    head: true,
    role: 'Full-Stack Engineer',
    company: 'Gabriel AI',
    start: '2026-08',
    dates: 'Aug 2026 – Present',
    points: [
      'Led the migration of the customer-facing marketing site from a client-rendered React app to a **Next.js static export** (19 routes plus a CMS-driven blog). Lighthouse SEO went from unmeasurable to **100 on every page**, image payload dropped by **86%**, and all content became crawlable by search engines and AI bots for the first time.',
      'Deployed on AWS Amplify with build config and env management, plus a one-command audit script (crawlability, structured data, sitemap, Lighthouse) that has to pass before each release.',
      'Build and ship features across the platform: the dashboard and web app front end, back-end APIs and database logic, and AI voice calling workflows, with integrations for HubSpot, lead sources, Contentful, GA4 and Cloudflare Turnstile.',
      'Own code quality end to end: tested code, debugging across the stack, and code reviews and planning with product, design and marketing.',
    ],
    tags: ['Next.js', 'React', 'AWS Amplify', 'HubSpot', 'Contentful', 'GA4'],
  },
  {
    hash: '4f2b8d0',
    ref: 'tag: tnm-software',
    role: 'Software Engineer',
    company: 'TNM Software Solutions',
    start: '2023-05',
    end: '2024-06',
    dates: 'May 2023 – Jun 2024',
    points: [
      'Cut device power consumption by **30% fleet-wide** by building battery-efficient location services in Kotlin, using the Google Geofencing API and motion sensors to reduce GPS polling.',
      'Improved app performance by **50%** and removed UI-thread bottlenecks by refactoring the legacy codebase to MVVM with Kotlin Coroutines for non-blocking I/O.',
      'Shipped production Android and web apps from scratch, working in daily stand-ups and weekly sprints with the backend and QA teams.',
    ],
    tags: ['Kotlin', 'Android', 'Geofencing API', 'MVVM', 'Coroutines'],
  },
  {
    hash: 'e91c5a7',
    ref: 'tag: v1.0-first-job',
    role: 'Android Developer Trainee',
    company: 'Tops Technology Inc.',
    start: '2022-05',
    end: '2023-05',
    dates: 'May 2022 – May 2023',
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
  pitch: string;
  points: string[];
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: 'shop-circle',
    name: 'Shop Circle',
    kind: 'Social commerce · Mobile',
    dates: 'Jun – Aug 2026',
    pitch:
      'A cross-platform social commerce app with one feed for posts and products, multi-image uploads, optimistic likes, ranked discovery, and typo-tolerant search.',
    points: [
      'Relational schema with 6 tables, 10 SQL migrations and 2 engagement-ranked views, secured with **PostgreSQL Row-Level Security** instead of application code.',
      'Google OAuth and username login with deep-link callbacks, plus a CI/CD pipeline from GitHub Actions to a signed APK on Firebase App Distribution.',
    ],
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Algolia', 'GitHub Actions'],
  },
  {
    slug: 'recall-ai',
    name: 'Recall AI',
    kind: 'AI assistant · Android',
    dates: 'Feb – May 2026',
    pitch:
      'A voice-driven meeting assistant that transcribes live audio, answers questions about the meeting, and handles tasks like setting alarms and reminders for to-dos.',
    points: [
      'Real-time streaming pipeline built on the **Gemini API**, Kotlin Coroutines and StateFlow, with a fully declarative Jetpack Compose UI.',
      'Offline-first persistence with Room, normalized schemas and SQL-to-Flow queries. CI/CD handles secure API key injection, tests, linting and Firebase test builds.',
    ],
    tags: ['Kotlin', 'Jetpack Compose', 'Hilt', 'Room', 'Flow', 'Gemini API'],
  },
  {
    slug: 'lummina',
    name: 'Lummina',
    kind: 'AI learning · Full-stack web',
    dates: 'Mar – May 2026',
    pitch: 'An AI learning platform with streaming chat, quiz generation, AI grading, study guides, and real-time voice exams.',
    points: [
      'A **ReAct-based agent orchestrator** with multi-step pipelines and structured outputs that automatically regenerates any quiz scoring below 70%.',
      'AI requests go through Express so Gemini and Supabase credentials stay on the server. Responses stream to the client over SSE, and voice exams run on WebSockets with Gemini Live.',
    ],
    tags: ['React 19', 'Vite', 'Express.js', 'Gemini Live', 'WebSocket', 'Supabase'],
  },
];

export type Paper = {
  slug: string;
  kind: 'ieee' | 'review';
  badge: string;
  title: string;
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
    venue: 'AI700 Applicable Deep Learning · LIU Brooklyn',
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
    venue: 'CS666 · LIU Brooklyn',
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
    venue: 'AI700 Applicable Deep Learning · LIU Brooklyn',
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
    venue: 'AI700 Applicable Deep Learning · LIU Brooklyn',
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
    title: 'Microservices and Distributed Systems: Architectures for Scalable, Fault-Tolerant, and Efficient Modern Applications',
    venue: 'System Design and Analysis · LIU Brooklyn',
    year: '2024',
    abstract:
      'A qualitative analysis of microservices and distributed systems through case studies of Netflix, Uber and ChatGPT, showing how system analysis and design principles (modularity, scalability and fault tolerance) address the limits of monolithic architectures at production scale.',
    tags: ['Microservices', 'Distributed Systems', 'System Design'],
    file: '/papers/microservices-distributed-systems.pdf',
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'languages', items: ['Kotlin', 'TypeScript', 'JavaScript', 'Java', 'Python', 'SQL'] },
  { group: 'mobile', items: ['Jetpack Compose', 'Android SDK', 'React Native', 'Expo', 'Coroutines', 'Flow / StateFlow', 'LiveData', 'Hilt', 'Retrofit'] },
  { group: 'web', items: ['React 19', 'Next.js (App Router)', 'MUI', 'Framer Motion', 'Express.js', 'REST APIs', 'WebSocket', 'SSE'] },
  { group: 'data-cloud', items: ['PostgreSQL', 'Supabase', 'SQLite', 'Room', 'Firebase', 'Google Cloud', 'AWS Amplify'] },
  { group: 'ai', items: ['Gemini API', 'Gemini Live', 'ReAct agents', 'Structured outputs', 'Voice AI workflows'] },
  { group: 'practices', items: ['MVVM', 'Clean Architecture', 'Offline-first', 'Dependency Injection', 'GitHub Actions CI/CD', 'Agile / Scrum'] },
];

export const education = [
  {
    degree: 'M.S. in Computer Science',
    school: 'Long Island University',
    place: 'Brooklyn, NY',
    dates: 'Sep 2024 – May 2026',
    note: 'GPA 3.9 / 4.0',
  },
  {
    degree: 'B.Tech in Computer Engineering',
    school: 'Shankersinh Vaghela Institute of Technology',
    place: 'Gujarat, India',
    dates: 'Aug 2016 – Sep 2020',
  },
];

export const awards = [
  'Excellence Award in Graduate Computer Science, LIU Brooklyn',
  'Kotlin Professional Certificate, JetBrains',
];

/** Strip the **bold** markers used in content strings. */
export const plain = (s: string) => s.replace(/\*\*/g, '');
