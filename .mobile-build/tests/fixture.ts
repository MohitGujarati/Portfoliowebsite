import type { Portfolio } from '../src/data/model';

export const fixture: Portfolio = {
  profile: {
    name: 'Mohit Gujarati',
    role: 'Full-Stack Software Engineer',
    company: 'Gabriel AI',
    location: 'Phoenix, AZ',
    email: 'mohit@example.com',
    github: 'https://github.com/MohitGujarati',
    linkedin: 'https://linkedin.com/in/mohit',
    resume: '/resume.pdf',
    summary: 'Engineer summary',
    short: 'Engineer short bio',
  },
  projects: [
    {
      slug: 'shop-circle',
      name: 'Shop Circle',
      kind: 'Social commerce · Mobile',
      dates: '2026',
      pitch: 'React Native app with Supabase.',
      points: ['Built mobile app.'],
      tags: ['React Native', 'Supabase'],
    },
    {
      slug: 'lummina',
      name: 'Lummina',
      kind: 'Web platform',
      dates: '2026',
      pitch: 'React 19 web learning platform.',
      points: ['Built web app.'],
      tags: ['React 19', 'Express.js'],
    },
    {
      slug: 'recall-ai',
      name: 'Recall AI',
      kind: 'AI · Mobile',
      dates: '2025',
      pitch: 'Gemini learning assistant.',
      points: ['Built AI app.'],
      tags: ['Kotlin', 'Gemini'],
    },
  ],
  experience: [
    {
      hash: 'abc123',
      ref: 'HEAD → main',
      head: true,
      role: 'Engineer',
      company: 'Gabriel AI',
      start: '2026-08',
      dates: 'Aug 2026 – Present',
      points: ['Shipped products.'],
      tags: ['React'],
    },
  ],
  education: [
    {
      degree: 'M.S. Computer Science',
      school: 'LIU',
      place: 'Brooklyn, NY',
      dates: '2024 – 2026',
      subjects: ['System Design'],
    },
  ],
  skills: [{ group: 'web', items: ['React', 'TypeScript'] }],
};
