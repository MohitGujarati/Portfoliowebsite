import {
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_700Bold,
  useFonts,
} from '@expo-google-fonts/inter-tight';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Linking, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon, IconButton, Txt, styles as ui, type IconName } from './src/components/UI';
import { type Tab } from './src/data/model';
import { usePortfolio } from './src/data/usePortfolio';
import { openDocument } from './src/documents';
import { TextDot } from './src/screens/common';
import { Connect } from './src/screens/Connect';
import { DetailModal } from './src/screens/DetailModal';
import { Home } from './src/screens/Home';
import { Journey } from './src/screens/Journey';
import { Research } from './src/screens/Research';
import { s } from './src/screens/styles';
import { Terminal } from './src/screens/Terminal';
import type { Detail } from './src/screens/types';
import { Work } from './src/screens/Work';
import { ThemeContext, dark, fonts, light } from './src/theme';

const TABS: { name: Tab; icon: IconName }[] = [
  { name: 'Home', icon: 'command' },
  { name: 'Work', icon: 'grid' },
  { name: 'Journey', icon: 'git-branch' },
  { name: 'Research', icon: 'book-open' },
  { name: 'Connect', icon: 'send' },
];

export default function App() {
  const [loaded, error] = useFonts({
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_700Bold,
    JetBrainsMono_400Regular,
    ...Feather.font,
  });
  if (!loaded && !error)
    return (
      <View style={s.loading}>
        <ActivityIndicator color={dark.accent} />
        <StatusBar style="light" />
      </View>
    );
  return (
    <SafeAreaProvider>
      <PortfolioApp />
    </SafeAreaProvider>
  );
}

