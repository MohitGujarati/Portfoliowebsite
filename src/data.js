export const profile = {
  name: 'Mohit Gujarati',
  role: 'Android Developer',
  tagline: 'I build production-grade Android apps with Kotlin, Jetpack Compose, and a growing obsession with on-device AI.',
  location: 'Jersey City, NJ',
  email: 'mohitgujarati11@gmail.com',
  phone: '+1 201-423-0193',
  github: 'https://github.com/MohitGujarati',
  linkedin: 'https://linkedin.com/in/mohitgujarati',
  resume: `${import.meta.env.BASE_URL}Mohit_Gujarati_Resume.pdf`,
  summary:
    'Computer Engineer with 2 years of professional experience delivering production-grade mobile applications in Kotlin. I work across the full Android stack — MVVM and Clean Architecture, Jetpack Compose, Room, Firebase, and RESTful integrations — and lately I spend most of my time wiring AI into mobile experiences with the Gemini API and Hugging Face Transformers. I also ship cross-platform features with React Native when the project calls for it.',
  availability: 'Open to summer internships & full-time roles starting May 2026',
}

export const stats = [
  { value: '2+', label: 'Years shipping Android apps' },
  { value: '30%', label: 'Battery drain cut via geofencing' },
  { value: '50%', label: 'Perf boost from MVVM refactor' },
  { value: '3.8', label: 'GPA — M.S. Computer Science' },
]

export const education = [
  {
    school: 'Long Island University, Brooklyn',
    degree: 'M.S. in Computer Science',
    period: 'Sep 2024 – May 2026',
    detail: 'GPA 3.8 / 4.0',
  },
  {
    school: 'Shankersinh Vaghela Institute of Technology, Gujarat',
    degree: 'B.Tech in Engineering',
    period: 'Aug 2016 – Sep 2020',
    detail: 'GPA 3.1 / 4.0',
  },
]

export const skillGroups = [
  {
    title: 'Android Core',
    icon: 'android',
    skills: [
      'Kotlin', 'Jetpack Compose', 'MVVM', 'Coroutines', 'Flow / StateFlow',
      'Hilt', 'Room', 'Retrofit', 'LiveData', 'Material Design',
      'Google Maps SDK', 'Geofencing API', 'Motion Sensors', 'Play Store submission',
    ],
  },
  {
    title: 'Languages',
    icon: 'code',
    skills: ['Kotlin', 'Java', 'Python', 'TypeScript', 'JavaScript'],
  },
  {
    title: 'AI & Backend',
    icon: 'spark',
    skills: [
      'Gemini API', 'Hugging Face Transformers', 'RAG pipelines',
      'Firebase (Auth / Firestore / Crashlytics)', 'Supabase', 'PostgreSQL', 'REST APIs',
    ],
  },
  {
    title: 'Cross-Platform & Practices',
    icon: 'layers',
    skills: [
      'React Native', 'React', 'Clean Architecture', 'SOLID',
      'Dependency Injection', 'Offline-First', 'Agile / Scrum', 'Git / GitHub',
    ],
  },
]

export const experience = [
  {
    company: 'TNM Software Solutions',
    role: 'Software Engineer',
    period: 'May 2023 – Jun 2024',
    points: [
      'Engineered battery-efficient location services in Kotlin using the Google Geofencing API and motion sensors, cutting device power consumption by 30% across the production fleet.',
      'Boosted app performance by 50% by refactoring legacy code into MVVM and moving I/O onto Kotlin Coroutines, eliminating UI-thread jank.',
      'Shipped production Android apps from scratch, collaborating with backend and QA teams in daily stand-ups and weekly Agile sprints.',
    ],
    tags: ['Kotlin', 'Geofencing', 'MVVM', 'Coroutines'],
  },
  {
    company: 'Tops Technology Inc.',
    role: 'Android Developer Trainee',
    period: 'May 2022 – May 2023',
    points: [
      'Built and deployed native Android apps in Kotlin with XML layouts, ViewBinding, and Material Design.',
      'Designed normalized Room / SQLite schemas enabling reliable offline-first data sync.',
      'Integrated RESTful APIs via Retrofit with Coroutines and LiveData under a clean MVVM repository structure.',
    ],
    tags: ['Kotlin', 'Room', 'Retrofit', 'Material Design'],
  },
]

