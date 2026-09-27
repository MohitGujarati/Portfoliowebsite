"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// brag-output/work/export-source.tsx
var export_source_exports = {};
__export(export_source_exports, {
  source: () => source
});
module.exports = __toCommonJS(export_source_exports);
var import_server = require("react-dom/server");

// components/Terminal.tsx
var import_react = require("react");

// lib/intro-state.ts
var done = false;
var completed = false;
var listeners = /* @__PURE__ */ new Set();
function onIntroDone(cb) {
  if (done) {
    cb(completed);
    return () => {
    };
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function replayIntro() {
  try {
    sessionStorage.removeItem("booted");
  } catch {
  }
  window.scrollTo(0, 0);
  window.location.reload();
}

// lib/site.ts
var SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}` : null) || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) || "https://mohitgujarati.github.io").replace(/\/$/, "");
var BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
var asset = (path) => `${BASE_PATH}${path}`;
var profile = {
  name: "Mohit Gujarati",
  role: "Full-Stack Software Engineer",
  company: "Gabriel AI",
  location: "Phoenix, AZ",
  email: "mohitgujarati11@gmail.com",
  github: "https://github.com/MohitGujarati",
  linkedin: "https://www.linkedin.com/in/mohitgujarati/",
  resume: "/Mohit_Gujarati_Resume.pdf",
  summary: "Full-stack software engineer with 3+ years of professional experience building mobile and web apps with Kotlin, React Native, React and Next.js. I build data layers (Room, AWS, Supabase, Firebase), integrate REST APIs, and develop AI products, from streaming Gemini pipelines to voice calling workflows.",
  short: "Full-stack software engineer building mobile, web and AI products with Kotlin, React Native, React and Next.js."
};
var experience = [
  {
    hash: "a7c3e19",
    ref: "HEAD \u2192 main",
    head: true,
    role: "Full-Stack Engineer",
    company: "Gabriel AI",
    start: "2026-08",
    dates: "Aug 2026 \u2013 Present",
    points: [
      "Led the migration of the customer-facing marketing site from a client-rendered React app to a **Next.js static export** (19 routes plus a CMS-driven blog). Lighthouse SEO went from unmeasurable to **100 on every page**, image payload dropped by **86%**, and all content became crawlable by search engines and AI bots for the first time.",
      "Deployed on AWS Amplify with build config and env management, plus a one-command audit script (crawlability, structured data, sitemap, Lighthouse) that has to pass before each release.",
      "Build and ship features across the platform: the dashboard and web app front end, back-end APIs and database logic, and AI voice calling workflows, with integrations for HubSpot, lead sources, Contentful, GA4 and Cloudflare Turnstile.",
      "Own code quality end to end: tested code, debugging across the stack, and code reviews and planning with product, design and marketing."
    ],
    tags: ["Next.js", "React", "AWS Amplify", "HubSpot", "Contentful", "GA4"]
  },
  {
    hash: "4f2b8d0",
    ref: "tag: tnm-software",
    role: "Software Engineer",
    company: "TNM Software Solutions",
    start: "2023-05",
    end: "2024-06",
    dates: "May 2023 \u2013 Jun 2024",
    points: [
      "Cut device power consumption by **30% fleet-wide** by building battery-efficient location services in Kotlin, using the Google Geofencing API and motion sensors to reduce GPS polling.",
      "Improved app performance by **50%** and removed UI-thread bottlenecks by refactoring the legacy codebase to MVVM with Kotlin Coroutines for non-blocking I/O.",
      "Shipped production Android and web apps from scratch, working in daily stand-ups and weekly sprints with the backend and QA teams."
    ],
    tags: ["Kotlin", "Android", "Geofencing API", "MVVM", "Coroutines"]
  },
  {
    hash: "e91c5a7",
    ref: "tag: v1.0-first-job",
    role: "Software Engineer Trainee",
    company: "Tops Technology Inc.",
    start: "2023-05",
    end: "2024-06",
    dates: "May 2023 \u2013 Jun 2024",
    points: [
      "Built and released user-facing features with Android UI components and Material Design in Kotlin, and published them to the Google Play Store.",
      "Designed normalized Room/SQLite schemas that sped up queries and made offline-first data sync reliable.",
      "Structured MVVM repositories with clear UI, domain and data layers, integrating REST APIs through Retrofit, Coroutines and LiveData."
    ],
    tags: ["Kotlin", "Room", "SQLite", "Retrofit", "Material Design"]
  }
];
var projects = [
  {
    slug: "shop-circle",
    name: "Shop Circle",
    kind: "Social commerce \xB7 Mobile",
    dates: "Jun \u2013 Aug 2026",
    pitch: "A cross-platform social commerce app with one feed for posts and products, multi-image uploads, optimistic likes, ranked discovery, and typo-tolerant search.",
    points: [
      "Relational schema with 6 tables, 10 SQL migrations and 2 engagement-ranked views, secured with **PostgreSQL Row-Level Security** instead of application code.",
      "Google OAuth and username login with deep-link callbacks, plus a CI/CD pipeline from GitHub Actions to a signed APK on Firebase App Distribution."
    ],
    tags: ["React Native", "Expo", "TypeScript", "Supabase", "Algolia", "GitHub Actions"]
  },
  {
    slug: "recall-ai",
    name: "Recall AI",
    kind: "AI assistant \xB7 Android",
    dates: "Feb \u2013 May 2026",
    pitch: "A voice-driven meeting assistant that transcribes live audio, answers questions about the meeting, and handles tasks like setting alarms and reminders for to-dos.",
    points: [
      "Real-time streaming pipeline built on the **Gemini API**, Kotlin Coroutines and StateFlow, with a fully declarative Jetpack Compose UI.",
      "Offline-first persistence with Room, normalized schemas and SQL-to-Flow queries. CI/CD handles secure API key injection, tests, linting and Firebase test builds."
    ],
    tags: ["Kotlin", "Jetpack Compose", "Hilt", "Room", "Flow", "Gemini API"]
  },
  {
    slug: "lummina",
    name: "Lummina",
    kind: "AI learning \xB7 Full-stack web",
    dates: "Mar \u2013 May 2026",
    pitch: "An AI learning platform with streaming chat, quiz generation, AI grading, study guides, and real-time voice exams.",
    points: [
      "A **ReAct-based agent orchestrator** with multi-step pipelines and structured outputs that automatically regenerates any quiz scoring below 70%.",
      "AI requests go through Express so Gemini and Supabase credentials stay on the server. Responses stream to the client over SSE, and voice exams run on WebSockets with Gemini Live."
    ],
    tags: ["React 19", "Vite", "Express.js", "Gemini Live", "WebSocket", "Supabase"]
  }
];
var papers = [
  {
    slug: "parkinsons-detection",
    kind: "ieee",
    badge: "IEEE format",
    title: "Parkinson's Disease Detection Using Handwriting: A Hybrid Multi-CNN and Genetic Algorithm Framework",
    venue: "AI700 Applicable Deep Learning \xB7 LIU Brooklyn",
    year: "2026",
    coAuthored: true,
    result: { value: "99.2%", label: "external validation accuracy" },
    abstract: "An end-to-end hybrid framework for automated, non-invasive Parkinson's Disease detection from digitized hand-drawn graphomotor biomarkers. It combines deep feature extraction from multiple CNNs (ResNet50, VGG19, InceptionV3), Genetic Algorithm feature selection, XGBoost classification, and SHAP interpretability.",
    tags: ["Deep Learning", "Multi-CNN", "Genetic Algorithm", "XGBoost", "SHAP", "Medical AI"],
    file: "/papers/parkinsons-detection-handwriting.pdf"
  },
  {
    slug: "bert-news-recommendation",
    kind: "ieee",
    badge: "IEEE format",
    title: "Solving Information Overload: Using BERT to Recommend News Articles Related to User Interest",
    venue: "CS666 \xB7 LIU Brooklyn",
    year: "2025",
    coAuthored: true,
    result: { value: "SBERT", label: "semantic ranking over a rich user profile" },
    abstract: "A content-based recommendation system that uses Sentence-BERT embeddings and a rich user profile built from explicit preferences, liked articles and reading history. Cosine similarity over all-MiniLM-L6-v2 vectors drives personalized news ranking, avoiding the limits of keyword matching.",
    tags: ["NLP", "Sentence-BERT", "Recommender Systems", "Information Retrieval"],
    file: "/papers/bert-news-recommendation.pdf"
  },
  {
    slug: "pytorch-vs-tensorflow",
    kind: "review",
    badge: "survey",
    title: "A Comparative Survey of PyTorch vs. TensorFlow for Deep Learning: Usability, Performance, and Deployment",
    venue: "AI700 Applicable Deep Learning \xB7 LIU Brooklyn",
    year: "2026",
    abstract: "Compares the two dominant deep learning frameworks across developer experience, training and inference efficiency, deployment, and ecosystem. Both deliver strong results, but PyTorch leans toward simplicity and research while TensorFlow leans toward a complete production ecosystem, so the right choice depends on which trade-offs matter most.",
    tags: ["PyTorch", "TensorFlow", "Deep Learning"],
    file: "/papers/pytorch-vs-tensorflow-survey.pdf"
  },
  {
    slug: "tensorflow-review",
    kind: "review",
    badge: "paper review",
    title: "TensorFlow: A System for Large-Scale Machine Learning",
    venue: "AI700 Applicable Deep Learning \xB7 LIU Brooklyn",
    year: "2026",
    abstract: "A structured review of the TensorFlow paper: its single dataflow-graph model for computation and mutable state, extensibility through user-level libraries, distributed training, and benchmark performance on image classification and language modeling across CPUs, GPUs and TPUs.",
    tags: ["TensorFlow", "Dataflow Graphs", "Distributed Systems"],
    file: "/papers/tensorflow-system-review.pdf"
  },
  {
    slug: "microservices",
    kind: "review",
    badge: "term paper",
    title: "Microservices and Distributed Systems: Architectures for Scalable, Fault-Tolerant, and Efficient Modern Applications",
    venue: "System Design and Analysis \xB7 LIU Brooklyn",
    year: "2024",
    abstract: "A qualitative analysis of microservices and distributed systems through case studies of Netflix, Uber and ChatGPT, showing how system analysis and design principles (modularity, scalability and fault tolerance) address the limits of monolithic architectures at production scale.",
    tags: ["Microservices", "Distributed Systems", "System Design"],
    file: "/papers/microservices-distributed-systems.pdf"
  }
];
var skills = [
  { group: "languages", items: ["Kotlin", "TypeScript", "JavaScript", "Java", "Python", "SQL"] },
  { group: "mobile", items: ["Jetpack Compose", "Android SDK", "React Native", "Expo", "Coroutines", "Flow / StateFlow", "LiveData", "Hilt", "Retrofit"] },
  { group: "web", items: ["React 19", "Next.js (App Router)", "MUI", "Framer Motion", "Express.js", "REST APIs", "WebSocket", "SSE"] },
  { group: "data-cloud", items: ["PostgreSQL", "Supabase", "SQLite", "Room", "Firebase", "Google Cloud", "AWS Amplify"] },
  { group: "ai", items: ["Gemini API", "Gemini Live", "ReAct agents", "Structured outputs", "Voice AI workflows"] },
  { group: "practices", items: ["MVVM", "Clean Architecture", "Offline-first", "Dependency Injection", "GitHub Actions CI/CD", "Agile / Scrum"] }
];
var education = [
  {
    degree: "M.S. in Computer Science",
    school: "Long Island University",
    place: "Brooklyn, NY",
    dates: "Sep 2024 \u2013 May 2026",
    note: "GPA 3.9 / 4.0"
  },
  {
    degree: "B.Tech in Computer Engineering",
    school: "Shankersinh Vaghela Institute of Technology",
    place: "Gujarat, India",
    dates: "Aug 2016 \u2013 Sep 2020"
  }
];
var awards = [
  "Excellence Award in Graduate Computer Science, LIU Brooklyn",
  "Kotlin Professional Certificate, JetBrains"
];
var plain = (s) => s.replace(/\*\*/g, "");

// lib/terminal.ts
var SECTIONS = ["experience", "projects", "research", "skills", "education", "shell", "contact"];
var PROJECT_FILES = Object.fromEntries(projects.map((p) => [`${p.slug}.md`, p]));
var PAPER_FILES = Object.fromEntries(papers.map((p) => [`${p.slug}.pdf`, p]));
var DIR_FILES = {
  experience: experience.map((j) => `${j.company.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "")}.log`),
  projects: Object.keys(PROJECT_FILES),
  research: Object.keys(PAPER_FILES),
  skills: skills.map((s) => `${s.group}/`),
  education: ["ms-computer-science.txt", "btech-computer-engineering.txt"],
  shell: ["mohit-sh"],
  contact: ["email", "linkedin", "github"]
};
function initTerminal(o) {
  const { body, out, form, input, prompt, suggest } = o;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const history = [];
  const timers = [];
  let hIndex = 0;
  let cwd = "~";
  const scrollDown = () => {
    body.scrollTop = body.scrollHeight;
  };
  function span(text, cls) {
    const s = document.createElement("span");
    s.textContent = text;
    if (cls) s.className = cls;
    return s;
  }
  function link(text, href) {
    const a = document.createElement("a");
    a.textContent = text;
    a.href = href;
    a.className = "t-link";
    if (href.startsWith("http") || href.endsWith(".pdf")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    return a;
  }
  function row(content, cls) {
    const d = document.createElement("div");
    d.className = "t-row" + (cls ? " " + cls : "");
    if (Array.isArray(content)) d.append(...content);
    else if (typeof content === "string") d.textContent = content;
    else d.append(content);
    out.append(d);
    scrollDown();
  }
  const gap = () => row("", "t-gap");
  function grid(pairs) {
    const d = document.createElement("div");
    d.className = "t-row t-grid";
    pairs.forEach(([k, v]) => {
      d.append(span(k, "t-accent"));
      d.append(typeof v === "string" ? span(v) : v);
    });
    out.append(d);
    scrollDown();
  }
  const later = (ms, fn) => {
    timers.push(window.setTimeout(fn, reduce ? 0 : ms));
  };
  const setPrompt = () => {
    prompt.textContent = `visitor@mohit:${cwd}$`;
  };
  const promptSpan = () => span(`visitor@mohit:${cwd}$ `, "t-prompt");
  function openLink(href) {
    row(["opening ", span(href.replace("mailto:", ""), "t-accent"), " \u2026"], "t-muted");
    if (href.startsWith("mailto:")) window.location.href = href;
    else window.open(href, "_blank", "noopener");
  }
  function resolveDir(arg) {
    if (!arg) return cwd === "~" ? "~" : cwd.slice(2);
    const clean = arg.replace(/^~\/?/, "").replace(/^\.\//, "").replace(/\/+$/, "");
    if (clean === "" || clean === "/" || clean === ".." || arg === "~") return "~";
    return SECTIONS.includes(clean) ? clean : null;
  }
  function matrix() {
    if (reduce) {
      row("(matrix is off because reduced motion is enabled)", "t-muted");
      return;
    }
    const c = document.createElement("canvas");
    c.className = "matrix";
    document.body.append(c);
    const ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    c.width = W * dpr;
    c.height = H * dpr;
    c.style.width = W + "px";
    c.style.height = H + "px";
    ctx.scale(dpr, dpr);
    const size = 16;
    const drops = Array.from({ length: Math.ceil(W / size) }, () => Math.random() * -40);
    const glyphs = "01\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8<>{}[]/=+*MOHIT".split("");
    const start = performance.now();
    let last = 0;
    function frame(now) {
      if (now - last > 45) {
        last = now;
        ctx.fillStyle = "rgba(5, 6, 8, 0.12)";
        ctx.fillRect(0, 0, W, H);
        ctx.font = `${size}px monospace`;
        drops.forEach((y, i) => {
          ctx.fillStyle = Math.random() > 0.96 ? "#ffffff" : "#c8f560";
          ctx.fillText(glyphs[Math.random() * glyphs.length | 0], i * size, y * size);
          drops[i] = y * size > H && Math.random() > 0.975 ? 0 : y + 1;
        });
      }
      if (now - start < 5e3) requestAnimationFrame(frame);
      else {
        c.classList.add("is-fading");
        setTimeout(() => c.remove(), 950);
      }
    }
    requestAnimationFrame(frame);
  }
  const ABOUT = profile.summary;
  const commands = {
    help: {
      desc: "list available commands",
      run() {
        grid(Object.entries(commands).filter(([, c]) => !c.hidden).map(([name, c]) => [name + (c.usage ? " " + c.usage : ""), c.desc || ""]));
        gap();
        row("Tab autocompletes \xB7 \u2191/\u2193 history \xB7 Ctrl+L clears \xB7 a few commands are hidden \u{1F440}", "t-muted");
      }
    },
    whoami: {
      desc: "who is this?",
      run() {
        row([span("mohit gujarati", "t-accent"), `: ${profile.role.toLowerCase()} @ ${profile.company} \xB7 ${profile.location}`]);
      }
    },
    about: { desc: "short bio", run() {
      row(ABOUT);
    } },
    ls: {
      desc: "list directory contents",
      usage: "[dir]",
      run([arg]) {
        const dir = resolveDir(arg);
        if (dir === null) {
          row(`ls: cannot access '${arg}': No such file or directory`, "t-err");
          return;
        }
        if (dir === "~") row([...SECTIONS.flatMap((s) => [span(s + "/", "t-dir"), "  "]), "about.txt  resume.pdf"]);
        else row(DIR_FILES[dir].join("  "));
      }
    },
    cd: {
      desc: "jump to a section",
      usage: "<dir>",
      run([arg]) {
        const dir = resolveDir(arg || "~");
        if (dir === null) {
          row(`cd: no such file or directory: ${arg}`, "t-err");
          return;
        }
        cwd = dir === "~" ? "~" : "~/" + dir;
        setPrompt();
        row(dir === "~" ? "\u2191 back to the top" : `\u2192 scrolling to #${dir}`, "t-muted");
        later(250, () => o.navigate(dir === "~" ? "top" : dir));
      }
    },
    cat: {
      desc: "print a file",
      usage: "<file>",
      run([arg]) {
        if (!arg) {
          row("cat: missing file operand (try: cat recall-ai.md)", "t-err");
          return;
        }
        const name = arg.replace(/^(~\/)?(\.\/)?((projects|research)\/)?/, "");
        const p = PROJECT_FILES[name] || PROJECT_FILES[name + ".md"];
        const paper = PAPER_FILES[name] || PAPER_FILES[name + ".pdf"];
        if (p) {
          row(p.name, "t-accent");
          row(`${p.dates} \xB7 ${p.tags.join(", ")}`, "t-muted");
          row(p.pitch);
          p.points.forEach((pt) => row([span("\u2192 ", "t-accent"), plain(pt)]));
        } else if (paper) {
          row(paper.title, "t-accent");
          row(`${paper.badge} \xB7 ${paper.venue} \xB7 ${paper.year}`, "t-muted");
          if (paper.result) row([span("\u2192 ", "t-accent"), `${paper.result.value} ${paper.result.label}`]);
          row([span("\u2192 ", "t-accent"), link("open PDF", asset(paper.file))]);
        } else if (name === "about.txt") row(ABOUT);
        else if (name === "resume.pdf") row([span("resume.pdf: binary file. Run "), span("resume", "t-accent"), span(" to open it.")], "t-warn");
        else row(`cat: ${arg}: No such file or directory`, "t-err");
      }
    },
    experience: {
      desc: "work history (git log)",
      run() {
        experience.forEach((j) => {
          row([span(`* commit ${j.hash}`, "t-warn"), j.head ? span(" (HEAD \u2192 main)", "t-accent") : ""]);
          row(`  ${j.role} @ ${j.company}`);
          row(`  ${j.dates}`, "t-muted");
          gap();
        });
      }
    },
    projects: {
      desc: "things I have built",
      run() {
        grid(projects.map((p) => [`${p.slug}.md`, `${p.name} \xB7 ${p.kind}`]));
        gap();
        row([span("run "), span("cat <file>", "t-accent"), span(" for details")], "t-muted");
      }
    },
    papers: {
      desc: "research & writing",
      run() {
        papers.forEach((p, i) => {
          row([span(`[${i + 1}] `, "t-accent"), span(p.title)]);
          row(`    ${p.badge} \xB7 ${p.year} \xB7 ${p.slug}.pdf`, "t-muted");
        });
        gap();
        row([span("run "), span("cat <file>.pdf", "t-accent"), span(" for a summary and link")], "t-muted");
      }
    },
    skills: { desc: "tech stack", run() {
      grid(skills.map((s) => [`./${s.group}`, s.items.join(", ")]));
    } },
    education: {
      desc: "degrees and awards",
      run() {
        education.forEach((e) => row([span(e.degree, "t-accent"), ` \xB7 ${e.school} \xB7 ${e.dates}${e.note ? " \xB7 " + e.note : ""}`]));
        awards.forEach((a) => row(`\u2605 ${a}`, "t-warn"));
      }
    },
    contact: {
      desc: "ways to reach me",
      run() {
        grid([
          ["email", link(profile.email, `mailto:${profile.email}`)],
          ["linkedin", link("linkedin.com/in/mohitgujarati", profile.linkedin)],
          ["github", link("github.com/MohitGujarati", profile.github)],
          ["resume", link("Mohit_Gujarati_Resume.pdf", asset(profile.resume))]
        ]);
      }
    },
    resume: { desc: "open my resume (PDF)", run() {
      openLink(asset(profile.resume));
    } },
    github: { desc: "open GitHub", run() {
      openLink(profile.github);
    } },
    linkedin: { desc: "open LinkedIn", run() {
      openLink(profile.linkedin);
    } },
    email: { desc: "write me an email", run() {
      openLink(`mailto:${profile.email}`);
    } },
    theme: {
      desc: "switch color theme",
      usage: "[light|dark]",
      run([arg]) {
        const next = arg === "light" || arg === "dark" ? arg : o.getTheme() === "dark" ? "light" : "dark";
        o.setTheme(next);
        row(`theme \u2192 ${next}`, "t-muted");
      }
    },
    ping: {
      desc: "is mohit online?",
      usage: "[host]",
      run([host = "mohit"]) {
        row(`PING ${host} (127.0.0.1): 56 data bytes`);
        [0, 1, 2].forEach((seq) => later(380 * (seq + 1), () => {
          row(`64 bytes from ${host}: icmp_seq=${seq} ttl=64 time=${(0.2 + Math.random() * 0.6).toFixed(2)} ms`);
        }));
        later(380 * 4, () => {
          row(`--- ${host} ping statistics ---`, "t-muted");
          row("3 packets transmitted, 3 received, 0% packet loss. Online and open to opportunities.", "t-accent");
        });
      }
    },
    matrix: { desc: "follow the white rabbit", run() {
      row("wake up, neo\u2026", "t-accent");
      matrix();
    } },
    reboot: {
      desc: "replay the intro",
      run() {
        row("rebooting\u2026", "t-warn");
        later(500, replayIntro);
      }
    },
    history: { desc: "command history", run() {
      history.forEach((h, i) => row(`${String(i + 1).padStart(4)}  ${h}`));
    } },
    clear: { desc: "clear the screen", run() {
      out.textContent = "";
    } },
    // hidden
    sudo: {
      hidden: true,
      run(args) {
        if (args.join(" ").toLowerCase() === "hire mohit") {
          row("[sudo] password for visitor: ********", "t-muted");
          later(450, () => row("access granted \u2713", "t-accent"));
          later(900, () => row("starting hiring pipeline\u2026 [##########] 100%"));
          later(1350, () => row(["next step: ", link(profile.email, `mailto:${profile.email}`)]));
        } else {
          row("visitor is not in the sudoers file. This incident will be reported.", "t-err");
          row([span("hint: try "), span("sudo hire mohit", "t-accent")], "t-muted");
        }
      }
    },
    echo: { hidden: true, run(args) {
      row(args.join(" "));
    } },
    date: { hidden: true, run() {
      row((/* @__PURE__ */ new Date()).toString());
    } },
    pwd: { hidden: true, run() {
      row(cwd.replace("~", "/home/visitor"));
    } },
    rm: {
      hidden: true,
      run(args) {
        if (args.some((a) => /^-\w*r/.test(a))) row("nice try. this portfolio is version-controlled.", "t-warn");
        else row("rm: permission denied", "t-err");
      }
    },
    exit: { hidden: true, run() {
      row([span("there is no exit. only "), span("contact", "t-accent"), span(".")]);
    } },
    vim: { hidden: true, run() {
      row("you're already in vim. look at the status bar \u2193", "t-muted");
    } },
    emacs: { hidden: true, run() {
      row("this is a vim household.", "t-muted");
    } },
    ":q": { hidden: true, run() {
      row("E37: No write since last change (add ! to override)", "t-err");
    } },
    ":q!": { hidden: true, run() {
      row([span("nice. but you can\u2019t leave yet. try "), span("contact", "t-accent")], "t-muted");
    } },
    hello: { hidden: true, run() {
      row([span("hey there \u{1F44B} type "), span("help", "t-accent"), span(" to look around.")]);
    } },
    coffee: { hidden: true, run() {
      row("\u2615 brewing\u2026 error 418: I\u2019m a teapot.", "t-warn");
    } }
  };
  commands.hi = commands.hello;
  commands.vi = commands.vim;
  commands.nano = commands.vim;
  function exec(raw) {
    const line = raw.trim();
    row([promptSpan(), span(line)]);
    if (line) history.push(line);
    hIndex = history.length;
    if (!line) return;
    const [name, ...args] = line.split(/\s+/);
    const cmd = commands[name.toLowerCase()];
    if (cmd) cmd.run(args);
    else {
      row(`mohit-sh: command not found: ${name}`, "t-err");
      row([span("type "), span("help", "t-accent"), span(" for a list of commands")], "t-muted");
    }
    scrollDown();
  }
  function complete() {
    const value = input.value;
    const parts = value.split(/\s+/);
    let pool;
    if (parts.length <= 1) pool = Object.keys(commands).filter((n) => !commands[n].hidden);
    else if (parts[0] === "cat") pool = [...Object.keys(PROJECT_FILES), ...Object.keys(PAPER_FILES), "about.txt", "resume.pdf"];
    else if (parts[0] === "cd" || parts[0] === "ls") pool = SECTIONS;
    else if (parts[0] === "theme") pool = ["light", "dark"];
    else return;
    const last = parts[parts.length - 1];
    const matches = pool.filter((p) => p.startsWith(last));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      input.value = parts.join(" ") + (parts.length === 1 ? " " : "");
    } else if (matches.length > 1) {
      row([promptSpan(), span(value)]);
      row(matches.join("  "), "t-muted");
    }
  }
  const onSubmit = (e) => {
    e.preventDefault();
    exec(input.value);
    input.value = "";
  };
  const onKey = (e) => {
    const key = e.key.toLowerCase();
    if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      if (!history.length) return;
      e.preventDefault();
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      hIndex = Math.min(history.length, hIndex + 1);
      input.value = history[hIndex] || "";
    } else if (key === "l" && e.ctrlKey) {
      e.preventDefault();
      out.textContent = "";
    } else if (key === "c" && e.ctrlKey && !String(window.getSelection() || "")) {
      e.preventDefault();
      row([promptSpan(), span(input.value + "^C")]);
      input.value = "";
    }
  };
  const onBodyClick = (e) => {
    if (e.target.closest("a") || String(window.getSelection() || "")) return;
    input.focus({ preventScroll: true });
  };
  const onSuggest = (e) => {
    const btn = e.target.closest("button[data-cmd]");
    if (btn?.dataset.cmd) exec(btn.dataset.cmd);
  };
  form.addEventListener("submit", onSubmit);
  input.addEventListener("keydown", onKey);
  body.addEventListener("click", onBodyClick);
  suggest.addEventListener("click", onSuggest);
  out.textContent = "";
  row("mohit-sh 2.0.0 (tty1)", "t-muted");
  row([span("Welcome! Type "), span("help", "t-accent"), span(" to see what I can do, or try "), span("sudo hire mohit", "t-accent"), span(".")]);
  gap();
  return () => {
    timers.forEach(clearTimeout);
    form.removeEventListener("submit", onSubmit);
    input.removeEventListener("keydown", onKey);
    body.removeEventListener("click", onBodyClick);
    suggest.removeEventListener("click", onSuggest);
  };
}

