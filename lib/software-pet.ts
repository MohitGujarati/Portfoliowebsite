export const SOFTWARE_PET_ENABLED = true;

export const PET_SUGGESTIONS = [
  { label: 'See my work', href: '#projects' },
  { label: 'Read my experience', href: '/experience' },
  { label: 'Try the terminal', href: '#shell' },
  { label: 'Get in touch', href: '#contact' },
] as const;

export const PET_MOODS = ['idle', 'curious', 'happy', 'sleepy', 'asleep', 'held'] as const;
export type PetMood = (typeof PET_MOODS)[number];

export const PET_GREETINGS = [
  'Hi! I can show you around.',
  'Nice to meet you. Try a suggestion!',
  'Welcome to Mohit\'s portfolio.',
] as const;

export const PET_FACTS = [
  'Mohit cut fleet-wide device power use by 30% with Kotlin geofencing.',
  'His Parkinson\'s detection research reached 99.2% external validation accuracy.',
  'He builds mobile apps, web platforms, and AI voice workflows.',
  'He migrated a marketing site to Next.js static export with 100 Lighthouse SEO scores.',
  'When he is not coding, Mohit loves hiking and exploring national parks.',
  'He is a big fan of professional soccer and cricket.',
  'He is dedicated to fitness, regularly lifting weights.',
  'He makes excellent vegetarian Indian dishes like paneer, dal fry, and chole.',
  'He manages team squads in FC Mobile and enjoys tactical gaming in Valorant.',
  'He holds a Master of Science in Computer Science from Long Island University.',
  'He recently traded the East Coast for the desert, moving to Phoenix, Arizona.',
  'He engineers native Android applications using Kotlin, Jetpack Compose, and the Gemini API.',
  'He built Lummina, an interactive AI educational platform featuring a multi-agent orchestration loop.',
  'He stays engaged with the developer community, attending events like Google DevFest in NYC.'
] as const;

export const PET_ACTIONS = ['ball', 'stretch', 'dance', 'bounce'] as const;
export type PetAction = (typeof PET_ACTIONS)[number] | null;