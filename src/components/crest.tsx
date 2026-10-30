import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { readableOn } from '@/lib/color';
import type { Team } from '@/types/team';

type CrestProps = {
  team: Pick<Team, 'initials' | 'colors' | 'crestUrl'>;
  size?: number;
};

/**
 * Escudo del club. Si la API entrega `crestUrl` se muestra la imagen; mientras no exista o si
 * falla la descarga, se dibuja un disco con los colores del club y sus iniciales.
 */
export function Crest({ team, size = 40 }: CrestProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (team.crestUrl && failedUrl !== team.crestUrl) {
    return (
      <Image
        source={{ uri: team.crestUrl }}
        contentFit="contain"
        transition={150}
        accessible={false}
        onError={() => setFailedUrl(team.crestUrl)}
        style={{ width: size, height: size }}
      />
    );
  }

  const primary = team.colors.primary.hex;
  const ring = readableOn(primary) === '#ffffff' ? team.colors.secondary.hex : '#ffffff';

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.disc,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: primary,
          borderColor: ring,
          borderWidth: Math.max(2, size / 20),
        },
      ]}>
      <AppText
        variant="label"
        style={{
          fontSize: size * 0.34,
          lineHeight: size * 0.42,
          color: readableOn(primary),
        }}>
        {team.initials}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
