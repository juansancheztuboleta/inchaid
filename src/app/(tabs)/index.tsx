import { NotificationIcon } from '@hugeicons/core-free-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { GlassIconButton } from '@/components/buttons';
import { NextMatchCard } from '@/components/feed/next-match-card';
import { PostCard } from '@/components/feed/post-card';
import { Screen } from '@/components/screen';
import { Spacing } from '@/constants/theme';
import { useTeam } from '@/context/team';
import { postsOf } from '@/data/mock';
import { useCopy } from '@/hooks/use-theme';
import { fill } from '@/theme/copy';

export default function TeamFeedScreen() {
  const { team } = useTeam();
  const copy = useCopy();
  const posts = postsOf(team);

  return (
    <Screen
      title={fill(copy.feed.title, { short: team.shortName, team: team.name })}
      trailing={<GlassIconButton icon={NotificationIcon} label="Notificaciones" badge />}>
      <NextMatchCard />
      <View style={styles.feed}>
        <AppText variant="headline" accessibilityRole="header">
          {copy.feed.sectionTitle}
        </AppText>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  feed: { gap: Spacing.three },
});