// lib/theme.ts
function getTheme() {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
function setTheme(next) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
  }
}

// components/Terminal.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var SUGGESTIONS = ["help", "whoami", "projects", "papers", "cat recall-ai.md", "ping mohit", "sudo hire mohit", "matrix"];
function Terminal() {
  const body = (0, import_react.useRef)(null);
  const out = (0, import_react.useRef)(null);
  const form = (0, import_react.useRef)(null);
  const input = (0, import_react.useRef)(null);
  const prompt = (0, import_react.useRef)(null);
  const suggest = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    if (!body.current || !out.current || !form.current || !input.current || !prompt.current || !suggest.current) return;
    return initTerminal({
      body: body.current,
      out: out.current,
      form: form.current,
      input: input.current,
      prompt: prompt.current,
      suggest: suggest.current,
      getTheme,
      setTheme,
      navigate(id) {
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        if (id === "top") window.scrollTo({ top: 0, behavior });
        else document.getElementById(id)?.scrollIntoView({ behavior });
      }
    });
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "terminal reveal", id: "terminal", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "terminal__bar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "visitor@mohit: ~ (mohit-sh)" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "terminal__body", ref: body, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "terminal__out", ref: out, "aria-live": "polite" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { className: "terminal__line", ref: form, autoComplete: "off", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "terminal__prompt", ref: prompt, htmlFor: "term-input", children: "visitor@mohit:~$" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "input",
            {
              className: "terminal__input",
              id: "term-input",
              ref: input,
              type: "text",
              spellCheck: false,
              autoCapitalize: "off",
              autoComplete: "off",
              enterKeyHint: "send"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "term-suggest reveal", ref: suggest, "aria-label": "Suggested commands", children: SUGGESTIONS.map((cmd) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", "data-cmd": cmd, children: cmd }, cmd)) })
  ] });
}

