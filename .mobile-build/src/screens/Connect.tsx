import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Button, Card, Heading, Icon, Txt, styles as ui, type IconName } from '../components/UI';
import { website, type Portfolio } from '../data/model';
import { fonts, useTheme } from '../theme';
import { s } from './styles';

export function Connect({
  data,
  link,
  copyEmail,
  resume,
  busy,
}: {
  data: Portfolio;
  link: (url: string) => void;
  copyEmail: () => void;
  resume: () => void;
  busy: boolean;
}) {
  const t = useTheme();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const p = data.profile;
  return (
    <View style={{ gap: 22 }}>
      <Heading
        number="04"
        command="ping mohit"
        title="Let's build something."
        description="Have an interesting problem, a product idea, or just want to say hello? My inbox is open."
      />
      <Card style={{ backgroundColor: t.soft }}>
        <Icon name="mail" color={t.accent} size={28} />
        <Txt mono muted style={{ fontSize: 10 }}>
          DROP ME A LINE
        </Txt>
        <Txt selectable style={{ fontSize: 18, fontFamily: fonts.bold }}>
          {p.email}
        </Txt>
        <View style={ui.wrap}>
          <Button label="Email me" icon="arrow-up-right" onPress={() => link(`mailto:${p.email}`)} />
          <Button label="Copy email" icon="copy" onPress={copyEmail} secondary />
        </View>
      </Card>
      <View style={{ gap: 12 }}>
        {[
          { label: 'GitHub', value: 'Code, experiments & side projects', icon: 'github' as IconName, url: p.github },
          { label: 'LinkedIn', value: 'Connect professionally', icon: 'linkedin' as IconName, url: p.linkedin },
          { label: 'Portfolio website', value: 'The full desktop experience', icon: 'globe' as IconName, url: website },
        ].map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="link"
            accessibilityLabel={`Open ${item.label}`}
            onPress={() => link(item.url)}
          >
            <Card style={ui.between}>
              <Icon name={item.icon} size={24} color={t.accent} />
              <View style={{ flex: 1 }}>
                <Txt style={{ fontFamily: fonts.bold }}>{item.label}</Txt>
                <Txt muted style={{ fontSize: 12 }}>
                  {item.value}
                </Txt>
              </View>
              <Icon name="arrow-up-right" color={t.muted} size={18} />
            </Card>
          </Pressable>
        ))}
      </View>
      <Card>
        <Txt style={s.sectionTitle}>Start a conversation.</Txt>
        <Txt muted style={{ fontSize: 13 }}>
          Compose a note, then review and send it in your email app.
        </Txt>
        <Txt mono muted style={{ fontSize: 10 }}>
          YOUR NAME
        </Txt>
        <TextInput
          accessibilityLabel="Your name"
          placeholder="How should I call you?"
          placeholderTextColor={t.muted}
          value={name}
          onChangeText={setName}
          maxLength={100}
          autoComplete="name"
          style={[s.formInput, { backgroundColor: t.bg, color: t.text, borderColor: t.line }]}
        />
        <Txt mono muted style={{ fontSize: 10 }}>
          YOUR MESSAGE
        </Txt>
        <TextInput
          accessibilityLabel="Your message"
          placeholder="I'd love to talk about…"
          placeholderTextColor={t.muted}
          value={message}
          onChangeText={setMessage}
          maxLength={5000}
          multiline
          textAlignVertical="top"
          style={[s.formInput, { minHeight: 115, backgroundColor: t.bg, color: t.text, borderColor: t.line }]}
        />
        <Button
          label="Continue in email"
          icon="send"
          disabled={!name.trim() || !message.trim()}
          onPress={() =>
            link(
              `mailto:${p.email}?subject=${encodeURIComponent(`Let's connect — ${name.trim()}`)}&body=${encodeURIComponent(`Hi Mohit,\n\n${message.trim()}\n\n${name.trim()}`)}`,
            )
          }
        />
      </Card>
      <Button label="Get my résumé · PDF" icon="download" onPress={resume} disabled={busy} secondary />
      <View style={[ui.row, { justifyContent: 'center' }]}>
        <Icon name="map-pin" size={14} color={t.muted} />
        <Txt mono muted style={{ fontSize: 11 }}>
          {p.location}
        </Txt>
      </View>
    </View>
  );
}
