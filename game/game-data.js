// =====================================================
//  MG26 GAME DATA — FIFA-style mappings for the portfolio
//  Content itself lives in js/data.js (single source of truth).
//  This file only adds game flavor: ratings, positions,
//  card tiers, ticker news, achievements and level curve.
// =====================================================

const GAME = {

  // ---------- The hero player card ----------
  player: {
    ovr: 94,
    pos: "SWE",
    posLong: "Software Engineer · Android / AI",
    club: "LIU BROOKLYN",
    nation: "IND",
    // 6 FUT-style attributes (3-letter code, value)
    stats: [
      ["KOT", 96],   // Kotlin
      ["AND", 95],   // Android
      ["AI",  92],   // AI / ML integration
      ["ARC", 91],   // Architecture
      ["DB",  88],   // Databases
      ["WEB", 85],   // Web
    ],
    // Konami-code unlockable
    icon: {
      ovr: 99,
      label: "ICON",
    },
  },

  // ---------- Project cards (keyed by PROJECTS[].name) ----------
  // tier: "gold" | "toty" | "hero" | "classified"
  projects: {
    "Recall AI": {
      ovr: 93, pos: "AND", tier: "toty",
      flavor: "Team of the Year material — realtime AI meeting assistant.",
      stats: [["UI", 95], ["AI", 93], ["ARC", 94], ["DAT", 91], ["NET", 88], ["UX", 92]],
    },
    "Lummina": {
      ovr: 91, pos: "AI", tier: "hero",
      flavor: "Multi-agent playmaker running a full RAG pipeline.",
      stats: [["AGT", 93], ["RAG", 92], ["SEC", 90], ["API", 89], ["DB", 91], ["UI", 87]],
    },
    "The Cognito Times": {
      ovr: 90, pos: "ML", tier: "gold",
      flavor: "Hybrid recommender with sub-200ms finishing.",
      stats: [["REC", 93], ["NLP", 91], ["LAT", 92], ["API", 90], ["OPS", 88], ["UI", 86]],
    },
    "Fleet Tracker": {
      ovr: 89, pos: "ENT", tier: "classified",
      flavor: "Enterprise defender. Files sealed by the club.",
      stats: [["GPS", 93], ["SEN", 90], ["ARC", 91], ["PRF", 90], ["SEC", 89], ["DB", 88]],
    },
  },
  projectDefaults: {
    ovr: 85, pos: "DEV", tier: "gold",
    flavor: "New signing — scouting report pending.",
    stats: [["TEC", 86], ["ARC", 85], ["UI", 84], ["DAT", 84], ["PRF", 85], ["DOC", 82]],
  },

  // ---------- Career mode (keyed by EXPERIENCE[].org) ----------
  careers: {
    "Long Island University, Brooklyn":            { season: "SEASON 24–26", form: 9.2, kind: "ACADEMY ELITE" },
    "TNM Software Solutions Pvt Ltd.":             { season: "SEASON 23–24", form: 8.8, kind: "FIRST TEAM" },
    "Tops Technology Inc.":                        { season: "SEASON 22–23", form: 8.1, kind: "YOUTH SQUAD" },
    "Shankersinh Vaghela Institute of Technology": { season: "SEASON 16–20", form: 7.9, kind: "ACADEMY" },
  },
  careerDefault: { season: "SEASON", form: 8.0, kind: "SQUAD" },

  // ---------- Skill ratings (keyed by tag; default below) ----------
  skillRatings: {
    "Kotlin": 96, "Java": 88, "Python": 90, "JavaScript": 85, "TypeScript": 80, "C++": 75,
    "Jetpack Compose": 95, "Coroutines": 93, "Retrofit": 90, "Room DB": 91, "Room": 91,
    "Flow": 92, "MVVM": 92, "Hilt": 89,
    "HTML5": 88, "CSS3": 86, "React": 84,
    "Generative AI": 92, "LLM Integration": 92, "NLP": 88, "RAG": 91, "Semantic Search": 89,
    "Hugging Face Transformers": 87, "OpenAI / Google Gemini API": 93,
    "Firebase": 90, "MySQL": 85, "SQLite": 88, "MongoDB": 78, "Supabase": 87,
    "Git/GitHub": 92, "Android Studio": 95, "Rest APIs": 91, "MVVM, MVP": 92,
    "SOLID Principles": 90, "Material Design": 91, "Coroutines, Thread": 91, "Postman": 88,
  },
  skillDefault: 82,

  // ---------- Broadcast ticker ----------
  ticker: [
    "BREAKING&nbsp;— Gujarati delivers 4 production apps in a single 8-month season at TNM",
    "PERFORMANCE&nbsp;— +50% boost after switching to modern architecture",
    "TRANSFER WINDOW&nbsp;— Open to roles starting Mid-June 2026",
    "RESEARCH&nbsp;— 99.2% external validation accuracy on Parkinson's detection framework",
    "SQUAD NEWS&nbsp;— Recall AI streams live transcription with Kotlin Coroutines + Gemini",
    "STAT LINE&nbsp;— The Cognito Times serves personalised feeds in under 200ms",
    "ACADEMY&nbsp;— M.S. Computer Engineering @ LIU Brooklyn, Class of 2026",
    "SCOUTS SAY&nbsp;— strong left foot, stronger unit tests",
  ],

  // ---------- Gamification ----------
  xp: {
    boot: 100,          // first kick off
    section: 50,        // first visit to each section
    projectView: 25,    // open a project card
    packOpen: 75,       // open a pack
    resume: 150,        // download scouting report
    contact: 200,       // start contract talks
    konami: 500,        // unlock the icon card
  },
  levels: [
    { at: 0,    name: "ACADEMY PROSPECT" },
    { at: 150,  name: "YOUTH SQUAD" },
    { at: 400,  name: "FIRST TEAM" },
    { at: 800,  name: "STAR PLAYER" },
    { at: 1300, name: "CLUB LEGEND" },
    { at: 1650, name: "ICON" },   // = 100% completion of everything
  ],
  achievements: {
    kickoff:   { icon: "fa-flag-checkered", title: "KICK OFF",           desc: "Started the MG26 experience" },
    scout:     { icon: "fa-binoculars",     title: "FULL SQUAD REPORT",  desc: "Viewed every project card" },
    packRat:   { icon: "fa-gift",           title: "PACK ANIMAL",        desc: "Opened every project pack" },
    scouted:   { icon: "fa-file-arrow-down",title: "SCOUTED",            desc: "Downloaded the scouting report" },
    talks:     { icon: "fa-handshake",      title: "CONTRACT TALKS",     desc: "Opened contract negotiations" },
    icon:      { icon: "fa-crown",          title: "ICON UNLOCKED",      desc: "Some codes never die" },
    explorer:  { icon: "fa-map",            title: "GROUNDHOPPER",       desc: "Visited every hub in the menu" },
  },
};
