import { NewsIcon, Settings02Icon, Wallet01Icon } from '@hugeicons/core-free-icons';
import { type IconSvgElement } from '@hugeicons/react-native';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  type TabTriggerSlotProps,
  type TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { Backdrop } from '@/components/backdrop';
import { Glass, nativeGlass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { MaxContentWidth, Radius, Spacing, TabBarGap, TabBarHeight } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  return (
    <View style={styles.root}>
      <Backdrop />
      <Tabs style={styles.root}>
        <TabSlot style={styles.slot} />
        <TabList asChild>
          <FloatingTabList>
            <TabTrigger name="index" href="/" asChild>
              <TabButton icon={NewsIcon} label="Feed" />
            </TabTrigger>
            <TabTrigger name="wallet" href="/wallet" asChild>
              <TabButton icon={Wallet01Icon} label="Billetera" />
            </TabTrigger>
            <TabTrigger name="settings" href="/settings" asChild>
              <TabButton icon={Settings02Icon} label="Equipo" />
            </TabTrigger>
          </FloatingTabList>
        </TabList>
      </Tabs>
    </View>
  );
}

type TabButtonProps = TabTriggerSlotProps & { icon: IconSvgElement; label: string };

function TabButton({ icon, label, isFocused, ...props }: TabButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      {...(props as PressableProps)}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!isFocused }}
      style={({ pressed }) => [
        styles.tab,
        isFocused && !nativeGlass && { backgroundColor: colors.primary },
        pressed && !isFocused && styles.pressed,
      ]}>
      {isFocused && nativeGlass ? (
        <Glass
          radius={Radius.full}
          tint="rgba(0, 110, 183, 0.92)"
          interactive
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <Icon icon={icon} size={24} color={isFocused ? 'onPrimary' : 'textSecondary'} />
      <AppText variant="caption" color={isFocused ? 'onPrimary' : 'textSecondary'}>
        {label}
      </AppText>
    </Pressable>
  );
}

function FloatingTabList(props: TabListProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      pointerEvents="box-none"
      style={[styles.listWrap, { bottom: Math.max(insets.bottom, Spacing.one) + TabBarGap }]}>
      <Glass radius={Radius.full} interactive style={styles.list}>
        <View style={styles.listInner}>{props.children}</View>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  slot: { flex: 1 },
  listWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  list: {
    width: '100%',
    maxWidth: MaxContentWidth - Spacing.five,
    height: TabBarHeight,
  },
  listInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 4,
  },
  tab: {
    flex: 1,
    height: '100%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: Radius.full,
  },
  pressed: { opacity: 0.6 },
});
