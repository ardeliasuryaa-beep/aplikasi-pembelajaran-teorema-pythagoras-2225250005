import { Path, Svg, Text as SvgText } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';

import { PressableDenganSuara } from '@/components/PressableDenganSuara';
import { colors, typography } from '@/theme';

export type NamaSisi = 'alas' | 'tegak' | 'miring';
export type OrientasiSegitiga = 0 | 90 | 180 | 270;

type Titik = {
  x: number;
  y: number;
};

type SisiSegitiga = Record<NamaSisi, number | string | null>;

export type SegitigaSikuProps = {
  sisi?: SisiSegitiga;
  satuan?: string;
  orientasi?: OrientasiSegitiga;
  cermin?: boolean;
  yangDicari?: NamaSisi;
  sisiAktif?: NamaSisi;
  tampilkanMiring?: boolean;
  tampilkanSemuaNamaSisi?: boolean;
  tampilkanVariabel?: boolean;
  tampilkanNilaiYangDicari?: boolean;
  warnaBerdasarkanPeran?: boolean;
  onPilihSisi?: (sisi: NamaSisi) => void;
};

const TENGAH = { x: 160, y: 130 };
const VIEW_BOX = { x: -80, y: -10, width: 480, height: 280 };
const TITIK_SIKU: Titik = { x: 80, y: 180 };
const TITIK_TEGAK: Titik = { x: 80, y: 55 };
const TITIK_ALAS: Titik = { x: 240, y: 180 };
const LABEL: Record<NamaSisi, string> = {
  alas: 'Alas',
  tegak: 'Tegak',
  miring: 'Miring',
};
const VARIABEL: Record<NamaSisi, string> = {
  alas: 'a',
  tegak: 'b',
  miring: 'c',
};

function transformasi(
  titik: Titik,
  orientasi: OrientasiSegitiga,
  cermin: boolean
): Titik {
  const x = cermin ? TENGAH.x * 2 - titik.x : titik.x;
  const radian = (orientasi * Math.PI) / 180;
  const dx = x - TENGAH.x;
  const dy = titik.y - TENGAH.y;

  return {
    x: TENGAH.x + dx * Math.cos(radian) - dy * Math.sin(radian),
    y: TENGAH.y + dx * Math.sin(radian) + dy * Math.cos(radian),
  };
}

function perkiraanLebarTeks(teks: string, ukuranFont: number) {
  const lebarKarakter = (karakter: string) => {
    if (karakter === ' ') return 0.3;
    if (/[A-Z]/.test(karakter)) return 0.68;
    if (/[0-9]/.test(karakter)) return 0.58;
    if (/[=?]/.test(karakter)) return 0.4;
    return 0.55;
  };

  return (
    [...teks].reduce((jumlah, karakter) => jumlah + lebarKarakter(karakter), 0) *
    ukuranFont *
    1.1
  );
}

function posisiLabelSisi(
  awal: Titik,
  akhir: Titik,
  pusat: Titik,
  teks: string,
  ukuranFont: number
) {
  const tengah = { x: (awal.x + akhir.x) / 2, y: (awal.y + akhir.y) / 2 };
  const sisiX = akhir.x - awal.x;
  const sisiY = akhir.y - awal.y;
  const panjangSisi = Math.hypot(sisiX, sisiY);
  const normalPertama = { x: -sisiY / panjangSisi, y: sisiX / panjangSisi };
  const arahKeluar = { x: tengah.x - pusat.x, y: tengah.y - pusat.y };
  const normal = normalPertama.x * arahKeluar.x + normalPertama.y * arahKeluar.y > 0
    ? normalPertama
    : { x: -normalPertama.x, y: -normalPertama.y };
  const textAnchor: 'start' | 'middle' | 'end' =
    Math.abs(normal.x) > Math.abs(normal.y)
      ? normal.x < 0
        ? 'end'
        : 'start'
      : 'middle';
  const lebar = perkiraanLebarTeks(teks, ukuranFont);
  const batasX =
    textAnchor === 'start'
      ? [0, lebar]
      : textAnchor === 'end'
        ? [-lebar, 0]
        : [-lebar / 2, lebar / 2];
  const batasY = [-ukuranFont * 0.9, ukuranFont * 0.25];
  const jarakKeTeksX = normal.x * (normal.x >= 0 ? batasX[0] : batasX[1]);
  const jarakKeTeksY = normal.y * (normal.y >= 0 ? batasY[0] : batasY[1]);
  const jarakNormal = Math.max(24, 24 - jarakKeTeksX - jarakKeTeksY);

  return {
    posisi: {
      x: tengah.x + normal.x * jarakNormal,
      y: tengah.y + normal.y * jarakNormal,
    },
    textAnchor,
  };
}

function formatNilai(
  nilai: number | string | null | undefined,
  satuan: string,
  dicari: boolean,
  tampilkanNilaiYangDicari: boolean
) {
  if ((dicari && !tampilkanNilaiYangDicari) || nilai == null) {
    return '?';
  }
  return `${nilai}${satuan ? ` ${satuan}` : ''}`;
}