export const projects = [
  {
    name: 'Recall AI',
    subtitle: 'Intelligent Meeting Assistant',
    period: '2026 — in progress',
    description:
      'Real-time meeting copilot: live audio transcription, AI chat, and a streaming Live Assistant — powered by a Kotlin Coroutines + Flow pipeline into the Gemini API, with an offline-first Room layer whose reactive SQL-to-Flow queries update the UI instantly.',
    stack: ['Kotlin', 'Jetpack Compose', 'Hilt', 'Flow', 'Room', 'Gemini API'],
    link: 'https://github.com/MohitGujarati/RecallAI--Intelligent-Meeting-Assistant',
    accent: 'blue',
    featured: true,
  },
  {
    name: 'Fleet Tracker',
    subtitle: 'Real-time Fleet Monitoring',
    period: '2023 – 2024',
    description:
      'Production fleet-tracking app with Google Maps and geofence-triggered actions. Motion sensors detect incidents and harsh driving; Realm stores safe zones, travel history, and activity for fast on-device analytics.',
    stack: ['Kotlin', 'Google Maps', 'Geofencing', 'Realm', 'Motion Sensors'],
    link: 'https://github.com/MohitGujarati',
    accent: 'pink',
    featured: true,
  },
  {
    name: 'Lummina',
    subtitle: 'Agentic Learning Ecosystem',
    period: '2026',
    description:
      'Multi-agent tutoring platform: a custom ReAct loop over the Gemini API drives a RAG pipeline that turns raw PDF uploads into interactive quizzes and context-aware tutoring, on a Supabase / PostgreSQL backend with Row Level Security.',
    stack: ['React 19', 'Node.js', 'Gemini API', 'Supabase', 'PostgreSQL'],
    link: 'https://github.com/MohitGujarati/lummina-core',
    accent: 'purple',
    featured: true,
  },
  {
    name: 'The Cognito Times',
    subtitle: 'AI News Recommender System',
    period: '2025 – 2026',
    description:
      'Hybrid recommendation engine using Sentence-BERT and Maximal Marginal Relevance re-ranking — boosting content diversity ~30% and killing filter bubbles. React + Flask + Docker stack serves personalized predictions in under 200ms, with Flan-T5 auto-summaries via Hugging Face Transformers.',
    stack: ['React', 'Python', 'Flask', 'SBERT', 'Firebase', 'Flan-T5', 'Docker'],
    link: 'https://github.com/MohitGujarati/AI-RecomondationSystemProject-',
    demo: 'https://huggingface.co/spaces/MohitGujarati/news-recommender',
    accent: 'blue',
    featured: true,
  },
  {
    name: 'TweetStream',
    subtitle: 'Modern Android showcase',
    period: 'Open source',
    description:
      'A Twitter-style feed built to demonstrate the modern Android stack end-to-end: Hilt DI, Kotlin Flow, and fully declarative Jetpack Compose UI.',
    stack: ['Kotlin', 'Compose', 'Hilt', 'Flow'],
    link: 'https://github.com/MohitGujarati/TweetStream-Hilt-Flow-Compose',
    accent: 'blue',
  },
  {
    name: 'TwinAI',
    subtitle: 'AI companion app',
    period: 'Open source',
    description:
      'Native Android experiment in personal AI — conversational features built in Kotlin with on-device-first design.',
    stack: ['Kotlin', 'Android', 'AI'],
    link: 'https://github.com/MohitGujarati/TwinAI',
    accent: 'pink',
  },
  {
    name: 'FlamingoNewsAI',
    subtitle: 'AI-curated news reader',
    period: 'Open source',
    description:
      'News app that pairs a clean native Android reading experience with AI-assisted curation and summarization.',
    stack: ['Kotlin', 'Android', 'REST APIs'],
    link: 'https://github.com/MohitGujarati/FlamingoNewsAI',
    accent: 'purple',
  },
]