function PortfolioApp() {
  const [isDark, setIsDark] = useState(true);
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>('Home');
  const [detail, setDetail] = useState<Detail>(null);
  const [terminal, setTerminal] = useState(false);
  const [toast, setToast] = useState('');
  const [documentBusy, setDocumentBusy] = useState(false);
  const { data, refreshing, notice, refresh, clearNotice, source } = usePortfolio();
  const t = isDark ? dark : light;
  const insets = useSafeAreaInsets();
  const screen = useRef<ScrollView>(null);
  useEffect(() => {
    AsyncStorage.multiGet(['mohit:theme', 'mohit:saved'])
      .then((entries) => {
        if (entries[0][1] === 'light') setIsDark(false);
        try {
          const values: unknown = JSON.parse(entries[1][1] || '[]');
          if (Array.isArray(values) && values.every((v) => typeof v === 'string')) setSaved(values);
        } catch {
          /* Ignore a corrupt preferences entry. */
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (ready)
      AsyncStorage.multiSet([
        ['mohit:theme', isDark ? 'dark' : 'light'],
        ['mohit:saved', JSON.stringify(saved)],
      ]).catch(() => setToast('Preferences could not be saved on this device.'));
  }, [isDark, saved, ready]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (tab !== 'Home') {
        setTab('Home');
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [tab]);
  const go = (next: Tab) => {
    setTab(next);
    screen.current?.scrollTo({ y: 0, animated: false });
  };
  const bookmark = (slug: string) =>
    setSaved((previous) => (previous.includes(slug) ? previous.filter((id) => id !== slug) : [...previous, slug]));
  const openLink = async (url: string) => {
    if (!/^(https:\/\/|mailto:)/i.test(url)) {
      setToast('This link is unavailable.');
      return;
    }
    try {
      await Linking.openURL(url);
    } catch {
      setToast('Could not open this link. Please check that a browser or email app is installed.');
    }
  };
  const document = async (key: string) => {
    if (documentBusy) return;
    setDocumentBusy(true);
    try {
      await openDocument(key);
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Could not open this PDF. Please try again.');
    } finally {
      setDocumentBusy(false);
    }
  };
  if (!data)
    return (
      <ThemeContext.Provider value={t}>
        <View style={[s.root, { backgroundColor: t.bg }]}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <SafeAreaView style={[s.loading, { padding: 28 }]}>
            <View style={[s.logo, { backgroundColor: t.accent }]}>
              <Txt mono style={{ color: t.ink }}>
                mg.
              </Txt>
            </View>
            <ActivityIndicator color={t.accent} size="large" />
            <Txt accessibilityRole="header" style={{ fontFamily: fonts.bold, fontSize: 25, textAlign: 'center' }}>
              Loading your portfolio...
            </Txt>
            <Txt muted style={{ textAlign: 'center' }}>
              {notice || 'Connecting to the shared Supabase data through your API.'}
            </Txt>
            <Button
              label={refreshing ? 'Connecting...' : 'Try again'}
              icon="refresh-cw"
              disabled={refreshing}
              onPress={refresh}
            />
          </SafeAreaView>
        </View>
      </ThemeContext.Provider>
    );
  const copyEmail = async () => {
    try {
      await Clipboard.setStringAsync(data.profile.email);
      setToast('Email address copied.');
    } catch {
      setToast('Copy is unavailable. You can select the email address below.');
    }
  };
  return (
    <ThemeContext.Provider value={t}>
      <View style={[s.root, { backgroundColor: t.bg }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
          <View style={[s.header, { borderBottomColor: t.line }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go to home"
              onPress={() => go('Home')}
              style={ui.row}
            >
              <View style={[s.logo, { backgroundColor: t.accent }]}>
                <Txt mono style={{ color: t.ink, fontSize: 15 }}>
                  mg.
                </Txt>
              </View>
              <View>
                <Txt style={{ fontFamily: fonts.bold, fontSize: 14, lineHeight: 19 }}>
                  mohit
                  <TextDot />
                </Txt>
                <Txt mono muted style={{ fontSize: 9, lineHeight: 15 }}>
                  ENGINEER / BUILDER
                </Txt>
              </View>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <IconButton icon="terminal" label="Open terminal" onPress={() => setTerminal(true)} />
              <IconButton
                icon={isDark ? 'sun' : 'moon'}
                label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                onPress={() => setIsDark((v) => !v)}
              />
            </View>
          </View>
          {notice !== '' && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${notice} Dismiss notification`}
              onPress={clearNotice}
              style={[s.notice, { backgroundColor: t.soft }]}
            >
              <Txt style={{ flex: 1, fontSize: 12, color: t.accent }}>{notice}</Txt>
              <Icon name="x" size={15} color={t.accent} />
            </Pressable>
          )}
          <ScrollView
            ref={screen}
            key={tab}
            style={{ flex: 1 }}
            contentContainerStyle={s.content}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={t.accent} colors={[t.accent]} />
            }
          >
            {tab === 'Home' && (
              <Home
                data={data}
                go={go}
                openProject={(p) => setDetail({ kind: 'project', value: p })}
                openTerminal={() => setTerminal(true)}
                resume={() => document('resume')}
                busy={documentBusy}
              />
            )}
            {tab === 'Work' && (
              <Work
                projects={data.projects}
                saved={saved}
                bookmark={bookmark}
                open={(p) => setDetail({ kind: 'project', value: p })}
              />
            )}
            {tab === 'Journey' && <Journey data={data} />}
            {tab === 'Research' && <Research open={(paper) => setDetail({ kind: 'paper', value: paper })} />}
            {tab === 'Connect' && (
              <Connect
                data={data}
                link={openLink}
                copyEmail={copyEmail}
                resume={() => document('resume')}
                busy={documentBusy}
              />
            )}
            <View style={[s.footer, { borderTopColor: t.line }]}>
              <Txt mono muted style={{ fontSize: 10 }}>
                DESIGNED TO BUILD. BUILT TO SHIP.
              </Txt>
              <View style={ui.row}>
                <View style={[s.dot, { backgroundColor: t.accent }]} />
                <Txt mono muted style={{ fontSize: 10 }}>
                  {source === 'live' ? 'synced with portfolio' : 'available offline'}
                </Txt>
              </View>
            </View>
          </ScrollView>
          <View
            accessibilityRole="tablist"
            style={[
              s.tabBar,
              { backgroundColor: t.surface, borderTopColor: t.line, paddingBottom: Math.max(insets.bottom, 10) },
            ]}
          >
            {TABS.map((item) => (
              <Pressable
                key={item.name}
                accessibilityRole="tab"
                accessibilityLabel={item.name}
                accessibilityState={{ selected: tab === item.name }}
                onPress={() => go(item.name)}
                style={({ pressed }) => [s.tab, { opacity: pressed ? 0.6 : 1 }]}
              >
                <View style={[s.tabIcon, { backgroundColor: tab === item.name ? t.soft : 'transparent' }]}>
                  <Icon name={item.icon} size={20} color={tab === item.name ? t.accent : t.muted} />
                </View>
                <Txt
                  style={{
                    fontSize: 10,
                    lineHeight: 15,
                    fontFamily: fonts.medium,
                    color: tab === item.name ? t.accent : t.muted,
                  }}
                >
                  {item.name}
                </Txt>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
        <DetailModal
          detail={detail}
          close={() => setDetail(null)}
          saved={saved}
          bookmark={bookmark}
          link={openLink}
          document={document}
          busy={documentBusy}
          isDark={isDark}
          message={toast}
        />
        <Terminal
          visible={terminal}
          close={() => setTerminal(false)}
          data={data}
          navigate={(next) => {
            setTerminal(false);
            go(next);
          }}
          isDark={isDark}
        />
        {!!toast && (
          <View
            accessibilityLiveRegion="polite"
            style={[s.toast, { backgroundColor: t.accent, bottom: Math.max(insets.bottom, 10) + 80 }]}
          >
            <Txt style={{ color: t.ink, fontFamily: fonts.medium, fontSize: 13 }}>{toast}</Txt>
          </View>
        )}
      </View>
    </ThemeContext.Provider>
  );
}
