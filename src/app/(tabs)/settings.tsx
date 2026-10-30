import {
  ArrowRight01Icon,
  FingerPrintIcon,
  Globe02Icon,
  HelpCircleIcon,
  LockPasswordIcon,
  Logout01Icon,
  Mail01Icon,
  NotificationIcon,
  Shield01Icon,
  Ticket01Icon,
} from '@hugeicons/core-free-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Appearance, Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Crest } from '@/components/crest';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { Group, Row } from '@/components/list';
import { Screen } from '@/components/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTeam } from '@/context/team';
import { useCopy, useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { team } = useTeam();
  const copy = useCopy();
  const router = useRouter();
  const [goals, setGoals] = useState(true);
  const [news, setNews] = useState(true);
  const [reminders, setReminders] = useState(false);
  const [biometric, setBiometric] = useState(true);

  const toggle = (value: boolean, onChange: (v: boolean) => void, label: string) => (
    <Switch
      value={value}
      onValueChange={onChange}
      accessibilityLabel={label}
      trackColor={{ false: colors.switchOff, true: colors.primary }}
      thumbColor="#ffffff"
    />
  );

  return (
    <Screen title={copy.settings.title}>
      <Profile />

      <Group title={copy.settings.myTeam}>
        <Row
          leading={<Crest team={team} size={40} />}
          label={team.name}
          detail={copy.settings.changeTeam}
          onPress={() => router.push('/teams')}
        />
      </Group>

      <Group title="Notificaciones">
        <Row
          icon={NotificationIcon}
          label={`Goles de ${team.shortName} en vivo`}
          trailing={toggle(goals, setGoals, 'Goles en vivo')}
        />
        <Row
          icon={Mail01Icon}
          label="Noticias del club"
          trailing={toggle(news, setNews, 'Noticias del club')}
        />
        <Row
          icon={Ticket01Icon}
          label="Recordar partidos"
          trailing={toggle(reminders, setReminders, 'Recordar partidos')}
        />
      </Group>

      <Group title="Seguridad">
        <Row
          icon={FingerPrintIcon}
          label="Entrar con Face ID"
          trailing={toggle(biometric, setBiometric, 'Entrar con Face ID')}
        />
        <Row icon={LockPasswordIcon} label="Cambiar PIN" onPress={() => {}} />
        <Row icon={Shield01Icon} label="Dispositivos de confianza" value="2" onPress={() => {}} />
      </Group>

      <AppearanceGroup />

      <Group title="Ayuda">
        <Row icon={HelpCircleIcon} label="Centro de ayuda" onPress={() => {}} />
        <Row icon={Globe02Icon} label="Términos y privacidad" onPress={() => {}} />
      </Group>

      <Group>
        <Row icon={Logout01Icon} label="Cerrar sesión" danger onPress={() => {}} />
      </Group>
    </Screen>
  );
}

function Profile() {
  const { colors } = useTheme();

  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Ver perfil de Camilo Rojas">
      <Glass radius={Radius.sheet} strength="strong">
        <View style={styles.profile}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <AppText variant="headline" color="onPrimary">
              CR
            </AppText>
          </View>
          <View style={styles.profileText}>
            <AppText variant="title">Camilo Rojas</AppText>
            <AppText variant="label" color="textSecondary">
              Socio n.º 048213 · Platea Norte
            </AppText>
          </View>
          <Icon icon={ArrowRight01Icon} size={18} color="textTertiary" />
        </View>
      </Glass>
    </Pressable>
  );
}

type Mode = 'auto' | 'light' | 'dark';

const modes: { key: Mode; label: string }[] = [
  { key: 'auto', label: 'Automático' },
  { key: 'light', label: 'Claro' },
  { key: 'dark', label: 'Oscuro' },
];

function AppearanceGroup() {
  const { colors } = useTheme();
  const [mode, setMode] = useState<Mode>('auto');

  const choose = (next: Mode) => {
    setMode(next);
    Appearance.setColorScheme(next === 'auto' ? 'unspecified' : next);
  };

  return (
    <View style={styles.appearance}>
      <AppText variant="label" color="textSecondary" accessibilityRole="header" style={styles.appearanceTitle}>
        Apariencia
      </AppText>
      <Glass radius={Radius.panel} strength="strong">
        <View style={styles.segmentWrap} accessibilityRole="radiogroup">
          {modes.map((m) => {
            const selected = mode === m.key;
            return (
              <Pressable
                key={m.key}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => choose(m.key)}
                style={[styles.segment, selected && { backgroundColor: colors.primary }]}>
                <AppText variant="label" color={selected ? 'onPrimary' : 'textSecondary'}>
                  {m.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: { flex: 1, gap: 2 },
  appearance: { gap: Spacing.one },
  appearanceTitle: { paddingHorizontal: Spacing.one },
  segmentWrap: { flexDirection: 'row', padding: 6, gap: 4 },
  segment: {
    flex: 1,
    minHeight: 44,
    borderRadius: Radius.control + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
