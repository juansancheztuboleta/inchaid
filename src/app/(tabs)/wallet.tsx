import { Login03Icon, RefreshIcon } from '@hugeicons/core-free-icons';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SdkView, type SdkError } from '../../../modules/sdk';
import { AppText } from '@/components/app-text';
import { ActionButton } from '@/components/buttons';
import { Glass } from '@/components/glass';
import { Screen } from '@/components/screen';
import { Radius, Spacing, TabBarGap, TabBarHeight } from '@/constants/theme';
import { useTheme, useCopy } from '@/hooks/use-theme';
import { useTixngo } from '@/hooks/use-tixngo';

export default function WalletScreen() {
  const copy = useCopy();
  const { status, login } = useTixngo();
  const [viewError, setViewError] = useState<SdkError | null>(null);

  if (status.kind === 'ready' && !viewError) {
    return <EmbeddedWallet onError={setViewError} />;
  }

  return (
    <Screen title={copy.wallet.title}>
      {status.kind === 'loading' ? <Loading /> : null}

      {status.kind === 'unavailable' ? <Message text={copy.wallet.unavailable} /> : null}

      {status.kind === 'signedOut' ? (
        <Message title={copy.wallet.signInTitle} text={copy.wallet.signInHint}>
          <ActionButton label={copy.wallet.signIn} icon={Login03Icon} onPress={login} fullWidth />
        </Message>
      ) : null}

      {status.kind === 'error' || viewError ? (
        <Message
          title={copy.wallet.errorTitle}
          text={viewError ? describe(viewError) : status.kind === 'error' ? status.message : ''}>
          <ActionButton
            label={copy.wallet.retry}
            icon={RefreshIcon}
            tone="solid"
            fullWidth
            onPress={() => {
              setViewError(null);
              if (status.kind !== 'ready') login();
            }}
          />
        </Message>
      ) : null}
    </Screen>
  );
}

/** El SDK ocupa toda la pestaña, entre la barra de estado y la barra de tabs flotante. */
function EmbeddedWallet({ onError }: { onError: (error: SdkError) => void }) {
  const insets = useSafeAreaInsets();
  const [loaded, setLoaded] = useState(false);

  return (
    <View
      style={[
        styles.embedded,
        { paddingTop: insets.top, paddingBottom: insets.bottom + TabBarHeight + TabBarGap },
      ]}>
      <SdkView
        widget="home"
        style={styles.sdk}
        onLoad={() => setLoaded(true)}
        onError={(event) => onError(event.nativeEvent)}
      />
      {loaded ? null : (
        <View style={styles.overlay} pointerEvents="none">
          <Loading />
        </View>
      )}
    </View>
  );
}

function Loading() {
  const { colors } = useTheme();
  return <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />;
}

function Message({ title, text, children }: { title?: string; text: string; children?: ReactNode }) {
  return (
    <Glass radius={Radius.panel} strength="strong">
      <View style={styles.message}>
        {title ? <AppText variant="headline">{title}</AppText> : null}
        <AppText color="textSecondary">{text}</AppText>
        {children}
      </View>
    </Glass>
  );
}

// TIXNGO pone el nombre del error (NO_TICKET_ELIGIBILITY, ...) en userInfo.error.
function describe(error: SdkError) {
  const detail = error.userInfo?.error;
  return `${error.message} (${error.code})${detail ? `\n${detail}` : ''}`;
}

const styles = StyleSheet.create({
  embedded: { flex: 1 },
  sdk: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, justifyContent: 'center' as const },
  loading: { paddingVertical: Spacing.six },
  message: { padding: Spacing.four, gap: Spacing.three },
});
