-- 1. Profile Table
CREATE TABLE IF NOT EXISTS "Profile" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "role" TEXT,
  "company" TEXT,
  "location" TEXT,
  "email" TEXT,
  "github" TEXT,
  "linkedin" TEXT,
  "resume" TEXT,
  "summary" TEXT,
  "short" TEXT
);

INSERT INTO "Profile" ("name", "role", "company", "location", "email", "github", "linkedin", "resume", "summary", "short") VALUES
('Mohit Gujarati', 'Full-Stack Software Engineer', 'Gabriel AI', 'Phoenix, AZ', 'mohitgujarati11@gmail.com', 'https://github.com/MohitGujarati', 'https://www.linkedin.com/in/mohitgujarati/', '/Mohit_Gujarati_Resume.pdf', 'Full-stack software engineer with 3+ years of professional experience building mobile and web apps with Kotlin, React Native, React and Next.js. I build data layers (Room, AWS, Supabase, Firebase), integrate REST APIs, and develop AI products, from streaming Gemini pipelines to voice calling workflows.', 'Full-stack software engineer building mobile, web and AI products with Kotlin, React Native, React and Next.js.');


-- 2. Experience Table
CREATE TABLE IF NOT EXISTS "Experience" (
  "id" SERIAL PRIMARY KEY,
  "hash" TEXT,
  "ref" TEXT,
  "head" BOOLEAN,
  "role" TEXT,
  "company" TEXT,
  "start" TEXT,
  "end_date" TEXT,
  "dates" TEXT,
  "points" TEXT[],
  "tags" TEXT[]
);

INSERT INTO "Experience" ("hash", "ref", "head", "role", "company", "start", "end_date", "dates", "points", "tags") VALUES
('a7c3e19', 'HEAD → main', true, 'Full-Stack Engineer', 'Gabriel AI', '2026-08', NULL, 'Aug 2026 – Present', ARRAY['Led the migration of the customer-facing marketing site from a client-rendered React app to a **Next.js static export** (19 routes plus a CMS-driven blog). Lighthouse SEO went from unmeasurable to **100 on every page**, image payload dropped by **86%**, and all content became crawlable by search engines and AI bots for the first time.', 'Deployed on AWS Amplify with build config and env management, plus a one-command audit script (crawlability, structured data, sitemap, Lighthouse) that has to pass before each release.', 'Build and ship features across the platform: the dashboard and web app front end, back-end APIs and database logic, and AI voice calling workflows, with integrations for HubSpot, lead sources, Contentful, GA4 and Cloudflare Turnstile.', 'Own code quality end to end: tested code, debugging across the stack, and code reviews and planning with product, design and marketing.'], ARRAY['Next.js', 'React', 'AWS Amplify', 'HubSpot', 'Contentful', 'GA4']),
('4f2b8d0', 'tag: tnm-software', false, 'Software Engineer', 'TNM Software Solutions', '2023-05', '2024-06', 'May 2023 – Jun 2024', ARRAY['Cut device power consumption by **30% fleet-wide** by building battery-efficient location services in Kotlin, using the Google Geofencing API and motion sensors to reduce GPS polling.', 'Improved app performance by **50%** and removed UI-thread bottlenecks by refactoring the legacy codebase to MVVM with Kotlin Coroutines for non-blocking I/O.', 'Shipped production Android and web apps from scratch, working in daily stand-ups and weekly sprints with the backend and QA teams.'], ARRAY['Kotlin', 'Android', 'Geofencing API', 'MVVM', 'Coroutines']),
('e91c5a7', 'tag: v1.0-first-job', false, 'Android Developer Trainee', 'Tops Technology Inc.', '2022-05', '2023-05', 'May 2022 – May 2023', ARRAY['Built and released user-facing features with Android UI components and Material Design in Kotlin, and published them to the Google Play Store.', 'Designed normalized Room/SQLite schemas that sped up queries and made offline-first data sync reliable.', 'Structured MVVM repositories with clear UI, domain and data layers, integrating REST APIs through Retrofit, Coroutines and LiveData.'], ARRAY['Kotlin', 'Room', 'SQLite', 'Retrofit', 'Material Design']);


-- 3. Education Table
CREATE TABLE IF NOT EXISTS "Education" (
  "id" SERIAL PRIMARY KEY,
  "degree" TEXT,
  "school" TEXT,
  "place" TEXT,
  "dates" TEXT,
  "note" TEXT,
  "description" TEXT,
  "subjects" TEXT[]
);

INSERT INTO "Education" ("degree", "school", "place", "dates", "note", "description", "subjects") VALUES
('M.S. in Computer Science', 'Long Island University', 'Brooklyn, NY', 'Sep 2024 – May 2026', 'GPA 3.9 / 4.0', 'Conducted extensive literature review on AI, ML, DL, and software development research papers, applying findings to a comprehensive project. Presented the project for professorial review and synthesized the outcomes into a detailed IEEE-formatted research report.', ARRAY['System Design', 'DSA', 'Full Stack Web Development']),
('B.Tech in Computer Engineering', 'Shankersinh Vaghela Institute of Technology', 'Gujarat, India', 'Aug 2016 – Sep 2020', NULL, NULL, ARRAY['Engineering Maths', 'OS', 'Java', 'DSA', 'Computer Networks']);


-- 4. Skills Table
CREATE TABLE IF NOT EXISTS "Skills" (
  "id" SERIAL PRIMARY KEY,
  "group" TEXT,
  "items" TEXT[]
);

INSERT INTO "Skills" ("group", "items") VALUES
('languages', ARRAY['Kotlin', 'TypeScript', 'JavaScript', 'Java', 'Python', 'SQL']),
('mobile', ARRAY['Jetpack Compose', 'Android SDK', 'React Native', 'Expo', 'Coroutines', 'Flow / StateFlow', 'LiveData', 'Hilt', 'Retrofit']),
('web', ARRAY['React 19', 'Next.js (App Router)', 'MUI', 'Framer Motion', 'Express.js', 'REST APIs', 'WebSocket', 'SSE']),
('data-cloud', ARRAY['PostgreSQL', 'Supabase', 'SQLite', 'Room', 'Firebase', 'Google Cloud', 'AWS Amplify']),
('ai', ARRAY['Gemini API', 'Gemini Live', 'ReAct agents', 'Structured outputs', 'Voice AI workflows']),
('practices', ARRAY['MVVM', 'Clean Architecture', 'Offline-first', 'Dependency Injection', 'GitHub Actions CI/CD', 'Agile / Scrum']);


-- 5. Disable Row Level Security (RLS) so the frontend can read the data freely
ALTER TABLE "Profile" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Experience" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Education" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Skills" DISABLE ROW LEVEL SECURITY;