export const research = [
  {
    title: "Parkinson's Disease Detection Using Handwriting: A Hybrid Multi-CNN and Genetic Algorithm Framework",
    category: 'IEEE',
    year: '2026',
    abstract:
      'An end-to-end hybrid diagnostic framework for non-invasive Parkinson’s detection from hand-drawn graphomotor biomarkers — Multi-CNN feature extraction (ResNet50, VGG19, InceptionV3), Genetic Algorithm feature selection, XGBoost classification, and SHAP interpretability, achieving 99.2% external validation accuracy.',
    file: `${import.meta.env.BASE_URL}papers/parkinsons-multicnn-ga-2026.pdf`,
    tags: ['Medical AI', 'CNN', 'XGBoost', 'SHAP'],
  },
  {
    title: 'Solving Information Overload: Using BERT to Recommend News Articles Related to User Interest',
    category: 'IEEE',
    year: '2025',
    abstract:
      'A content-based recommender built on Sentence-BERT semantic embeddings and a rich user profile from explicit preferences, liked articles, and reading history. Cosine similarity over all-MiniLM-L6-v2 vectors drives personalized ranking beyond keyword matching.',
    file: `${import.meta.env.BASE_URL}papers/sbert-news-recommendation-2025.pdf`,
    tags: ['Recommendation Systems', 'BERT', 'NLP'],
  },
  {
    title: 'A Comparative Survey of PyTorch vs. TensorFlow: Usability, Performance, and Deployment',
    category: 'Survey',
    year: '2026',
    abstract:
      'A comparative study of the two dominant deep-learning frameworks across usability, training performance, and production deployment paths.',
    file: `${import.meta.env.BASE_URL}papers/pytorch-vs-tensorflow-2026.pdf`,
    tags: ['PyTorch', 'TensorFlow', 'Deep Learning'],
  },
  {
    title: 'TensorFlow: A System for Large-Scale Machine Learning',
    category: 'Review',
    year: '2026',
    abstract:
      'A structured review of TensorFlow’s dataflow-graph execution model, extensibility, distributed training strategies, and benchmark performance across CNN and language-modeling workloads.',
    file: `${import.meta.env.BASE_URL}papers/tensorflow-large-scale-ml-2026.pdf`,
    tags: ['TensorFlow', 'Distributed Systems'],
  },
  {
    title: 'Microservices and Distributed Systems: Architectures for Scalable, Fault-Tolerant Modern Applications',
    category: 'Review',
    year: '2024',
    abstract:
      'A qualitative analysis of microservices architecture through Netflix, Uber, and ChatGPT case studies — how modularity, scalability, and fault tolerance overcome the limits of monoliths at production scale.',
    file: `${import.meta.env.BASE_URL}papers/microservices-distributed-systems-2024.pdf`,
    tags: ['Microservices', 'System Design'],
  },
]

export const certifications = [
  {
    name: 'Exploring Ktor with Kotlin Multiplatform and Compose',
    authority: 'LinkedIn Learning',
    date: 'Apr 2026',
    url: 'https://www.linkedin.com/learning/certificates/77073d0f34e66fdbd5f9ac4bab4ca3154e43453dd18b1dc02f863ff0efff5d3c',
    skills: ['Ktor', 'Kotlin Multiplatform', 'Compose'],
  },
  {
    name: 'Kotlin Multiplatform Development',
    authority: 'LinkedIn Learning',
    date: 'Apr 2026',
    url: 'https://www.linkedin.com/learning/certificates/ffc858d6b84e7dfebcacf9be06b7854492a515178f6840deb46158c92da734be',
    skills: ['KMP', 'Android', 'iOS'],
  },
  {
    name: 'Kotlin Essential Training: Object-Oriented and Async Code',
    authority: 'LinkedIn Learning',
    date: 'Apr 2026',
    url: 'https://www.linkedin.com/learning/certificates/ef2c8e5cad20859e4fcdcd459daef33d1c935cb4e215d5256570bfc303d6e0e9',
    skills: ['Kotlin', 'OOP', 'Coroutines'],
  },
  {
    name: 'Kotlin Essential Training: Functions, Collections, and I/O',
    authority: 'LinkedIn Learning',
    date: 'Apr 2026',
    url: 'https://www.linkedin.com/learning/certificates/940020f314e3e2e82ca78a9c55afd86c6f0721f192050bfd831278441cfa552d',
    skills: ['Kotlin', 'Functional', 'Collections'],
  },
  {
    name: 'AI Agents Fundamentals',
    authority: 'Hugging Face',
    date: 'Jan 2026',
    url: 'https://huggingface.co/datasets/agents-course/certificates/resolve/main/certificates/MohitGujarati/2026-01-15.png',
    skills: ['AI Agents', 'LLMs', 'GenAI'],
  },
  {
    name: 'Large Language Models (LLMs)',
    authority: 'Hugging Face',
    date: '2026',
    url: 'https://huggingface.co/agents-course',
    skills: ['LLMs', 'Transformers', 'NLP'],
  },
  {
    name: 'Kotlin Masterclass for Android Development',
    authority: 'Udemy',
    date: 'Mar 2022',
    url: 'https://udemy-certificate.s3.amazonaws.com/pdf/UC-48a517a0-025e-40ba-bd25-24e0c88ff0e2.pdf',
    skills: ['Kotlin', 'Android'],
  },
  {
    name: 'SQL Fundamentals',
    authority: 'LinkedIn Learning',
    date: 'Nov 2021',
    url: '',
    skills: ['SQL', 'MySQL', 'DBMS'],
  },
  {
    name: 'Python for Data Science',
    authority: 'IBM',
    date: 'Apr 2020',
    url: 'https://www.youracclaim.com/badges/bf7c157f-0bd5-43bb-9abc-b14dfd292c55/linked_in_profile',
    skills: ['Python', 'Data Science', 'ML'],
  },
]
