import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle, type StyleProp, type ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { fonts, useTheme } from '../theme';

export type IconName = React.ComponentProps<typeof Feather>['name'];
export function Icon({ name, size = 20, color }: { name: IconName; size?: number; color?: string }) {
  const t = useTheme();
  return <Feather name={name} size={size} color={color || t.text} />;
}
export function Txt({
  children,
  style,
  mono,
  muted,
  ...props
}: React.ComponentProps<typeof Text> & { mono?: boolean; muted?: boolean }) {
  const t = useTheme();
  return (
    <Text
      {...props}
      style={[
        {
          color: muted ? t.muted : t.text,
          fontFamily: mono ? fonts.mono : fonts.regular,
          fontSize: mono ? 12 : 15,
          lineHeight: mono ? 20 : 23,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Button({
  label,
  onPress,
  icon,
  secondary,
  compact,
  disabled,
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  secondary?: boolean;
  compact?: boolean;
  disabled?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          paddingVertical: compact ? 11 : 15,
          backgroundColor: secondary ? t.surface : t.accent,
          borderColor: secondary ? t.line : t.accent,
          opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
        },
      ]}
    >
      <Txt style={{ color: secondary ? t.text : t.ink, fontFamily: fonts.bold, fontSize: 14 }}>{label}</Txt>
      {icon && <Icon name={icon} size={17} color={secondary ? t.text : t.ink} />}
    </Pressable>
  );
}
export function IconButton({
  icon,
  label,
  onPress,
  active,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: active ? t.soft : t.surface,
          borderColor: active ? t.accent : t.line,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Icon name={icon} size={18} color={active ? t.accent : t.text} />
    </Pressable>
  );
}
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }, style]}>{children}</View>;
}
export function Tags({ items }: { items: string[] }) {
  const t = useTheme();
  return (
    <View style={styles.wrap}>
      {items.map((tag, i) => (
        <View key={`${tag}-${i}`} style={[styles.tag, { backgroundColor: t.raised }]}>
          <Txt mono style={{ fontSize: 10, lineHeight: 16 }}>
            {tag}
          </Txt>
        </View>
      ))}
    </View>
  );
}
export function Heading({
  number,
  command,
  title,
  description,
}: {
  number: string;
  command: string;
  title: string;
  description?: string;
}) {
  const t = useTheme();
  return (
    <View style={{ gap: 10, marginBottom: 24 }}>
      <View style={styles.row}>
        <Txt mono style={{ color: t.accent }}>
          {number}
        </Txt>
        <Txt mono muted>
          $ {command}
        </Txt>
      </View>
      <Txt
        accessibilityRole="header"
        style={{ fontFamily: fonts.bold, fontSize: 32, lineHeight: 38, letterSpacing: -1 }}
      >
        {title}
      </Txt>
      {description && <Txt muted>{description}</Txt>}
    </View>
  );
}
export function RichText({ value, style }: { value: string; style?: StyleProp<TextStyle> }) {
  return (
    <Txt style={style}>
      {value.split(/(\*\*.*?\*\*)/g).map((part, i) =>
        part.startsWith('**') ? (
          <Text key={i} style={{ fontFamily: fonts.bold }}>
            {part.slice(2, -2)}
          </Text>
        ) : (
          part
        ),
      )}
    </Txt>
  );
}
export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  card: { padding: 20, borderRadius: 20, borderWidth: 1, gap: 16 },
  button: {
    minHeight: 46,
    paddingHorizontal: 19,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 7 },
});
