import { StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme';

type Props = {
  progress: number;
  style: ViewStyle;
};

export function ProgressGradientFill({ progress, style }: Props) {
  const width = `${Math.min(1, Math.max(0, progress)) * 100}%` as `${number}%`;

  return (
    <View style={[style, { width }]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} viewBox="0 0 100 8" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="progressFillGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.primary} />
            <Stop offset="1" stopColor={colors.primary} stopOpacity={0.72} />
          </LinearGradient>
        </Defs>
        <Rect width="100" height="8" fill="url(#progressFillGradient)" />
      </Svg>
    </View>
  );
}
