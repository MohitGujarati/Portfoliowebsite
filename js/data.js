// =============================================
//  SITE CONFIG — Update your personal info here
// =============================================

const SITE = {
  name: "Mohit Gujarati",
  pageTitle: "Mohit Gujarati | Software Engineer",
  email: "mohit.gujarati@my.liu.edu",
  linkedin: "https://linkedin.com/in/mohitgujarati",
  github: "https://github.com/MohitGujarati",
  resumeUrl: "Mohit_Android_Resume.pdf",  // <-- update resume path here
};

// =============================================
//  HERO — Edit your intro text here
// =============================================

const HERO = {
  statusBadge: "Open to roles starting Mid-June 2026",

  // The highlighted word gets the gradient color
  headlinePlain: "Engineering",
  headlineHighlight: "Intelligent",
  headlineSuffix: "Mobile Solutions.",

  bio: "I'm <strong>Mohit Gujarati</strong> — a Software Engineer specializing in optimized, production-ready Android applications powered by Kotlin, Jetpack Compose, and seamless AI integrations.",

  avatar: "images/avatar_mohit.png",
  avatarAlt: "Mohit Gujarati",
};


// =============================================
//  EXPERIENCE — Add/edit jobs and education
// =============================================

const EXPERIENCE = [
  {
    period: "2024 – 2026 (Expected)",
    title: "M.S. Computer Engineering",
    org: "Long Island University, Brooklyn",
    isCurrent: true,  // shows filled dot on timeline
    bullets: [
      "Specializing in <strong>Artificial Intelligence</strong>, Pattern Recognition, and System Design.",
    ],
  },
  {
    period: "May 2023 – June 2024",
    title: "Software Developer",
    org: "TNM Software Solutions Pvt Ltd.",
    bullets: [
      "Engineered Android apps with <strong>Kotlin</strong> & Motion Sensors.",
      "Boosted performance by <strong>50%</strong> via modern architecture.",
      "Delivered <strong>4 production apps</strong> in 8 months.",
    ],
  },
  {
    period: "May 2022 – May 2023",
    title: "Android Developer Trainee",
    org: "Tops Technology Inc.",
    bullets: [
      "Developed full-stack native mobile applications. Optimized API integrations & database solutions.",
    ],
  },
  {
    period: "2016 – 2020",
    title: "B.E. Computer Engineering",
    org: "Shankersinh Vaghela Institute of Technology",
    bullets: [
      "Core coursework in <strong>Java</strong>, Object-Oriented Programming, and Data Structures & Algorithms.",
    ],
  },
];


// =============================================
//  PROJECTS — Add/edit your projects here
// =============================================

const PROJECTS = [
  {
    name: "Recall AI",
    category: "Intelligent Meeting Assistant",
    bullets: [
      "Reactive UI & Architecture: Architected a declarative interface from scratch using Jetpack Compose and MVVM, leveraging Hilt for scalable dependency injection and ViewModels to seamlessly bridge the UI and data layers without tight coupling.",
      "Asynchronous AI Integration: Engineered a real-time streaming pipeline using Kotlin Coroutines and Flow (StateFlow/SharedFlow) to manage complex concurrency, integrating the Gemini API / OpenAPI to handle concurrent live audio transcription and AI-powered chat.",
      "Offline-First Persistence: Developed a highly responsive local database utilizing Room with normalized schemas, leveraging native SQL-to-Flow reactive queries to instantly reflect asynchronous data updates across the application."
    ],
    github: "https://github.com/MohitGujarati/TwinAI",
    tags: ["Kotlin", "Jetpack Compose", "Coroutines", "Flow", "Room", "MVVM", "Hilt", "GIT", "Material Design", "Gemini API", "OpenAPI", "Android Studio", "Retrofit", "StateFlow", "SharedFlow",],
  },
  {
    name: "The Cognito Times",
    category: "AI News Recommender System",
    bullets: [
      "Engineered a hybrid recommendation engine using Sentence-BERT (SBERT) and Maximal Marginal Relevance (MMR), increasing content diversity by ~30% and eliminating filter bubbles through semantic vector re-ranking.",
      "Built a scalable architecture with React.js, Flask, and Docker, serving real-time personalized predictions with sub-second latency (<200ms) via optimized RESTful APIs. Developed a dynamic weighted fusion algorithm (60% explicit / 20% implicit signals) using Firebase Firestore, enabling instant feed adaptation based on live user interactions.",
      "Integrated Google Flan-T5 LLM via Hugging Face Transformers to auto-generate concise context-aware summaries, reducing user information overload and enhancing content discoverability."
    ],
    github: "https://github.com/MohitGujarati/AI-RecomondationSystemProject-",
    demo: "https://huggingface.co/spaces/MohitGujarati/news-recommender",
    tags: ["React.js", "Python", "Flask", "SBERT", "Firebase", "Google Flan-T5", "Docker"],
  },
  {
    name: "Fleet Tracker",
    category: "Enterprise",
    confidential: true,  // shows "CONFIDENTIAL" badge instead of GitHub link
    bullets: [
      "Developed Android app for real-time fleet tracking with Google Maps, Geofencing, and motion sensor–based incident detection. Used Realm Database for secure storage of safe zones, travel history, and user activity with fast retrieval. Applied SOLID principles, multi-threaded approaches using Kotlin Coroutines, improving app performance and maintainability by 40%.",
    ],
    tags: ["Kotlin", "Google Maps", "Realm", "Jetpack Components", "Geocoder", "Geofences", "Motion sensor", "S.O.L.I.D", "GIT"],
  },
  {
    name: "InEvents",
    category: "Event Management",
    bullets: [
      "Deployed an event management app on Google Play Store (500+ downloads) using Kotlin and Firebase, achieving 100% paperless registration for 200+ daily active users. The app was unlisted after my graduation because it was not updated frequently.",
    ],
    github: "https://github.com/MohitGujarati/SnapEvents",
    tags: ["Kotlin", "Firebase", "MySQL/Room"],
  },
];


