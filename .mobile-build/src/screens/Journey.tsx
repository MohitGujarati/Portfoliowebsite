import { useState } from 'react';
import { View } from 'react-native';
import { Card, Heading, Icon, RichText, Tags, Txt, styles as ui, type IconName } from '../components/UI';
import { type Portfolio } from '../data/model';
import { awards } from '../data/research';
import { fonts, useTheme } from '../theme';
import { Chip } from './common';
import { s } from './styles';

export function Journey({ data }: { data: Portfolio }) {
  const t = useTheme();
  const [section, setSection] = useState('Experience');
  return (
    <View>
      <Heading
        number="02"
        command="git log --graph"
        title="Always building."
        description="The people, places, and technologies behind my work."
      />
      <View style={[ui.wrap, { marginBottom: 25 }]}>
        {['Experience', 'Skills', 'Education'].map((value) => (
          <Chip key={value} label={value} selected={section === value} onPress={() => setSection(value)} />
        ))}
      </View>
      {section === 'Experience' &&
        data.experience.map((job, i) => (
          <View key={job.hash} style={{ flexDirection: 'row', gap: 15 }}>
            <View style={{ alignItems: 'center', width: 15 }}>
              <View
                style={[s.timelineDot, { backgroundColor: i === 0 ? t.accent : t.surface, borderColor: t.accent }]}
              />
              <View style={{ flex: 1, width: 1, backgroundColor: t.line }} />
            </View>
            <View style={{ flex: 1, paddingBottom: 28, gap: 12 }}>
              <Txt mono style={{ color: t.accent, fontSize: 10 }}>
                {i === 0 ? 'HEAD → ' : ''}
                {job.dates}
              </Txt>
              <Card>
                <Txt style={{ fontFamily: fonts.bold, fontSize: 23, lineHeight: 29 }}>{job.company}</Txt>
                <Txt style={{ color: t.accent, fontFamily: fonts.medium }}>{job.role}</Txt>
                {job.points.map((point, j) => (
                  <View key={j} style={{ flexDirection: 'row', gap: 9 }}>
                    <Txt style={{ color: t.accent }}>·</Txt>
                    <RichText value={point} style={{ flex: 1, fontSize: 14, color: t.muted }} />
                  </View>
                ))}
                <Tags items={job.tags} />
              </Card>
            </View>
          </View>
        ))}
      {section === 'Skills' && (
        <View style={{ gap: 16 }}>
          {data.skills.map((group, i) => (
            <Card key={group.group}>
              <View style={ui.row}>
                <Icon
                  name={(['code', 'smartphone', 'globe', 'database', 'cpu', 'layers'] as IconName[])[i % 6]}
                  color={t.accent}
                />
                <Txt style={{ fontFamily: fonts.bold, fontSize: 19, textTransform: 'capitalize' }}>
                  {group.group.replace('-', ' & ')}
                </Txt>
              </View>
              <Tags items={group.items} />
            </Card>
          ))}
        </View>
      )}
      {section === 'Education' && (
        <View style={{ gap: 18 }}>
          {data.education.map((e) => (
            <Card key={`${e.school}-${e.degree}`}>
              <View style={ui.row}>
                <Icon name="award" color={t.accent} />
                <Txt mono muted style={{ fontSize: 10 }}>
                  {e.dates}
                </Txt>
              </View>
              <Txt style={{ fontSize: 24, lineHeight: 30, fontFamily: fonts.bold }}>{e.degree}</Txt>
              <Txt>{e.school}</Txt>
              <Txt muted>
                {e.place}
                {e.note ? ` · ${e.note}` : ''}
              </Txt>
              {e.description && <Txt muted>{e.description}</Txt>}
              <Tags items={e.subjects} />
            </Card>
          ))}
          <Txt style={[s.sectionTitle, { marginTop: 12 }]}>Beyond the classroom.</Txt>
          {awards.map((a) => (
            <View key={a} style={[ui.row, { alignItems: 'flex-start' }]}>
              <Icon name="star" size={18} color={t.accent} />
              <Txt muted style={{ flex: 1 }}>
                {a}
              </Txt>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
