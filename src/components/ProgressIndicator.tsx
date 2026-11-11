import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/AppText';
import { ProgressGradientFill } from '@/components/ProgressGradientFill';
import { colors, layout, spacing, typography } from '@/theme';

type ProgressIndicatorProps = {
  label: string;
  progress: number;
};

export function ProgressIndicator({ label, progress }: ProgressIndicatorProps) {
  return (
    <View style={styles.container} accessibilityLabel={`${label}, ${Math.round(progress * 100)}%`}>
      <Text style={styles.label}>{label}</Text>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        style={styles.track}>
        <ProgressGradientFill progress={progress} style={styles.fill} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.small,
  },
  track: {
    width: layout.progressTrackWidth,
    height: layout.progressTrackHeight,
    overflow: 'hidden',
    borderRadius: layout.buttonPillRadius,
    backgroundColor: colors.progressTrack,
  },
  fill: {
    height: '100%',
    borderRadius: layout.buttonPillRadius,
    overflow: 'hidden',
  },
});
