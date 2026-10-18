import { Platform, Pressable, View, useWindowDimensions } from 'react-native';
import { Button, Card, Icon, IconButton, Txt, styles as ui } from '../components/UI';
import { type Portfolio, type Tab } from '../data/model';
import { papers } from '../data/research';
import { fonts, useTheme } from '../theme';
import { ProjectCard, TextDot } from './common';
import { s } from './styles';
import type { Project } from './types';

export function Home({
  data,
  go,
  openProject,
  openTerminal,
  resume,
  busy,
}: {
  data: Portfolio;
  go: (tab: Tab) => void;
  openProject: (p: Project) => void;
  openTerminal: () => void;
  resume: () => void;
  busy: boolean;
}) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  return (
    <View style={{ gap: 28 }}>
      <View style={{ gap: 21 }}>
        <View style={ui.row}>
          <View style={[s.dot, { backgroundColor: t.accent }]} />
          <Txt mono muted style={{ fontSize: 10 }}>
            {' '}
            {data.profile.company} / {data.profile.location}
          </Txt>
        </View>
        <View>
          <Txt mono style={{ color: t.accent, fontSize: 11, marginBottom: 10 }}>
            HELLO WORLD, I'M
          </Txt>
          <Txt
            accessibilityRole="header"
            style={{
              fontFamily: fonts.bold,
              fontSize: width < 370 ? 43 : 51,
              lineHeight: width < 370 ? 47 : 56,
              letterSpacing: -2,
            }}
          >
            {data.profile.name}
            <TextDot />
          </Txt>
        </View>
        <Txt style={{ fontSize: 31, lineHeight: 38, letterSpacing: -0.8 }}>
          I build{' '}
          <Txt
            style={{
              color: t.accent,
              fontSize: 32,
              lineHeight: 38,
              fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
              fontStyle: 'italic',
            }}
          >
            things
          </Txt>
          {'\n'}that ship.
        </Txt>
        <Txt muted style={{ maxWidth: 540 }}>
          {data.profile.short}
        </Txt>
        <View style={ui.wrap}>
          <Button label="Explore my work" icon="arrow-up-right" onPress={() => go('Work')} />
          <Button label="Résumé" icon="download" onPress={resume} disabled={busy} secondary />
        </View>
      </View>
      <View style={[s.codeCard, { backgroundColor: t.surface, borderColor: t.line }]}>
        <View style={[s.codeBar, { borderBottomColor: t.line }]}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {['#ee7669', '#e6b75f', '#91c965'].map((color) => (
              <View key={color} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
            ))}
          </View>
          <Txt mono muted style={{ fontSize: 10 }}>
            mohit.ts
          </Txt>
          <Icon name="code" size={14} color={t.muted} />
        </View>
        <View style={{ padding: 19, gap: 5 }}>
          <Txt mono muted style={{ fontSize: 10 }}>
            // ideas → thoughtful software
          </Txt>
          <Txt mono>
            <Txt mono style={{ color: t.pink }}>
              const
            </Txt>{' '}
            mohit = {'{'}
          </Txt>
          <CodeLine name="role" value="Full-Stack Engineer" />
          <CodeLine name="building" value="mobile · web · AI" />
          <CodeLine name="based" value={data.profile.location} />
          <Txt mono>
            {'  '}openToChat:{' '}
            <Txt mono style={{ color: t.accent }}>
              true
            </Txt>
            ,
          </Txt>
          <Txt mono>{'};'}</Txt>
          <View style={{ height: 5 }} />
          <Txt mono>
            <Txt mono style={{ color: t.pink }}>
              await
            </Txt>{' '}
            mohit.
            <Txt mono style={{ color: t.blue }}>
              ship
            </Txt>
            ();
            <Txt mono style={{ color: t.accent }}>
              {' '}
              ▌
            </Txt>
          </Txt>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try the interactive terminal"
          onPress={openTerminal}
          style={[s.codeBar, { borderTopColor: t.line, borderTopWidth: 1, borderBottomWidth: 0 }]}
        >
          <View style={ui.row}>
            <Icon name="terminal" size={14} color={t.accent} />
            <Txt mono style={{ color: t.accent, fontSize: 10 }}>
              Try the interactive terminal
            </Txt>
          </View>
          <Icon name="arrow-right" size={14} color={t.accent} />
        </Pressable>
      </View>
      <View style={[s.stats, { borderColor: t.line }]}>
        {[
          { value: String(data.projects.length).padStart(2, '0'), label: 'FEATURED BUILDS' },
          { value: String(papers.length).padStart(2, '0'), label: 'RESEARCH PAPERS' },
          { value: '3', label: 'MOBILE · WEB · AI' },
        ].map((stat, i) => (
          <View key={stat.label} style={[s.stat, i > 0 && { borderLeftWidth: 1, borderLeftColor: t.line }]}>
            <Txt style={{ fontSize: 28, lineHeight: 34, fontFamily: fonts.bold }}>
              {stat.value}
              <Txt style={{ color: t.accent }}>.</Txt>
            </Txt>
            <Txt mono muted style={{ fontSize: 8, lineHeight: 14, textAlign: 'center' }}>
              {stat.label}
            </Txt>
          </View>
        ))}
      </View>
      <View style={{ gap: 15 }}>
        <View style={ui.between}>
          <View>
            <Txt mono style={{ color: t.accent, fontSize: 10 }}>
              01 / SELECTED WORK
            </Txt>
            <Txt accessibilityRole="header" style={s.sectionTitle}>
              From idea to shipped.
            </Txt>
          </View>
          <IconButton icon="arrow-right" label="View all projects" onPress={() => go('Work')} />
        </View>
        {data.projects.slice(0, 2).map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} open={() => openProject(p)} />
        ))}
      </View>
      <Card style={{ backgroundColor: t.soft }}>
        <View style={ui.row}>
          <Icon name="git-branch" color={t.accent} />
          <Txt mono style={{ color: t.accent, fontSize: 10 }}>
            CURRENT CHAPTER
          </Txt>
        </View>
        <Txt style={{ fontFamily: fonts.bold, fontSize: 24, lineHeight: 29 }}>{data.profile.company}</Txt>
        <Txt muted>
          {data.profile.role} · {data.profile.location}
        </Txt>
        <Button label="Follow my journey" secondary icon="arrow-right" onPress={() => go('Journey')} />
      </Card>
    </View>
  );
}

export function CodeLine({ name, value }: { name: string; value: string }) {
  const t = useTheme();
  return (
    <Txt mono>
      {'  '}
      {name}:{' '}
      <Txt mono style={{ color: t.amber }}>
        "{value}"
      </Txt>
      ,
    </Txt>
  );
}
