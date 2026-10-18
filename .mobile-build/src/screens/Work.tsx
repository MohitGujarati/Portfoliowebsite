import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Button, Card, Heading, Icon, IconButton, Txt, styles as ui } from '../components/UI';
import { categories, filterProjects, type Category } from '../data/model';
import { useTheme } from '../theme';
import { Chip, ProjectCard } from './common';
import { s } from './styles';
import type { Project } from './types';

export function Work({
  projects,
  saved,
  bookmark,
  open,
}: {
  projects: Project[];
  saved: string[];
  bookmark: (slug: string) => void;
  open: (p: Project) => void;
}) {
  const t = useTheme();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [savedOnly, setSavedOnly] = useState(false);
  const found = filterProjects(projects, query, category, savedOnly, saved);
  return (
    <View>
      <Heading
        number="01"
        command="ls ~/projects"
        title="Things I've built."
        description="Real products. Thoughtful engineering. From the first commit to the final release."
      />
      <View style={[s.search, { backgroundColor: t.surface, borderColor: t.line }]}>
        <Icon name="search" color={t.muted} size={18} />
        <TextInput
          accessibilityLabel="Search projects"
          placeholder="Search projects or technologies"
          placeholderTextColor={t.muted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          style={[s.input, { color: t.text }]}
        />
        {!!query && <IconButton icon="x" label="Clear search" onPress={() => setQuery('')} />}
      </View>
      <View style={[ui.between, { marginVertical: 16, alignItems: 'flex-start' }]}>
        <View style={[ui.wrap, { flex: 1 }]}>
          {categories.map((c) => (
            <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>
        <IconButton
          icon="bookmark"
          label={savedOnly ? 'Show all projects' : 'Show saved projects'}
          active={savedOnly}
          onPress={() => setSavedOnly((v) => !v)}
        />
      </View>
      <Txt mono muted style={{ fontSize: 10, marginBottom: 16 }}>
        {String(found.length).padStart(2, '0')} {savedOnly ? 'SAVED ' : ''}PROJECT{found.length === 1 ? '' : 'S'}
      </Txt>
      <View style={{ gap: 18 }}>
        {found.map((p) => (
          <ProjectCard
            key={p.slug}
            project={p}
            index={projects.indexOf(p)}
            open={() => open(p)}
            bookmark={() => bookmark(p.slug)}
            saved={saved.includes(p.slug)}
          />
        ))}
      </View>
      {!found.length && (
        <Card>
          <Icon name={savedOnly ? 'bookmark' : 'search'} color={t.accent} size={30} />
          <Txt style={s.sectionTitle}>{savedOnly ? 'A place for your favorites.' : 'No matching projects.'}</Txt>
          <Txt muted>
            {savedOnly
              ? 'Tap the bookmark on a project to keep it here.'
              : 'Try another technology, project name, or category.'}
          </Txt>
          <Button
            label="Reset filters"
            onPress={() => {
              setQuery('');
              setCategory('All');
              setSavedOnly(false);
            }}
            secondary
          />
        </Card>
      )}
    </View>
  );
}
