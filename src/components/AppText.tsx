import { Text, type TextProps } from 'react-native';

import { typography } from '@/theme';

export function AppText({ style, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: typography.fontFamily.body,
          fontSize: typography.body,
          lineHeight: typography.bodyLineHeight,
        },
        style,
      ]}
    />
  );
}
