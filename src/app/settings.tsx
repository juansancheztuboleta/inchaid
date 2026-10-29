import { Tick02Icon } from '@hugeicons/core-free-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Crest } from '@/components/crest';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTeam } from '@/context/team';
import { teams, type Team } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const { team, setTeam } = useTeam();

  return (
    <Screen title="Configuración">
      <CurrentTeam team={team} />

      <View style={styles.section}>
        <AppText variant="headline" accessibilityRole="header">
          Elige tu equipo
        </AppText>
        <Glass radius={Radius.panel} strength="strong">
          <View accessibilityRole="radiogroup">
            {teams.map((t, i) => (
              <TeamRow key={t.id} team={t} first={i === 0} selected={t.id === team.id} onSelect={setTeam} />
            ))}
          </View>
        </Glass>
      </View>
    </Screen>
  );
}

function CurrentTeam({ team }: { team: Team }) {
  return (
    <Glass radius={Radius.sheet} tint="rgba(0, 110, 183, 0.88)">
      <View style={styles.current}>
        <Crest initials={team.initials} size={64} side="away" />
        <View style={styles.currentText}>
          <AppText variant="label" style={styles.onBlueSoft}>
            Siguiendo a
          </AppText>
          <AppText variant="headline" style={styles.onBlue}>
            {team.name}
          </AppText>
          <AppText variant="label" style={styles.onBlueSoft}>
            {team.city} · {team.venue}
          </AppText>
        </View>
      </View>
    </Glass>
  );
}

type TeamRowProps = {
  team: Team;
  first: boolean;
  selected: boolean;
  onSelect: (team: Team) => void;
};

function TeamRow({ team, first, selected, onSelect }: TeamRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${team.name}, ${team.city}`}
      accessibilityState={{ checked: selected }}
      onPress={() => onSelect(team)}
      style={({ pressed }) => [
        styles.row,
        !first && { borderTopColor: colors.line, borderTopWidth: StyleSheet.hairlineWidth },
        pressed && { backgroundColor: colors.accentSoft },
      ]}>
      <Crest initials={team.initials} size={44} />
      <View style={styles.rowText}>
        <AppText variant="title">{team.name}</AppText>
        <AppText variant="label" color="textSecondary">
          {team.city}
        </AppText>
      </View>
      <View
        style={[
          styles.check,
          selected
            ? { backgroundColor: colors.primary, borderColor: colors.primary }
            : { borderColor: colors.textTertiary },
        ]}>
        {selected ? <Icon icon={Tick02Icon} size={16} color="onPrimary" strokeWidth={2.4} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.three },
  current: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.four },
  currentText: { flex: 1, gap: 2 },
  onBlue: { color: '#ffffff' },
  onBlueSoft: { color: 'rgba(255, 255, 255, 0.85)' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    minHeight: 68,
  },
  rowText: { flex: 1, gap: 2 },
  check: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
