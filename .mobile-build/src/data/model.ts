import { papers } from './research';

export type Profile = {
  name: string;
  role: string;
  company: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  summary: string;
  short: string;
};
export type Project = {
  slug: string;
  name: string;
  kind: string;
  dates: string;
  pitch: string;
  points: string[];
  tags: string[];
  github?: string;
  url?: string;
};
export type Experience = {
  hash: string;
  ref?: string;
  head?: boolean;
  role: string;
  company: string;
  start: string;
  end?: string;
  end_date?: string | null;
  dates: string;
  points: string[];
  tags: string[];
};
export type Education = {
  degree: string;
  school: string;
  place: string;
  dates: string;
  note?: string;
  description?: string;
  subjects: string[];
};
export type SkillGroup = { group: string; items: string[] };
export type Portfolio = {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
};
export const website = 'https://mohitgujarati.github.io';
export type Category = 'All' | 'Mobile' | 'Web' | 'AI';
export const categories: Category[] = ['All', 'Mobile', 'Web', 'AI'];
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every((s) => typeof s === 'string');
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const optionalText = (v: unknown) => v == null || typeof v === 'string';

/** Validate all API sections before replacing the last known good content. */
export function parsePortfolio(value: unknown): Portfolio | null {
  if (!record(value) || !record(value.profile)) return null;
  if (
    !['name', 'role', 'company', 'location', 'email', 'github', 'linkedin', 'resume', 'summary', 'short'].every((k) =>
      text(value.profile && (value.profile as Record<string, unknown>)[k]),
    )
  )
    return null;
  const lists = ['projects', 'experience', 'education', 'skills'] as const;
  if (!lists.every((k) => Array.isArray(value[k]) && value[k].length > 0)) return null;
  const unique = (items: unknown[], key: string) =>
    new Set(items.map((v) => (record(v) ? v[key] : null))).size === items.length;
  const projectList = value.projects as unknown[];
  const jobList = value.experience as unknown[];
  if (!unique(projectList, 'slug') || !unique(jobList, 'hash')) return null;
  if (
    !projectList.every(
      (p) =>
        record(p) &&
        ['slug', 'name', 'kind', 'dates', 'pitch'].every((k) => text(p[k])) &&
        strings(p.points) &&
        strings(p.tags) &&
        optionalText(p.github) &&
        optionalText(p.url),
    )
  )
    return null;
  if (
    !jobList.every(
      (j) =>
        record(j) &&
        ['hash', 'role', 'company', 'start', 'dates'].every((k) => text(j[k])) &&
        strings(j.points) &&
        strings(j.tags),
    )
  )
    return null;
  if (
    !(value.education as unknown[]).every(
      (e) =>
        record(e) &&
        ['degree', 'school', 'place', 'dates'].every((k) => text(e[k])) &&
        strings(e.subjects) &&
        optionalText(e.note) &&
        optionalText(e.description),
    )
  )
    return null;
  if (!(value.skills as unknown[]).every((s) => record(s) && text(s.group) && strings(s.items))) return null;
  return value as Portfolio;
}

export function filterProjects(
  items: Portfolio['projects'],
  query: string,
  category: Category,
  savedOnly = false,
  saved: string[] = [],
) {
  const q = query.trim().toLowerCase();
  return items.filter((p) => {
    const haystack = `${p.name} ${p.pitch} ${p.kind} ${p.tags.join(' ')}`.toLowerCase();
    const matchesCategory =
      category === 'All' ||
      (category === 'Mobile'
        ? /mobile|android|react native|kotlin/i.test(haystack)
        : category === 'Web'
          ? /web|react 19|next.js|express/i.test(haystack)
          : /\bai\b|gemini|learning/i.test(haystack));
    return matchesCategory && haystack.includes(q) && (!savedOnly || saved.includes(p.slug));
  });
}

export type Tab = 'Home' | 'Work' | 'Journey' | 'Research' | 'Connect';
export function terminalCommand(input: string, data: Portfolio): { output: string; tab?: Tab; clear?: boolean } {
  const cmd = input.trim().toLowerCase();
  if (cmd === 'clear') return { output: '', clear: true };
  if (cmd === 'help') return { output: 'whoami · projects · experience · skills\nresearch · contact · home · clear' };
  if (cmd === 'whoami')
    return { output: `${data.profile.name}\n${data.profile.role} @ ${data.profile.company}\n${data.profile.location}` };
  if (cmd === 'skills') return { output: data.skills.map((s) => `${s.group}: ${s.items.join(', ')}`).join('\n\n') };
  if (cmd === 'projects' || cmd === 'ls') return { output: data.projects.map((p) => p.name).join('\n'), tab: 'Work' };
  if (cmd === 'experience')
    return { output: data.experience.map((j) => `${j.company} · ${j.dates}`).join('\n'), tab: 'Journey' };
  if (cmd === 'research') return { output: `${papers.length} papers in the research library.`, tab: 'Research' };
  if (cmd === 'contact') return { output: data.profile.email, tab: 'Connect' };
  if (cmd === 'home') return { output: 'Returning home.', tab: 'Home' };
  return { output: cmd ? `Command not found: ${input.trim()}\nType help for available commands.` : '' };
}
