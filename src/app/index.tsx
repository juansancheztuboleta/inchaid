import {
  Calendar03Icon,
  Comment01Icon,
  FavouriteIcon,
  Location01Icon,
  NotificationIcon,
  Share08Icon,
  Ticket01Icon,
} from '@hugeicons/core-free-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { ActionButton, GlassIconButton } from '@/components/buttons';
import { Crest } from '@/components/crest';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Radius, Spacing } from '@/constants/theme';
import { useTeam } from '@/context/team';
import { nextMatchOf, postsOf, type Post } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';

export default function TeamFeedScreen() {
  const { team } = useTeam();
  const posts = postsOf(team);

  return (
    <Screen
      title={team.short}
      trailing={<GlassIconButton icon={NotificationIcon} label="Notificaciones" badge />}>
      <NextMatchCard />
      <View style={styles.feed}>
        <AppText variant="headline" accessibilityRole="header">
          Del club
        </AppText>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </View>
    </Screen>
  );
}

function NextMatchCard() {
  const { team } = useTeam();
  const nextMatch = nextMatchOf(team);

  return (
    <Glass radius={Radius.sheet} style={styles.match}>
      <View style={styles.matchBody}>
        <AppText variant="label" color="textSecondary">
          {nextMatch.competition}
        </AppText>

        <View style={styles.versus}>
          <View style={styles.side}>
            <Crest initials={nextMatch.home.initials} size={64} />
            <AppText variant="label" style={styles.sideName}>
              {nextMatch.home.name}
            </AppText>
          </View>
          <AppText variant="headline" color="textTertiary">
            vs
          </AppText>
          <View style={styles.side}>
            <Crest initials={nextMatch.away.initials} size={64} side="away" />
            <AppText variant="label" style={styles.sideName}>
              {nextMatch.away.name}
            </AppText>
          </View>
        </View>

        <View style={styles.facts}>
          <Fact icon={Calendar03Icon} text={nextMatch.date} />
          <Fact icon={Location01Icon} text={nextMatch.venue} />
        </View>

        <ActionButton label="Comprar boletas" icon={Ticket01Icon} fullWidth />
      </View>
    </Glass>
  );
}

function Fact({ icon, text }: { icon: typeof Calendar03Icon; text: string }) {
  return (
    <View style={styles.fact}>
      <Icon icon={icon} size={18} color="accentText" />
      <AppText variant="body" color="textSecondary" style={styles.factText}>
        {text}
      </AppText>
    </View>
  );
}

function PostCard({ post }: { post: Post }) {
  const { colors } = useTheme();
  const { team } = useTeam();
  const [liked, setLiked] = useState(false);
  const likes = post.likes + (liked ? 1 : 0);

  return (
    <Glass radius={Radius.panel} strength="strong">
      <View style={styles.post}>
        <View style={styles.postHead}>
          <Crest initials={team.initials} size={36} />
          <View style={styles.postMeta}>
            <AppText variant="label">{team.name}</AppText>
            <AppText variant="caption" color="textTertiary">
              {post.time}
            </AppText>
          </View>
        </View>

        <PostBody post={post} />

        <View style={[styles.actions, { borderTopColor: colors.line }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={liked ? 'Quitar me gusta' : 'Me gusta'}
            accessibilityState={{ selected: liked }}
            onPress={() => setLiked((v) => !v)}
            style={styles.action}>
            <Icon icon={FavouriteIcon} size={20} color={liked ? 'danger' : 'textSecondary'} />
            <AppText variant="caption" color={liked ? 'danger' : 'textSecondary'} style={styles.num}>
              {likes.toLocaleString('es-CO')}
            </AppText>
          </Pressable>
          <View style={styles.action}>
            <Icon icon={Comment01Icon} size={20} color="textSecondary" />
            <AppText variant="caption" color="textSecondary" style={styles.num}>
              {post.comments}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Compartir"
            style={[styles.action, styles.shareAction]}>
            <Icon icon={Share08Icon} size={20} color="textSecondary" />
          </Pressable>
        </View>
      </View>
    </Glass>
  );
}

function PostBody({ post }: { post: Post }) {
  const { colors } = useTheme();
  const { team } = useTeam();

  if (post.kind === 'result') {
    return (
      <View style={styles.bodyGap}>
        <View style={styles.score}>
          <AppText variant="caption" color="textSecondary">
            Final
          </AppText>
          <AppText variant="amount" style={styles.scoreText} accessibilityLabel={`${team.short} ${post.score.home}, ${post.rival} ${post.score.away}`}>
            {post.score.home} – {post.score.away}
          </AppText>
          <AppText variant="label" color="textSecondary">
            vs. {post.rival}
          </AppText>
        </View>
        <AppText variant="body">{post.text}</AppText>
        <AppText variant="caption" color="accentText">
          {post.scorers}
        </AppText>
      </View>
    );
  }

  if (post.kind === 'lineup') {
    return (
      <View style={styles.bodyGap}>
        <AppText variant="title">{post.title}</AppText>
        <View>
          {post.lines.map((line, i) => (
            <View
              key={line.role}
              style={[
                styles.lineRow,
                i > 0 && { borderTopColor: colors.line, borderTopWidth: StyleSheet.hairlineWidth },
              ]}>
              <AppText variant="caption" color="accentText" style={styles.role}>
                {line.role}
              </AppText>
              <AppText variant="body" style={styles.names}>
                {line.names}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.bodyGap}>
      <AppText variant="title">{post.title}</AppText>
      <AppText variant="body" color="textSecondary">
        {post.text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  match: {},
  matchBody: { padding: Spacing.four, gap: Spacing.four },
  versus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  side: { alignItems: 'center', gap: Spacing.one, flex: 1 },
  sideName: { textAlign: 'center' },
  facts: { gap: Spacing.one },
  fact: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  factText: { flexShrink: 1 },
  feed: { gap: Spacing.three },
  post: { padding: Spacing.three, gap: Spacing.three },
  postHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  postMeta: { flex: 1 },
  bodyGap: { gap: Spacing.one },
  score: { alignItems: 'center', paddingVertical: Spacing.one },
  scoreText: { fontSize: 44, lineHeight: 50 },
  lineRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  role: { width: 64, paddingTop: 3 },
  names: { flex: 1 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.one,
    gap: Spacing.four,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    minHeight: 44,
  },
  shareAction: { marginLeft: 'auto', minWidth: 44, justifyContent: 'flex-end' },
  num: { fontVariant: ['tabular-nums'] },
});
