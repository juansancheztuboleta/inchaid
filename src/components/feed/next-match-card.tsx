import { Calendar03Icon, Location01Icon, Ticket01Icon } from '@hugeicons/core-free-icons';
import { type IconSvgElement } from '@hugeicons/react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { ActionButton } from '@/components/buttons';
import { Crest } from '@/components/crest';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTeam } from '@/context/team';
import { nextMatchOf } from '@/data/mock';
import { useCopy } from '@/hooks/use-theme';

/** Próximo partido del equipo con la acción principal de compra. */
export function NextMatchCard() {
  const { team } = useTeam();
  const copy = useCopy();
  const match = nextMatchOf(team);

  return (
    <Glass radius={Radius.sheet}>
      <View style={styles.body}>
        <AppText variant="label" color="textSecondary">
          {match.competition}
        </AppText>

        <View style={styles.versus}>
          <Side name={match.home.name}>
            <Crest team={match.home} size={64} />
          </Side>
          <AppText variant="headline" color="textTertiary">
            vs
          </AppText>
          <Side name={match.away.name}>
            <Crest team={match.away} size={64} />
          </Side>
        </View>

        <View style={styles.facts}>
          <Fact icon={Calendar03Icon} text={match.date} />
          <Fact icon={Location01Icon} text={match.venue} />
        </View>

        <ActionButton label={copy.feed.buyTickets} icon={Ticket01Icon} fullWidth />
      </View>
    </Glass>
  );
}

function Side({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.side}>
      {children}
      <AppText variant="label" style={styles.center}>
        {name}
      </AppText>
    </View>
  );
}

function Fact({ icon, text }: { icon: IconSvgElement; text: string }) {
  return (
    <View style={styles.fact}>
      <Icon icon={icon} size={18} color="accentText" />
      <AppText variant="body" color="textSecondary" style={styles.factText}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: Spacing.four, gap: Spacing.four },
  versus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  side: { alignItems: 'center', gap: Spacing.one, flex: 1 },
  center: { textAlign: 'center' },
  facts: { gap: Spacing.one },
  fact: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  factText: { flexShrink: 1 },
});