export function SegitigaSikuSvg({
  sisi = { alas: 3, tegak: 4, miring: 5 },
  satuan = '',
  orientasi = 0,
  cermin = false,
  yangDicari,
  sisiAktif,
  tampilkanMiring = false,
  tampilkanSemuaNamaSisi = false,
  tampilkanVariabel = false,
  tampilkanNilaiYangDicari = false,
  warnaBerdasarkanPeran = false,
  onPilihSisi,
}: SegitigaSikuProps) {
  const siku = transformasi(TITIK_SIKU, orientasi, cermin);
  const tegak = transformasi(TITIK_TEGAK, orientasi, cermin);
  const alas = transformasi(TITIK_ALAS, orientasi, cermin);
  const pusat = {
    x: (siku.x + tegak.x + alas.x) / 3,
    y: (siku.y + tegak.y + alas.y) / 3,
  };
  const sisiGambar = [
    { nama: 'alas' as const, awal: siku, akhir: alas },
    { nama: 'tegak' as const, awal: siku, akhir: tegak },
    { nama: 'miring' as const, awal: tegak, akhir: alas },
  ];
  const arahAlas = {
    x: (alas.x - siku.x) / Math.hypot(alas.x - siku.x, alas.y - siku.y),
    y: (alas.y - siku.y) / Math.hypot(alas.x - siku.x, alas.y - siku.y),
  };
  const arahTegak = {
    x: (tegak.x - siku.x) / Math.hypot(tegak.x - siku.x, tegak.y - siku.y),
    y: (tegak.y - siku.y) / Math.hypot(tegak.x - siku.x, tegak.y - siku.y),
  };
  const penandaA = { x: siku.x + arahAlas.x * 14, y: siku.y + arahAlas.y * 14 };
  const penandaB = {
    x: penandaA.x + arahTegak.x * 14,
    y: penandaA.y + arahTegak.y * 14,
  };
  const penandaC = { x: siku.x + arahTegak.x * 14, y: siku.y + arahTegak.y * 14 };
  const garis = (a: Titik, b: Titik) => `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const sisiInfo = (nama: NamaSisi, awal: Titik, akhir: Titik) => {
    const nilai = formatNilai(
      sisi[nama],
      satuan,
      yangDicari === nama,
      tampilkanNilaiYangDicari
    );
    const namaTampil = tampilkanSemuaNamaSisi || (nama === 'miring' && tampilkanMiring);
    const labelNama = tampilkanVariabel
      ? `${LABEL[nama]} ${VARIABEL[nama]} = `
      : `${LABEL[nama]} `;
    const teks = namaTampil ? `${labelNama}${nilai}` : nilai;
    const { posisi, textAnchor } = posisiLabelSisi(
      awal,
      akhir,
      pusat,
      teks,
      typography.sideLabel
    );
    const warna = colors.sideLabel;

    return (
      <SvgText
        key={nama}
        x={posisi.x}
        y={posisi.y}
        fill={warna}
        fontSize={typography.sideLabel}
        fontFamily={typography.fontFamily.headingMedium}
        fontWeight={typography.weightMedium}
        textAnchor={textAnchor}
        accessibilityLabel={
          namaTampil
            ? `${LABEL[nama]}, ${nilai === '?' ? 'belum diketahui' : nilai}`
            : `${nilai === '?' ? 'Belum diketahui' : nilai}`
        }>
        {teks}
      </SvgText>
    );
  };

  const warnaSisi = (nama: NamaSisi) => {
    if (warnaBerdasarkanPeran) {
      return yangDicari === nama ? colors.primary : colors.sideKnown;
    }
    if (nama === 'miring' && tampilkanMiring) {
      return colors.primary;
    }
    if (tampilkanSemuaNamaSisi && sisiAktif === nama) {
      return colors.primary;
    }
    return colors.sideKnown;
  };

  return (
    <View style={styles.diagram}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}>
        {sisiGambar.map(({ nama, awal, akhir }) => (
          <Path
            key={nama}
            d={garis(awal, akhir)}
            stroke={warnaSisi(nama)}
            strokeOpacity={
              warnaBerdasarkanPeran && yangDicari !== nama ? 0.58 : 1
            }
            strokeWidth={warnaBerdasarkanPeran && yangDicari === nama ? 5 : 4}
          />
        ))}

        <Path
          d={`M ${penandaA.x} ${penandaA.y} L ${penandaB.x} ${penandaB.y} L ${penandaC.x} ${penandaC.y}`}
          fill="none"
          stroke={colors.text}
          strokeWidth={2}
        />
        {sisiInfo('alas', siku, alas)}
        {sisiInfo('tegak', siku, tegak)}
        {sisiInfo('miring', tegak, alas)}
      </Svg>
      {onPilihSisi &&
        sisiGambar.map(({ nama, awal, akhir }) => {
          const panjang = Math.hypot(akhir.x - awal.x, akhir.y - awal.y);
          const sudut = Math.atan2(akhir.y - awal.y, akhir.x - awal.x);

          return (
            <PressableDenganSuara
              bunyi="tanpa"
              key={nama}
              accessibilityRole="button"
              accessibilityLabel={`Pilih sisi dengan panjang ${formatNilai(
                sisi[nama],
                satuan,
                false,
                tampilkanNilaiYangDicari
              )}`}
              accessibilityState={{ selected: sisiAktif === nama }}
              onPress={() => onPilihSisi(nama)}
              style={[
                styles.sisiTap,
                {
                  left: `${
                    (((awal.x + akhir.x - panjang) / 2 - VIEW_BOX.x) /
                      VIEW_BOX.width) *
                    100
                  }%`,
                  top: `${
                    (((awal.y + akhir.y - 48) / 2 - VIEW_BOX.y) /
                      VIEW_BOX.height) *
                    100
                  }%`,
                  width: `${(panjang / VIEW_BOX.width) * 100}%`,
                  transform: [{ rotate: `${sudut}rad` }],
                },
              ]}
            />
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  diagram: {
    width: '100%',
    aspectRatio: VIEW_BOX.width / VIEW_BOX.height,
    position: 'relative',
  },
  sisiTap: {
    position: 'absolute',
    height: '18.5%',
    minHeight: 48,
    backgroundColor: 'transparent',
  },
});
