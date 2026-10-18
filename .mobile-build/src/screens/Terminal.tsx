import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, IconButton, Txt, styles as ui } from '../components/UI';
import { terminalCommand, type Portfolio, type Tab } from '../data/model';
import { fonts, useTheme } from '../theme';
import { Chip } from './common';
import { s } from './styles';

export function Terminal({
  visible,
  close,
  data,
  navigate,
  isDark,
}: {
  visible: boolean;
  close: () => void;
  data: Portfolio;
  navigate: (tab: Tab) => void;
  isDark: boolean;
}) {
  const t = useTheme();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; output: string; tab?: Tab }[]>([]);
  const output = useRef<ScrollView>(null);
  const run = (command: string) => {
    if (!command.trim()) return;
    const result = terminalCommand(command, data);
    if (result.clear) setHistory([]);
    else setHistory((v) => [...v.slice(-39), { cmd: command.trim(), ...result }]);
    setInput('');
  };
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[s.header, { borderBottomColor: t.line }]}>
            <View style={ui.row}>
              <Icon name="terminal" color={t.accent} />
              <Txt mono>mohit@portfolio:~</Txt>
            </View>
            <IconButton icon="x" label="Close terminal" onPress={close} />
          </View>
          <ScrollView
            ref={output}
            contentContainerStyle={{ padding: 24, gap: 22 }}
            onContentSizeChange={() => output.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
          >
            <Txt mono style={{ color: t.accent, fontSize: 19 }}>
              hello, world_
            </Txt>
            <Txt mono muted>
              A small shell. A little about me.{'\n'}Type help to find your way around.
            </Txt>
            {history.map((entry, i) => (
              <View key={i} style={{ gap: 9 }}>
                <Txt mono style={{ color: t.accent }}>
                  $ {entry.cmd}
                </Txt>
                <Txt mono selectable>
                  {entry.output}
                </Txt>
                {entry.tab && (
                  <Button
                    compact
                    secondary
                    label={`Open ${entry.tab}`}
                    icon="arrow-right"
                    onPress={() => navigate(entry.tab!)}
                  />
                )}
              </View>
            ))}
          </ScrollView>
          <View style={{ padding: 20, gap: 14, borderTopWidth: 1, borderTopColor: t.line }}>
            <View style={ui.wrap}>
              {['help', 'whoami', 'projects', 'clear'].map((cmd) => (
                <Chip key={cmd} label={cmd} selected={false} onPress={() => run(cmd)} />
              ))}
            </View>
            <View style={ui.row}>
              <Txt mono style={{ color: t.accent }}>
                $
              </Txt>
              <TextInput
                accessibilityLabel="Terminal command"
                placeholder="Type a command…"
                placeholderTextColor={t.muted}
                value={input}
                onChangeText={setInput}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={() => run(input)}
                style={[s.input, { color: t.text, fontFamily: fonts.mono }]}
              />
              <IconButton icon="arrow-up" label="Run command" onPress={() => run(input)} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
