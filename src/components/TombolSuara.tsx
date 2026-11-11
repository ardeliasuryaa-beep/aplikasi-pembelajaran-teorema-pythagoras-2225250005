import { useSyncExternalStore } from 'react';
import { Path, Svg } from 'react-native-svg';
import { StyleSheet } from 'react-native';

import { PressableDenganSuara } from '@/components/PressableDenganSuara';
import { aturSuaraAktif, getSuaraAktif, subscribeSuara } from '@/utils/suara';
import { colors, layout } from '@/theme';

export function TombolSuara() {
  const aktif = useSyncExternalStore(subscribeSuara, getSuaraAktif, getSuaraAktif);

  return (
    <PressableDenganSuara
      accessibilityRole="switch"
      accessibilityLabel={aktif ? 'Matikan suara' : 'Nyalakan suara'}
      accessibilityState={{ checked: aktif }}
      bunyi="tanpa"
      onPress={() => aturSuaraAktif(!aktif)}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Svg
        width={layout.soundIconSize}
        height={layout.soundIconSize}
        viewBox="0 0 22 20"
        fill="none"
        aria-hidden={true}>
        <Path
          d={layout.soundSpeakerPath}
          fill={aktif ? colors.primary : 'none'}
          stroke={colors.primaryDark}
          strokeWidth={layout.soundStrokeWidth}
          strokeLinejoin="round"
        />
        <Path
          d={aktif ? layout.soundWavePath : layout.soundMutePath}
          fill="none"
          stroke={colors.primaryDark}
          strokeWidth={layout.soundStrokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    </PressableDenganSuara>
  );
}

const styles = StyleSheet.create({
  button: {
    width: layout.soundToggleSize,
    height: layout.soundToggleSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.buttonPillRadius,
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.lilac,
    transform: [{ scale: layout.pressScale }],
  },
});
