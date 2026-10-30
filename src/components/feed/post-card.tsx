import { Comment01Icon, FavouriteIcon, Share08Icon } from '@hugeicons/core-free-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Crest } from '@/components/crest';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTeam } from '@/context/team';
import type { Post } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';

/** Publicación del club. El cuerpo cambia según el tipo (resultado, noticia, alineación). */
export function PostCard({ post }: { post: Post }) {
  const { colors } = useTheme();
  const { team } = useTeam();
  const [liked, setLiked] = useState(false);
  const likes = post.likes + (liked ? 1 : 0);

  return (
    <Glass radius={Radius.panel} strength="strong">
      <View style={styles.post}>
        <View style={styles.head}>
          <Crest team={team} size={36} />
          <View style={styles.meta}>
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
            style={[styles.action, styles.share]}>
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
          <AppText
            variant="amount"
            style={styles.scoreText}
            accessibilityLabel={`${team.shortName} ${post.score.home}, ${post.rival} ${post.score.away}`}>
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
  post: { padding: Spacing.three, gap: Spacing.three },
  head: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  meta: { flex: 1 },
  bodyGap: { gap: Spacing.one },
  score: { alignItems: 'center', paddingVertical: Spacing.one },
  scoreText: { fontSize: 44, lineHeight: 50 },
  lineRow: { flexDirection: 'row', gap: Spacing.three, paddingVertical: Spacing.one },
  role: { width: 64, paddingTop: 3 },
  names: { flex: 1 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.one,
    gap: Spacing.four,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, minHeight: 44 },
  share: { marginLeft: 'auto', minWidth: 44, justifyContent: 'flex-end' },
  num: { fontVariant: ['tabular-nums'] },
});
