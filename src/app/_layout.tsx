import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Nunito_400Regular,
    Nunito_600SemiBold,
  });

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.root}>
        <BackgroundGradient />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <BackgroundGradient />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

function BackgroundGradient() {
  return (
    <Svg
      pointerEvents="none"
      width="100%"
      height="100%"
      style={StyleSheet.absoluteFill}
      preserveAspectRatio="none"
      aria-hidden={true}>
      <Defs>
        <LinearGradient id="appBackground" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.backgroundStart} />
          <Stop offset="0.48" stopColor={colors.backgroundMid} />
          <Stop offset="1" stopColor={colors.backgroundEnd} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#appBackground)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