// components/CodeCard.tsx
var import_react2 = require("react");

// lib/text-effects.ts
function typeCode(code, pre, posEl) {
  const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
  const parts = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent) parts.push({ node, text: node.textContent });
  }
  pre.style.minHeight = pre.offsetHeight + "px";
  parts.forEach((p) => {
    p.node.textContent = "";
  });
  let pi = 0;
  let ci = 0;
  let line = 1;
  let col = 1;
  let timer = 0;
  function tick() {
    for (let k = 0; k < 3 && pi < parts.length; k++) {
      const p = parts[pi];
      const ch = p.text[ci++];
      p.node.textContent += ch;
      if (ch === "\n") {
        line++;
        col = 1;
      } else {
        col++;
      }
      if (ci >= p.text.length) {
        pi++;
        ci = 0;
      }
    }
    posEl.textContent = `Ln ${line}, Col ${col}`;
    if (pi < parts.length) timer = window.setTimeout(tick, 16);
  }
  tick();
  return () => {
    clearTimeout(timer);
    parts.forEach((p) => {
      p.node.textContent = p.text;
    });
  };
}

// components/CodeCard.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function CodeCard() {
  const pre = (0, import_react2.useRef)(null);
  const code = (0, import_react2.useRef)(null);
  const pos = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancel = () => {
    };
    const off = onIntroDone(() => {
      if (pre.current && code.current && pos.current) cancel = typeCode(code.current, pre.current, pos.current);
    });
    return () => {
      off();
      cancel();
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "code-card", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "code-card__bar", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { children: "mohit.ts" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("pre", { className: "code", ref: pre, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("code", { ref: code, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "c", children: "// compiled from 2 years of shipping" }),
      "\n",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "k", children: "const" }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "v", children: "mohit" }),
      ": ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "t", children: "Engineer" }),
      " = {\n",
      "  role: ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Full-Stack Engineer"' }),
      ",\n",
      "  now: ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Gabriel AI"' }),
      ",\n",
      "  based: ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Phoenix, AZ"' }),
      ",\n",
      "  mobile: [",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Kotlin"' }),
      ", ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Compose"' }),
      ", ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"React Native"' }),
      "],\n",
      "  web: [",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"React"' }),
      ", ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Next.js"' }),
      ", ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Express"' }),
      "],\n",
      "  data: [",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Postgres"' }),
      ", ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Room"' }),
      ", ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Supabase"' }),
      "],\n",
      "  ai: [",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"Gemini"' }),
      ", ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"ReAct agents"' }),
      ", ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"SSE"' }),
      "],\n",
      "  openToChat: ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "k", children: "true" }),
      ",\n};\n\n",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "k", children: "await" }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "v", children: "mohit" }),
      ".",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "f", children: "ship" }),
      "(",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "s", children: '"next big thing"' }),
      ");",
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "caret" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "code-card__foot", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "foot-dot" }),
        "TypeScript"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { ref: pos, children: "Ln 13, Col 38" })
    ] })
  ] });
}

// brag-output/work/export-source.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var source = {
  terminal: (0, import_server.renderToStaticMarkup)(/* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Terminal, {})),
  code: (0, import_server.renderToStaticMarkup)(/* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CodeCard, {})),
  profile,
  projects
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  source
});
