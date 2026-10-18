import { StatusBar } from 'expo-status-bar';
import { Modal, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, IconButton, RichText, Tags, Txt, styles as ui } from '../components/UI';
import { fonts, useTheme } from '../theme';
import { TextDot } from './common';
import { s } from './styles';
import type { Detail } from './types';

export function DetailModal({
  detail,
  close,
  saved,
  bookmark,
  link,
  document,
  busy,
  isDark,
  message,
}: {
  detail: Detail;
  close: () => void;
  saved: string[];
  bookmark: (slug: string) => void;
  link: (url: string) => void;
  document: (key: string) => void;
  busy: boolean;
  isDark: boolean;
  message: string;
}) {
  const t = useTheme();
  const p = detail?.kind === 'project' ? detail.value : null;
  const paper = detail?.kind === 'paper' ? detail.value : null;
  return (
    <Modal visible={!!detail} animationType="slide" presentationStyle="fullScreen" onRequestClose={close}>
      <View style={[s.root, { backgroundColor: t.bg }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[s.header, { borderBottomColor: t.line }]}>
            <View style={ui.row}>
              <IconButton icon="arrow-left" label="Back to portfolio" onPress={close} />
              <Txt mono muted>
                {p ? 'PROJECT / DETAIL' : 'RESEARCH / DETAIL'}
              </Txt>
            </View>
            {p && (
              <IconButton
                icon="bookmark"
                label={saved.includes(p.slug) ? 'Unsave project' : 'Save project'}
                active={saved.includes(p.slug)}
                onPress={() => bookmark(p.slug)}
              />
            )}
          </View>
          <ScrollView contentContainerStyle={[s.content, { gap: 23 }]}>
            {p && (
              <>
                <Txt mono style={{ color: t.accent }}>
                  {p.kind.toUpperCase()}
                </Txt>
                <Txt accessibilityRole="header" style={s.detailTitle}>
                  {p.name}
                  <TextDot />
                </Txt>
                <Txt mono muted>
                  {p.dates}
                </Txt>
                <Txt style={{ fontSize: 19, lineHeight: 29 }}>{p.pitch}</Txt>
                <Tags items={p.tags} />
                <View style={[s.divider, { backgroundColor: t.line }]} />
                <Txt style={s.sectionTitle}>Under the hood.</Txt>
                {p.points.map((point, i) => (
                  <Card key={i}>
                    <Txt mono style={{ color: t.accent }}>
                      0{i + 1}
                    </Txt>
                    <RichText value={point} style={{ color: t.muted }} />
                  </Card>
                ))}
                {p.github && <Button label="View source on GitHub" icon="github" onPress={() => link(p.github!)} />}
                {p.url && <Button label="Open live project" icon="external-link" onPress={() => link(p.url!)} />}
                <Button
                  label={saved.includes(p.slug) ? 'Saved to your collection' : 'Save this project'}
                  icon="bookmark"
                  secondary
                  onPress={() => bookmark(p.slug)}
                />
              </>
            )}
            {paper && (
              <>
                <Txt mono style={{ color: t.accent }}>
                  {paper.badge.toUpperCase()} / {paper.year}
                </Txt>
                <Txt accessibilityRole="header" style={[s.detailTitle, { fontSize: 30, lineHeight: 37 }]}>
                  {paper.title}
                </Txt>
                <Txt muted>
                  {paper.venue}
                  {paper.coAuthored ? '\nCo-authored research' : ''}
                </Txt>
                {paper.result && (
                  <Card style={{ backgroundColor: t.soft }}>
                    <Txt style={{ color: t.accent, fontSize: 36, lineHeight: 43, fontFamily: fonts.bold }}>
                      {paper.result.value}
                    </Txt>
                    <Txt muted>{paper.result.label}</Txt>
                  </Card>
                )}
                <Txt style={s.sectionTitle}>Abstract</Txt>
                <Txt muted style={{ lineHeight: 27 }}>
                  {paper.abstract}
                </Txt>
                <Tags items={paper.tags} />
                <Button
                  label={
                    busy ? 'Preparing PDF…' : Platform.OS === 'web' ? 'Open paper · PDF' : 'Open / share paper · PDF'
                  }
                  icon="file-text"
                  disabled={busy}
                  onPress={() => document(paper.slug)}
                />
                <Txt mono muted style={{ fontSize: 10 }}>
                  Included with the app. No sign-in required.
                </Txt>
              </>
            )}
          </ScrollView>
          {!!message && (
            <View accessibilityLiveRegion="polite" style={[s.notice, { backgroundColor: t.soft }]}>
              <Txt style={{ color: t.accent, fontSize: 13 }}>{message}</Txt>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}