// =============================================
//  SKILLS — Add/edit skill categories here
// =============================================

const CERTIFICATIONS = [
  {
    name: "AI Agents Fundamentals",
    authority: "Hugging Face",
    date: "Jan 2026",
    url: "https://huggingface.co/datasets/agents-course/certificates/resolve/main/certificates/MohitGujarati/2026-01-15.png",
    image: "images/certificates/huggingface_ai.png", // Update with your actual image path
    skills: ["Artificial Intelligence (AI)", "Large Language Models (LLM)", "Generative AI", "Natural Language Processing (NLP)"]
  },
  {
    name: "Large Language Models (LLMs)", // Update if the exact course title differs
    authority: "Hugging Face",
    date: "2026", // Update with the exact month/year from the certificate
    url: "https://huggingface.co/agents-course", // Add the verification URL if available
    image: "images/certificates/Huggingface-Certificate-LLM.webp", // Matching your uploaded file
    skills: ["Large Language Models (LLM)", "Hugging Face Transformers", "Generative AI", "NLP"]
  },
  {
    name: "Kotlin Masterclass for Android Development",
    authority: "Udemy",
    date: "Mar 2022",
    url: "https://udemy-certificate.s3.amazonaws.com/pdf/UC-48a517a0-025e-40ba-bd25-24e0c88ff0e2.pdf",
    image: "images/certificates/udemy_kotlin.png", // Update with your actual image path
    skills: ["Kotlin", "Android Development", "Mobile Application Development", "Object-Oriented Programming (OOP)"]
  },
  {
    name: "SQL Fundamentals",
    authority: "LinkedIn",
    date: "Nov 2021",
    url: "", // Add URL if available
    image: "images/certificates/linkedin_sql.png", // Update with your actual image path
    skills: ["SQL", "Database Management System (DBMS)", "MySQL", "Data Structures"]
  },
  {
    name: "Python for Data Science",
    authority: "IBM",
    date: "Apr 2020",
    url: "https://www.youracclaim.com/badges/bf7c157f-0bd5-43bb-9abc-b14dfd292c55/linked_in_profile",
    image: "images/certificates/ibm_python.png", // Update with your actual image path
    skills: ["Python (Programming Language)", "Data Science", "Machine Learning", "Analytical Skills"]
  }
];



const SKILLS = [
  {
    title: "Languages",
    icon: "fas fa-code",
    iconBg: "bg-blue-100",
    iconColor: "text-primary",
    tags: ["Kotlin", "Java", "Python", "JavaScript", "TypeScript", "C++"],
  },
  {
    title: "Android",
    icon: "fab fa-android",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    tags: ["Jetpack Compose", "Coroutines", "Retrofit", "Room DB", "Kotlin", "Jetpack Compose", "Coroutines", "Flow", "Room", "MVVM", "Hilt"],
  },
  {
    title: "Web Development",
    icon: "fas fa-globe",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    tags: ["HTML5", "CSS3", "JavaScript", "React"],
  },
  {
    title: "Generative AI",
    icon: "fas fa-robot",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    tags: ["Generative AI", "LLM Integration", "NLP", "RAG", "Semantic Search", "Hugging Face Transformers", "OpenAI / Google Gemini API"],
  },
  {
    title: "Databases",
    icon: "fas fa-database",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    tags: ["Firebase", "MySQL", "SQLite", "MongoDB", "Supabase", "Room DB"],
  },
  {
    title: "Tools & Practices",
    icon: "fas fa-tools",
    iconBg: "bg-gray-200",
    iconColor: "text-gray-600",
    tags: ["Git/GitHub", "Android Studio", "Rest APIs", "MVVM, MVP", "SOLID Principles", "Material Design", "Coroutines, Thread", "Postman"],
  },
];
