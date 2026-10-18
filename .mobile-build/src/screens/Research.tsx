import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Card, Heading, Icon, Tags, Txt, styles as ui } from '../components/UI';
import { papers, type Paper } from '../data/research';
import { fonts, useTheme } from '../theme';
import { Chip } from './common';
import { s } from './styles';

export function Research({ open }: { open: (paper: Paper) => void }) {
  const t = useTheme();
  const [filter, setFilter] = useState('All');
  const shown = papers.filter(
    (p) => filter === 'All' || (filter === 'Research' ? p.kind === 'ieee' : p.kind === 'review'),
  );
  return (
    <View>
      <Heading
        number="03"
        command="open ~/research"
        title="Curiosity, documented."
        description="Exploring AI, deep learning, and the systems that make software work."
      />
      <View style={[ui.wrap, { marginBottom: 23 }]}>
        {['All', 'Research', 'Reviews'].map((f) => (
          <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(f)} />
        ))}
      </View>
      <View style={{ gap: 18 }}>
        {shown.map((p) => (
          <Pressable
            key={p.slug}
            accessibilityRole="button"
            accessibilityLabel={`Read ${p.title}`}
            onPress={() => open(p)}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Card>
              <View style={ui.between}>
                <View style={ui.row}>
                  <Icon name="file-text" color={t.accent} />
                  <Txt mono style={{ color: t.accent, fontSize: 10 }}>
                    {p.badge.toUpperCase()}
                  </Txt>
                </View>
                <Txt mono muted style={{ fontSize: 10 }}>
                  {p.year} ↗
                </Txt>
              </View>
              <Txt style={{ fontFamily: fonts.bold, fontSize: 21, lineHeight: 28 }}>{p.title}</Txt>
              <Txt muted style={{ fontSize: 12 }}>
                {p.venue}
              </Txt>
              {p.result && (
                <View style={[s.result, { backgroundColor: t.soft }]}>
                  <Txt style={{ color: t.accent, fontFamily: fonts.bold, fontSize: 25, lineHeight: 31 }}>
                    {p.result.value}
                  </Txt>
                  <Txt muted style={{ flex: 1, fontSize: 12, lineHeight: 18 }}>
                    {p.result.label}
                  </Txt>
                </View>
              )}
              <Tags items={p.tags.slice(0, 3)} />
              <Txt style={{ color: t.accent, fontSize: 12 }}>Read abstract & PDF →</Txt>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
