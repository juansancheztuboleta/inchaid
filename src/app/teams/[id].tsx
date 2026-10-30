import {
  Alert02Icon,
  Calendar03Icon,
  FootballPitchIcon,
  Location01Icon,
  Tick02Icon,
  Trophy,
  UserMultiple02Icon,
} from '@hugeicons/core-free-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
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
import { useTeamDetail } from '@/hooks/use-teams';
import { useCopy, useTheme } from '@/hooks/use-theme';
import { confirmAsync } from '@/lib/confirm';
import type { Team } from '@/types/team';

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { state, reload } = useTeamDetail(id);

  if (state.status === 'ready' && state.data) return <Detail team={state.data} />;

  return (
    <Screen title="Equipo" back>
      <Glass radius={Radius.panel} strength="strong">
        <View style={styles.status} accessibilityLiveRegion="polite">
          {state.status === 'loading' ? (
            <>
              <ActivityIndicator color={colors.primary} />
              <AppText variant="label" color="textSecondary">
                Cargando ficha…
              </AppText>
            </>
          ) : (
            <>
              <Icon icon={Alert02Icon} size={28} color="danger" />
              <AppText variant="title">
                {state.status === 'error' ? 'No pudimos cargar el equipo' : 'No encontramos este equipo'}
              </AppText>
              {state.status === 'error' ? (
                <>
                  <AppText variant="body" color="textSecondary" style={styles.center}>
                    {state.message}.
                  </AppText>
                  <ActionButton label="Reintentar" tone="solid" onPress={reload} />
                </>
              ) : null}
            </>
          )}
        </View>
      </Glass>
    </Screen>
  );
}

function Detail({ team }: { team: Team }) {
  const router = useRouter();
  const copy = useCopy();
  // Al explorar un club, toda la app (fondo, cajas, botones) adopta su tema; se restaura al salir.
  const { team: current, setTeam, setPreview } = useTeam();
  const { colors } = useTheme();
  const isCurrent = current.id === team.id;

  useEffect(() => {
    setPreview(team);
    return () => setPreview(null);
  }, [team, setPreview]);

  const choose = async () => {
    const ok = await confirmAsync({
      title: `¿Cambiar a ${team.name}?`,
      message: `Dejarás de ver el feed de ${current.name} y empezarás a seguir a ${team.name}.`,
      confirmLabel: 'Sí, cambiar',
    });
    if (!ok) return;
    setTeam(team);
    router.dismissTo('/settings');
  };

  const { primary, secondary, accent } = team.colors;
  const swatches = [primary, secondary, ...(accent ? [accent] : [])];
  const place = [team.city, team.department].filter(Boolean).join(', ');

  return (
    <Screen title={team.shortName} back>
      <Glass radius={Radius.sheet} tint={colors.panelTint}>
        <View style={styles.hero}>
          <Crest team={team} size={88} />
          <AppText variant="headline" color="onPanel" style={styles.center}>
            {team.fullName}
          </AppText>
          {place ? (
            <AppText variant="label" color="onPanelSoft" style={styles.center}>
              {place}
            </AppText>
          ) : null}
        </View>
      </Glass>

      <Group title="Ficha del club">
        {team.stadium.name ? (
          <Row
            icon={FootballPitchIcon}
            label={team.stadium.name}
            detail={
              team.stadium.capacity
                ? `Estadio · ${team.stadium.capacity.toLocaleString('es-CO')} espectadores`
                : 'Estadio'
            }
          />
        ) : null}
        {place ? <Row icon={Location01Icon} label={place} detail="Ciudad" /> : null}
        {team.founded ? <Row icon={Calendar03Icon} label={String(team.founded)} detail="Año de fundación" /> : null}
        {team.nicknames.length ? (
          <Row icon={Trophy} label={team.nicknames.slice(0, 3).join(', ')} detail="Apodos" />
        ) : null}
        {team.rivals.length ? (
          <Row icon={UserMultiple02Icon} label={team.rivals.join(', ')} detail="Rivales clásicos" />
        ) : null}
        <Row
          label={swatches.map((s) => s.name).filter(Boolean).join(' · ') || 'Colores'}
          detail="Colores del club"
          trailing={
            <View style={styles.swatches}>
              {swatches.map((s) => (
                <View
                  key={s.hex}
                  accessibilityLabel={s.name || s.hex}
                  style={[styles.swatch, { backgroundColor: s.hex, borderColor: colors.line }]}
                />
              ))}
            </View>
          }
        />
      </Group>

      {isCurrent ? (
        <Glass radius={Radius.panel} strength="strong">
          <View style={styles.currentNote}>
            <Icon icon={Tick02Icon} size={20} color="success" strokeWidth={2.2} />
            <AppText variant="title">Es tu equipo actual</AppText>
          </View>
        </Glass>
      ) : (
        <ActionButton label={copy.teams.choose} onPress={choose} fullWidth />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  status: { alignItems: 'center', gap: Spacing.two, padding: Spacing.four },
  center: { textAlign: 'center' },
  hero: { alignItems: 'center', gap: Spacing.two, padding: Spacing.five },
  swatches: { flexDirection: 'row', gap: Spacing.one },
  swatch: { width: 28, height: 28, borderRadius: Radius.full, borderWidth: 1 },
  currentNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    minHeight: 52,
  },
});
