import { Alert02Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { ActionButton } from '@/components/buttons';
import { Crest } from '@/components/crest';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { Group, Row } from '@/components/list';
import { Screen } from '@/components/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTeam } from '@/context/team';
import { useTeams } from '@/hooks/use-teams';
import { useCopy, useTheme } from '@/hooks/use-theme';
import { fill } from '@/theme/copy';

export default function TeamsScreen() {
  const router = useRouter();
  const { team: current } = useTeam();
  const { colors } = useTheme();
  const copy = useCopy();
  const { state, reload } = useTeams();

  return (
    <Screen title={copy.teams.title} back>
      <AppText variant="body" color="textSecondary">
        {fill(copy.teams.intro, { short: current.shortName, team: current.name })}
      </AppText>

      {state.status === 'loading' ? (
        <Glass radius={Radius.panel} strength="strong">
          <View style={styles.status} accessibilityLiveRegion="polite">
            <ActivityIndicator color={colors.primary} />
            <AppText variant="label" color="textSecondary">
              Cargando equipos…
            </AppText>
          </View>
        </Glass>
      ) : null}

      {state.status === 'error' ? (
        <Glass radius={Radius.panel} strength="strong">
          <View style={styles.status} accessibilityLiveRegion="assertive">
            <Icon icon={Alert02Icon} size={28} color="danger" />
            <AppText variant="title">No pudimos cargar los equipos</AppText>
            <AppText variant="body" color="textSecondary" style={styles.center}>
              {state.message}. Revisa tu conexión e inténtalo de nuevo.
            </AppText>
            <ActionButton label="Reintentar" tone="solid" onPress={reload} />
          </View>
        </Glass>
      ) : null}

      {state.status === 'ready' && state.data.length === 0 ? (
        <Glass radius={Radius.panel} strength="strong">
          <View style={styles.status}>
            <AppText variant="title">Aún no hay equipos disponibles</AppText>
            <AppText variant="body" color="textSecondary" style={styles.center}>
              Vuelve a intentarlo más tarde.
            </AppText>
          </View>
        </Glass>
      ) : null}

      {state.status === 'ready' && state.data.length > 0 ? (
        <Group>
          {state.data.map((t) => (
            <Row
              key={t.id}
              leading={<Crest team={t} size={44} />}
              label={t.name}
              detail={[t.city, t.department].filter(Boolean).join(' · ')}
              trailing={
                t.id === current.id ? (
                  <View style={[styles.current, { backgroundColor: colors.primary }]}>
                    <Icon icon={Tick02Icon} size={14} color="onPrimary" strokeWidth={2.6} />
                    <AppText variant="caption" color="onPrimary">
                      Tu equipo
                    </AppText>
                  </View>
                ) : undefined
              }
              onPress={() => router.push({ pathname: '/teams/[id]', params: { id: t.id } })}
            />
          ))}
        </Group>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  status: { alignItems: 'center', gap: Spacing.two, padding: Spacing.four },
  center: { textAlign: 'center' },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
});
