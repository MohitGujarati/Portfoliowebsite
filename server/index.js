require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

for (const name of ['SUPABASE_URL', 'SUPABASE_ANON_KEY']) {
  if (!process.env[name]) throw new Error(`${name} is required`);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '32kb' }));

app.get('/', (req, res) => {
  res.json({ service: 'Mohit portfolio API', status: 'ok' });
});

const resources = {
  projects: 'Project',
  profile: 'Profile',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
};

async function readResource(name) {
  const { data, error } = await supabase.from(resources[name]).select('*');
  if (error) throw error;
  if (name === 'profile') {
    if (!data?.[0]) throw new Error('Profile record is missing');
    return data[0];
  }
  return data || [];
}

function apiError(res, resource, error) {
  console.error(`[api/${resource}]`, error instanceof Error ? error.message : error);
  res.status(500).json({ error: `Failed to fetch ${resource}` });
}

for (const name of Object.keys(resources)) {
  app.get(`/api/${name}`, async (_req, res) => {
    try {
      res.set('Cache-Control', 'no-store');
      res.json(await readResource(name));
    } catch (error) {
      apiError(res, name, error);
    }
  });
}

app.get('/api/portfolio', async (_req, res) => {
  try {
    const names = Object.keys(resources);
    const values = await Promise.all(names.map(readResource));
    res.set('Cache-Control', 'no-store');
    res.json(Object.fromEntries(names.map((name, index) => [name, values[index]])));
  } catch (error) {
    apiError(res, 'portfolio', error);
  }
});

app.get('/health', async (_req, res) => {
  try {
    const { error } = await supabase.from('Profile').select('name').limit(1);
    if (error) throw error;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    apiError(res, 'health', error);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Portfolio API listening on http://${HOST}:${PORT}`);
});
