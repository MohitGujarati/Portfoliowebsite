// schema.org structured data (JSON-LD) for search engines and AI crawlers.
import { absolute, awards, education, experience, papers, plain, profile, projects, skills } from './site';

export function buildJsonLd() {
  const personId = absolute('/#person');
  const siteId = absolute('/#website');
  const liu = { '@type': 'CollegeOrUniversity', name: 'Long Island University', address: 'Brooklyn, NY' };
  const svit = { '@type': 'CollegeOrUniversity', name: 'Shankersinh Vaghela Institute of Technology', address: 'Gujarat, India' };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': siteId,
        url: absolute('/'),
        name: profile.name,
        description: profile.short,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': absolute('/#profilepage'),
        url: absolute('/'),
        name: `${profile.name} | ${profile.role}`,
        isPartOf: { '@id': siteId },
        mainEntity: { '@id': personId },
        dateModified: new Date().toISOString(),
        inLanguage: 'en',
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: profile.name,
        givenName: 'Mohit',
        familyName: 'Gujarati',
        jobTitle: profile.role,
        description: profile.summary,
        url: absolute('/'),
        email: `mailto:${profile.email}`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'professional inquiries',
          email: profile.email,
          url: absolute('/#contact'),
        },
        address: { '@type': 'PostalAddress', addressLocality: 'Phoenix', addressRegion: 'AZ', addressCountry: 'US' },
        worksFor: { '@type': 'Organization', name: profile.company },
        alumniOf: [liu, svit],
        hasCredential: [
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: education[0].degree, recognizedBy: liu },
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: education[1].degree, recognizedBy: svit },
          { '@type': 'EducationalOccupationalCredential', credentialCategory: 'certificate', name: 'Kotlin Professional Certificate', recognizedBy: { '@type': 'Organization', name: 'JetBrains' } },
        ],
        award: awards,
        hasOccupation: {
          '@type': 'Occupation',
          name: profile.role,
          occupationLocation: { '@type': 'City', name: 'Phoenix, AZ' },
          skills: skills.flatMap((s) => s.items).join(', '),
        },
        knowsAbout: [
          'Full-stack web development', 'Android development', 'Mobile app development', 'Artificial intelligence',
          'Large language models', 'Search engine optimization', ...skills.flatMap((s) => s.items),
        ],
        sameAs: [profile.github, profile.linkedin],
      },
      ...experience.map((j) => ({
        '@type': 'OrganizationRole',
        '@id': absolute(`/experience#role-${j.hash}`),
        roleName: j.role,
        startDate: j.start,
        ...(j.end ? { endDate: j.end } : {}),
        description: j.points.map(plain).join(' '),
        memberOf: { '@id': personId },
        member: { '@type': 'Organization', name: j.company },
      })),
      ...projects.map((p) => ({
        '@type': 'CreativeWork',
        '@id': absolute(`/projects/${p.slug}`),
        name: p.name,
        genre: p.kind,
        description: `${p.pitch} ${p.points.map(plain).join(' ')}`,
        keywords: p.tags.join(', '),
        creator: { '@id': personId },
        url: absolute(`/projects/${p.slug}`),
      })),
      ...papers.map((p) => ({
        '@type': 'ScholarlyArticle',
        '@id': absolute(`/research#paper-${p.slug}`),
        headline: p.title.length > 110 ? `${p.title.slice(0, 107)}…` : p.title,
        name: p.title,
        abstract: p.abstract,
        author: { '@id': personId },
        datePublished: p.year,
        keywords: p.tags.join(', '),
        inLanguage: 'en',
        isAccessibleForFree: true,
        encodingFormat: 'application/pdf',
        url: absolute(p.file),
        sourceOrganization: liu,
      })),
    ],
  };
}

/** Serialize safely for an inline <script> tag. */
export const serializeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
export const jsonLdString = () => serializeJsonLd(buildJsonLd());

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function contactPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': absolute('/about#contact'),
    url: absolute('/about#contact'),
    name: `Contact ${profile.name}`,
    description: `Professional contact information for ${profile.name}.`,
    mainEntity: { '@id': absolute('/#person') },
  };
}

export function experiencePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': absolute('/experience'),
    url: absolute('/experience'),
    name: `${profile.name} | Experience`,
    description: `Professional experience of ${profile.name}.`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: experience.map((job, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: `${job.role} at ${job.company}`,
        url: absolute(`/experience#role-${job.hash}`),
      })),
    },
  };
}

export function researchPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': absolute('/research'),
    url: absolute('/research'),
    name: `${profile.name} | Research`,
    description: `Research papers and technical reviews by ${profile.name}.`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: papers.map((paper, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: paper.title,
        url: absolute(`/research#paper-${paper.slug}`),
      })),
    },
  };
}
