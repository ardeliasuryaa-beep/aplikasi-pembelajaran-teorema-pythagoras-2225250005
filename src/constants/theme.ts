/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { colors, layout, spacing, typography } from '@/theme';

export const Colors = {
  light: {
    text: colors.text,
    background: colors.background,
    backgroundElement: colors.surface,
    backgroundSelected: colors.neutral,
    textSecondary: colors.textSecondary,
  },
  dark: {
    text: colors.dark.text,
    background: colors.dark.background,
    backgroundElement: colors.dark.surface,
    backgroundSelected: colors.dark.neutral,
    textSecondary: colors.dark.textSecondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = typography.fontFamily;

export const Spacing = {
  half: spacing.xxs,
  one: spacing.xs,
  two: spacing.sm,
  three: spacing.lg,
  four: spacing.xl,
  five: spacing.xxl,
  six: spacing.xxxl,
} as const;

export const BottomTabInset = 0;
export const MaxContentWidth = layout.contentMaxWidth;
