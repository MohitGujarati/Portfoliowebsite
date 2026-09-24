import { absolute, awards, education, experience, papers, plain, profile, projects, skills } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const document = {
    schemaVersion: '1.0',
    type: 'professional-profile',
    name: profile.name,
    role: profile.role,
    company: profile.company,
    location: profile.location,
    summary: profile.summary,
    contact: {
      email: profile.email,
      linkedin: profile.linkedin,
      github: profile.github,
      portfolio: absolute('/'),
      resume: absolute(profile.resume),
    },
    skills: Object.fromEntries(skills.map((group) => [group.group, group.items])),
    experience: experience.map((job) => ({
      id: job.hash,
      role: job.role,
      company: job.company,
      startDate: job.start,
      endDate: job.end || null,
      dates: job.dates,
      summary: job.points.map(plain),
      technologies: job.tags,
      url: absolute(`/experience#role-${job.hash}`),
    })),
    projects: projects.map((project) => ({
      slug: project.slug,
      name: project.name,
      category: project.kind,
      dates: project.dates,
      summary: project.pitch,
      details: project.points.map(plain),
      technologies: project.tags,
      url: absolute(`/projects/${project.slug}`),
    })),
    research: papers.map((paper) => ({
      slug: paper.slug,
      title: paper.title,
      type: paper.kind,
      venue: paper.venue,
      year: paper.year,
      coAuthored: Boolean(paper.coAuthored),
      result: paper.result || null,
      abstract: paper.abstract,
      topics: paper.tags,
      page: absolute(`/research#paper-${paper.slug}`),
      pdf: absolute(paper.file),
    })),
    education,
    awards,
    machineReadableSources: {
      summary: absolute('/llms.txt'),
      full: absolute('/llms-full.txt'),
    },
  };

  return new Response(JSON.stringify(document, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}