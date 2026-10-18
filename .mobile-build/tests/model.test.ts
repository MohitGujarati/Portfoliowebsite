import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProjects, parsePortfolio, terminalCommand } from '../src/data/model';
import { fixture } from './fixture';

test('accepts valid API data and database end_date fields', () => {
  assert.ok(parsePortfolio(fixture));
  const data = structuredClone(fixture);
  Object.assign(data.experience[0], { end_date: null });
  assert.ok(parsePortfolio(data));
});
test('rejects missing, empty, malformed and duplicate API records', () => {
  for (const invalid of [
    null,
    [],
    {},
    { ...fixture, profile: null },
    { ...fixture, projects: [] },
    { ...fixture, skills: [{ group: 'web', items: 'React' }] },
    { ...fixture, projects: [fixture.projects[0], fixture.projects[0]] },
    { ...fixture, experience: [{ ...fixture.experience[0], points: null }] },
  ]) {
    assert.equal(parsePortfolio(invalid), null);
  }
});
test('search combines category, case-insensitive text and bookmarks', () => {
  assert.deepEqual(
    filterProjects(fixture.projects, '  SUPABASE ', 'Mobile').map((p) => p.slug),
    ['shop-circle'],
  );
  assert.deepEqual(
    filterProjects(fixture.projects, '', 'Web').map((p) => p.slug),
    ['lummina'],
  );
  assert.equal(filterProjects(fixture.projects, '', 'All', true, []).length, 0);
  assert.deepEqual(
    filterProjects(fixture.projects, '', 'AI', true, ['recall-ai']).map((p) => p.slug),
    ['recall-ai'],
  );
  assert.equal(filterProjects(fixture.projects, 'unmatched technology', 'All').length, 0);
});
test('terminal uses current portfolio content and supports navigation and clear', () => {
  assert.match(terminalCommand('WHOAMI', fixture).output, /Mohit Gujarati/);
  assert.equal(terminalCommand('projects', fixture).tab, 'Work');
  assert.equal(terminalCommand('experience', fixture).tab, 'Journey');
  assert.equal(terminalCommand('research', fixture).tab, 'Research');
  assert.equal(terminalCommand('contact', fixture).tab, 'Connect');
  assert.equal(terminalCommand('clear', fixture).clear, true);
  assert.equal(terminalCommand('   ', fixture).output, '');
  assert.match(terminalCommand('rm -rf /', fixture).output, /Command not found/);
});
