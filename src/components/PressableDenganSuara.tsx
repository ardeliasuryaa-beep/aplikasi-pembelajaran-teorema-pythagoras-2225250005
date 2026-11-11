import { forwardRef, type ComponentRef } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { bunyiTap } from '@/utils/suara';

type Props = PressableProps & {
  bunyi?: 'tap' | 'tanpa';
};

export const PressableDenganSuara = forwardRef<ComponentRef<typeof Pressable>, Props>(
  function PressableDenganSuara({ bunyi = 'tap', disabled, onPress, ...props }, ref) {
    return (
      <Pressable
        ref={ref}
        {...props}
        disabled={disabled}
        onPress={(event) => {
          if (disabled) {
            return;
          }
          if (bunyi === 'tap') {
            bunyiTap();
          }
          onPress?.(event);
        }}
      />
    );
  }
);
