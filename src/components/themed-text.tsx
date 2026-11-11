import { StyleSheet, Text, type TextProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { colors, typography } from '@/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.caption,
    lineHeight: typography.captionLineHeight,
    fontWeight: typography.weightRegular,
  },
  smallBold: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.caption,
    lineHeight: typography.captionLineHeight,
    fontWeight: typography.weightSemiBold,
  },
  default: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
    fontWeight: typography.weightRegular,
  },
  title: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.screenTitle,
    fontWeight: typography.weightSemiBold,
    lineHeight: typography.headingLineHeight,
  },
  subtitle: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.subtitle,
    lineHeight: typography.subtitleLineHeight,
    fontWeight: typography.weightSemiBold,
  },
  link: {
    fontFamily: typography.fontFamily.headingMedium,
    lineHeight: typography.bodyLineHeight,
    fontSize: typography.body,
  },
  linkPrimary: {
    fontFamily: typography.fontFamily.headingMedium,
    lineHeight: typography.bodyLineHeight,
    fontSize: typography.body,
    color: colors.primaryDark,
  },
  code: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontWeight: typography.weightSemiBold,
    fontSize: typography.small,
  },
});
