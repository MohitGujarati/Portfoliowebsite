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
    name: "Lummina",
    category: "Agentic Learning Ecosystem",
    period: "March 2026 – May 2026",
    bullets: [
      "AI Agent Architecture & RAG Pipeline: Engineered a multi-agent system utilizing the Gemini API and a custom ReAct loop, orchestrating a Retrieval-Augmented Generation (RAG) pipeline to dynamically generate interactive quizzes and context-aware tutoring from raw PDF uploads.",
      "Secure Multi-Tenant Cloud Infrastructure: Architected a robust Supabase backend with PostgreSQL, enforcing strict teacher/student data isolation through Row Level Security (RLS) and utilizing an Express server to safely proxy LLM requests and protect credentials.",
    ],
    github: "https://github.com/MohitGujarati/lummina-core.git",
    tags: ["React 19", "Node.js", "Express.js", "Gemini API", "Supabase", "PostgreSQL , Docker,Huggingface "],
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
    tags: ["React.js", "Python", "Flask", "SBERT", "Firebase", "Google Flan-T5", "huggingface", "Docker"],
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

];


// =============================================
//  SKILLS — Add/edit skill categories here
// =============================================

const CERTIFICATIONS = [
  {
    name: "Exploring Ktor with Kotlin Multiplatform and Compose",
    authority: "LinkedIn",
    date: "Apr 2026",
    url: "https://www.linkedin.com/learning/certificates/77073d0f34e66fdbd5f9ac4bab4ca3154e43453dd18b1dc02f863ff0efff5d3c",
    image: "images/certificates/linkedin_ktor.png",
    skills: ["Ktor", "Kotlin Multiplatform", "Jetpack Compose", "Kotlin", "Networking"]
  },
  {
    name: "Kotlin Multiplatform Development",
    authority: "LinkedIn",
    date: "Apr 2026",
    url: "https://www.linkedin.com/learning/certificates/ffc858d6b84e7dfebcacf9be06b7854492a515178f6840deb46158c92da734be?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3B%2Fmo6OEF6QFuNuksLKlrP8Q%3D%3D",
    image: "images/certificates/linkedin_kmp.png",
    skills: ["Kotlin Multiplatform", "Kotlin", "Android Development", "iOS Development", "Cross-Platform Development"]
  },
  {
    name: "Kotlin Essential Training: Object-Oriented and Async Code",
    authority: "LinkedIn",
    date: "Apr 2026",
    url: "https://www.linkedin.com/learning/certificates/ef2c8e5cad20859e4fcdcd459daef33d1c935cb4e215d5256570bfc303d6e0e9",
    image: "images/certificates/linkedin_kotlin_oo.png",
    skills: ["Kotlin", "Object-Oriented Programming (OOP)", "Coroutines", "Asynchronous Programming"]
  },
  {
    name: "Kotlin Essential Training: Functions, Collections, and I/O",
    authority: "LinkedIn",
    date: "Apr 2026",
    url: "https://www.linkedin.com/learning/certificates/940020f314e3e2e82ca78a9c55afd86c6f0721f192050bfd831278441cfa552d",
    image: "images/certificates/linkedin_kotlin_fc.png",
    skills: ["Kotlin", "Functional Programming", "Collections", "File I/O"]
  },
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



// =============================================
//  RESEARCH PAPERS — Add your papers here
//  Place PDF files in the "papers/" folder.
//  category: "ieee" | "informal"
// =============================================

const RESEARCH_PAPERS = [
  {
    title: "Parkinson's Disease Detection Using Handwriting: A Hybrid Multi-CNN and Genetic Algorithm Framework",
    category: "ieee",
    abstract: "A novel end-to-end hybrid diagnostic framework for automated, non-invasive Parkinson's Disease detection from digitized hand-drawn graphomotor biomarkers, combining Multi-CNN deep feature extraction (ResNet50, VGG19, InceptionV3), Genetic Algorithm feature selection, XGBoost classification, and SHAP interpretability — achieving 99.2% external validation accuracy.",
    file: "papers/AI700-001_Group4_IEEE_REPORT_SPRG2026.pdf",
    year: "2026",
    tags: ["Parkinson's Disease", "Deep Learning", "XGBoost", "SHAP", "Medical AI", "CNN", "LIU"],
  },
  {
    title: "Solving Information Overload: A Study on Using BERT to Recommend News Articles Related to User Interest",
    category: "ieee",
    abstract: "A content-based recommendation system leveraging Sentence-BERT (SBERT) semantic embeddings and a Rich User Profile derived from explicit preferences, liked articles, and reading history. Cosine similarity on all-MiniLM-L6-v2 vectors drives personalized news ranking, eliminating keyword-matching limitations of traditional approaches.",
    file: "papers/CS666_GROUP_1_IEEE REPORT.pdf",
    year: "2025",
    tags: ["Recommendation Systems", "BERT", "NLP", "Information Retrieval", "LIU"],
  },
  {
    title: "A Comparative Survey of PyTorch vs. TensorFlow for Deep Learning: Usability, Performance, and Deployment",
    category: "informal",
    abstract: "A qualitative analysis of microservices and distributed systems architecture through case studies of Netflix, Uber, and ChatGPT, demonstrating how SAD principles — modularity, scalability, and fault tolerance — address the limitations of monolithic architectures in large-scale production environments.",
    file: "papers/MohitGujarati_001_4-27-26_Spring26.pdf",
    year: "2026",
    tags: ["Deep Learning", "PyTorch", "TensorFlow", "Machine Learning", "Google"],
  },
  {
    title: "TensorFlow: A System for Large-Scale Machine Learning",
    category: "informal",
    abstract: "A structured review of the TensorFlow framework, examining its dataflow graph execution model, extensibility through user-level libraries, distributed training strategies, and benchmark performance across CNN and language modeling tasks on heterogeneous hardware.",
    file: "papers/MohitGujarati_001_4-13-26_Spring26.pdf",
    year: "2026",
    tags: ["TensorFlow", "Machine Learning", "Deep Learning", "Distributed Systems", "Google", "LIU"],
  },
  {
    title: "Microservices and Distributed Systems: Architectures for Scalable, Fault-Tolerant, and Efficient Modern Applications",
    category: "informal",
    abstract: "A qualitative analysis of microservices and distributed systems architecture through case studies of Netflix, Uber, and ChatGPT, demonstrating how SAD principles — modularity, scalability, and fault tolerance — address the limitations of monolithic architectures in large-scale production environments.",
    file: "papers/Mohit_Gujarati_100862494_system-design termpaper.pdf",
    year: "2024",
    tags: ["Microservices", "Distributed Systems", "Netflix", "Uber", "System Design", "LIU"],
  },
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
