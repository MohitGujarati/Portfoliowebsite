import { Pressable, View } from 'react-native';
import { Card, Icon, IconButton, Tags, Txt, styles as ui, type IconName } from '../components/UI';
import { fonts, useTheme } from '../theme';
import { s } from './styles';
import type { Project } from './types';

export function TextDot() {
  const t = useTheme();
  return <Txt style={{ color: t.accent }}>.</Txt>;
}

export function ProjectCard({
  project: p,
  index,
  open,
  bookmark,
  saved,
}: {
  project: Project;
  index: number;
  open: () => void;
  bookmark?: () => void;
  saved?: boolean;
}) {
  const t = useTheme();
  const color = [t.accent, t.blue, t.pink][index % 3];
  const icon: IconName = /commerce/i.test(p.kind) ? 'shopping-bag' : /android|mobile/i.test(p.kind) ? 'mic' : 'zap';
  return (
    <Card>
      <View style={ui.between}>
        <View style={ui.row}>
          <View style={[s.projectIcon, { backgroundColor: t.raised }]}>
            <Icon name={icon} color={color} size={22} />
          </View>
          <View>
            <Txt mono muted style={{ fontSize: 9 }}>
              PROJECT / {String(index + 1).padStart(2, '0')}
            </Txt>
            <Txt mono style={{ color, fontSize: 9 }}>
              {p.kind}
            </Txt>
          </View>
        </View>
        {bookmark && (
          <IconButton
            icon="bookmark"
            label={`${saved ? 'Unsave' : 'Save'} ${p.name}`}
            onPress={bookmark}
            active={saved}
          />
        )}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${p.name}`}
        onPress={open}
        style={({ pressed }) => ({ gap: 12, opacity: pressed ? 0.65 : 1 })}
      >
        <View style={ui.between}>
          <Txt style={{ fontFamily: fonts.bold, fontSize: 26, lineHeight: 31 }}>{p.name}</Txt>
          <Icon name="arrow-up-right" size={23} color={t.muted} />
        </View>
        <Txt muted numberOfLines={3}>
          {p.pitch}
        </Txt>
      </Pressable>
      <Tags items={p.tags.slice(0, 4)} />
      <View style={[ui.between, { paddingTop: 12, borderTopWidth: 1, borderTopColor: t.line }]}>
        <Txt mono muted style={{ fontSize: 10 }}>
          {p.dates}
        </Txt>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Read ${p.name} case study`}
          onPress={open}
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Txt style={{ color: t.accent, fontFamily: fonts.medium, fontSize: 12 }}>View project →</Txt>
        </Pressable>
      </View>
    </Card>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        minHeight: 44,
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: selected ? t.accent : t.surface,
        borderWidth: 1,
        borderColor: selected ? t.accent : t.line,
      }}
    >
      <Txt style={{ fontSize: 12, fontFamily: fonts.medium, color: selected ? t.ink : t.muted }}>{label}</Txt>
    </Pressable>
  );
}
