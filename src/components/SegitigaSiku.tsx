import { Platform } from 'react-native';
import { lazy, Suspense, useCallback, useState } from 'react';

import {
  SegitigaSikuSvg,
  type SegitigaSikuProps,
} from '@/components/SegitigaSikuSvg';

const VisualisasiSegitiga3D = lazy(() =>
  import('@/components/VisualisasiSegitiga3D').then((module) => ({
    default: module.VisualisasiSegitiga3D,
  }))
);

export type { NamaSisi, OrientasiSegitiga } from '@/components/SegitigaSikuSvg';
export type { SegitigaSikuProps } from '@/components/SegitigaSikuSvg';

export function SegitigaSiku(props: SegitigaSikuProps) {
  const [webglTidakTersedia, setWebglTidakTersedia] = useState(false);
  const beralihKeSvg = useCallback(() => setWebglTidakTersedia(true), []);

  if (Platform.OS !== 'web' || webglTidakTersedia) {
    return <SegitigaSikuSvg {...props} />;
  }

  return (
    <Suspense fallback={<SegitigaSikuSvg {...props} />}>
      <VisualisasiSegitiga3D
        {...props}
        saatWebglTidakTersedia={beralihKeSvg}
      />
    </Suspense>
  );
}
