import { fetchPortfolio } from '../src/data/api';

const baseUrl = process.argv[2] || process.env.EXPO_PUBLIC_API_URL;
if (!baseUrl) {
  console.error('Usage: npm run check:data -- http://YOUR_API_HOST:5000');
  process.exit(1);
}

async function main() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const data = await fetchPortfolio(baseUrl!, controller.signal);
    console.log(
      JSON.stringify(
        {
          api: baseUrl,
          profile: data.profile.name,
          projects: data.projects.length,
          experience: data.experience.length,
          education: data.education.length,
          skillGroups: data.skills.length,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    clearTimeout(timeout);
  }
}

void main();
