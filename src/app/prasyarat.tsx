import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { AppText as Text } from '@/components/AppText';
import { PressableDenganSuara } from '@/components/PressableDenganSuara';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SegitigaSiku } from '@/components/SegitigaSiku';
import { TombolSuara } from '@/components/TombolSuara';
import {
  kartuPrasyarat,
  soalCepatPrasyarat,
  type KartuPrasyarat,
  type SoalCepatPrasyarat,
} from '@/data/prasyarat';
import { completeActivity } from '@/utils/activity-progress';
import { bunyiBenar, bunyiSalah, bunyiSelesai, bunyiTap } from '@/utils/suara';
import { colors, glassCardShadow, layout, spacing, typography } from '@/theme';

type TahapPrasyarat = 'kartu' | 'soal' | 'ringkasan';

function IlustrasiPetak() {
  const cells = layout.prerequisiteSquareGridSize / layout.prerequisiteSquareCellSize;

  return (
    <Svg
      width="100%"
      height={layout.prerequisiteSquareHeight}
      viewBox={layout.prerequisiteSquareViewBox}
      accessibilityLabel="Persegi dengan sembilan petak, tiga kali tiga">
      {Array.from({ length: cells * cells }, (_, index) => {
        const kolom = index % cells;
        const baris = Math.floor(index / cells);
        return (
          <Rect
            key={index}
            x={layout.prerequisiteSquareStart + kolom * layout.prerequisiteSquareCellSize}
            y={layout.prerequisiteSquareStart + baris * layout.prerequisiteSquareCellSize}
            width={layout.prerequisiteSquareCellSize}
            height={layout.prerequisiteSquareCellSize}
            fill={colors.lilac}
            stroke={colors.primaryDark}
            strokeWidth={layout.iconStrokeWidth}
          />
        );
      })}
      <SvgText
        x={layout.prerequisiteSquareLabelX}
        y={layout.prerequisiteSquareLabelY}
        fill={colors.primaryDark}
        fontFamily={typography.fontFamily.headingMedium}
        fontSize={typography.subtitle}
        fontWeight={typography.weightMedium}>
        3 × 3 = 9
      </SvgText>
      <SvgText
        x={layout.prerequisiteSquareLabelX}
        y={layout.prerequisiteSquareLabelY + typography.bodyLineHeight}
        fill={colors.textSecondary}
        fontFamily={typography.fontFamily.body}
        fontSize={typography.caption}>
        petak
      </SvgText>
    </Svg>
  );
}

function IlustrasiPilihanSegitiga({ sikuSiku }: { sikuSiku: boolean }) {
  return (
    <Svg
      width="100%"
      height={layout.prerequisiteTriangleHeight}
      viewBox={layout.prerequisiteTriangleViewBox}
      accessibilityLabel={sikuSiku ? 'Segitiga dengan sudut siku-siku' : 'Segitiga tanpa sudut siku-siku'}>
      <Polygon
        points={
          sikuSiku
            ? layout.prerequisiteTriangleRightPoints
            : layout.prerequisiteTriangleOtherPoints
        }
        fill={colors.surface}
        stroke={colors.primaryDark}
        strokeWidth={layout.heroStrokeWidth}
        strokeLinejoin="round"
      />
      {sikuSiku ? (
        <Path
          d={layout.prerequisiteTriangleRightPath}
          fill="none"
          stroke={colors.primaryDark}
          strokeWidth={layout.heroRightAngleStrokeWidth}
        />
      ) : null}
    </Svg>
  );
}

export default function Prasyarat() {
  const [tahap, setTahap] = useState<TahapPrasyarat>('kartu');
  const [indeksKartu, setIndeksKartu] = useState(0);
  const [indeksSoal, setIndeksSoal] = useState(0);
  const [ulangiSatuKartu, setUlangiSatuKartu] = useState(false);
  const [ulangPenjelasan, setUlangPenjelasan] = useState(false);
  const [jawaban, setJawaban] = useState('');
  const [umpanBalik, setUmpanBalik] = useState('');
  const [jawabanBenar, setJawabanBenar] = useState(false);
  const [petunjukIndex, setPetunjukIndex] = useState(-1);
  const [pernahSalah, setPernahSalah] = useState(false);
  const [jumlahBenar, setJumlahBenar] = useState(0);
  const [kartuUntukDiulang, setKartuUntukDiulang] = useState<KartuPrasyarat['id'][]>([]);

  const kartu = kartuPrasyarat[indeksKartu];
  const soal = soalCepatPrasyarat[indeksSoal];

  function bersihkanSoal() {
    setJawaban('');
    setUmpanBalik('');
    setJawabanBenar(false);
    setPetunjukIndex(-1);
    setPernahSalah(false);
  }

  function tandaiKesalahan(id: SoalCepatPrasyarat['id']) {
    if (id === 'kuadrat' || id === 'akar' || id === 'segitiga') {
      setKartuUntukDiulang((sebelumnya) =>
        sebelumnya.includes(id) ? sebelumnya : [...sebelumnya, id]
      );
    }
  }

  function jawabBenar(teks: string) {
    setJawabanBenar(true);
    setUmpanBalik(teks);
    if (indeksSoal === soalCepatPrasyarat.length - 1) {
      if (!pernahSalah) {
        setJumlahBenar((sebelumnya) => sebelumnya + 1);
      }
      bunyiSelesai();
      completeActivity('prerequisite');
      setTahap('ringkasan');
    } else {
      if (!pernahSalah) {
        setJumlahBenar((sebelumnya) => sebelumnya + 1);
      }
      bunyiBenar();
    }
  }

  function jawabSalah(teks: string) {
    setPernahSalah(true);
    tandaiKesalahan(soal.id);
    setUmpanBalik(teks);
    setJawabanBenar(false);
    bunyiSalah();
  }

  function periksaJawabanAngka() {
    const angka = Number(jawaban.trim().replace(',', '.'));
    if (jawaban.trim() === '' || !Number.isFinite(angka)) {
      setUmpanBalik('Masukkan jawaban berupa angka terlebih dahulu.');
      return;
    }
    if (angka === soal.jawaban) {
      jawabBenar(soal.penjelasanBenar);
      return;
    }
    const kesalahan = soal.kesalahanUmum?.find((item) => item.jawaban === angka);
    jawabSalah(kesalahan?.penjelasan ?? soal.penjelasanSalah);
  }

  function pilihSegitiga(id: string) {
    if (jawabanBenar) return;
    if (id === soal.jawabanPilihan) {
      jawabBenar(soal.penjelasanBenar);
    } else {
      jawabSalah(soal.penjelasanSalah);
    }
  }

  function lanjutSoal() {
    if (indeksSoal >= soalCepatPrasyarat.length - 1) return;
    setIndeksSoal((sebelumnya) => sebelumnya + 1);
    bersihkanSoal();
  }

  function lanjutKartu() {
    if (ulangiSatuKartu) {
      setUlangiSatuKartu(false);
      setTahap('ringkasan');
      return;
    }
    if (indeksKartu < kartuPrasyarat.length - 1) {
      setIndeksKartu((sebelumnya) => sebelumnya + 1);
      setUlangPenjelasan(false);
      return;
    }
    setTahap('soal');
    bersihkanSoal();
  }

  function kembaliKartu() {
    if (ulangiSatuKartu) {
      setUlangiSatuKartu(false);
      setTahap('ringkasan');
      return;
    }
    if (indeksKartu > 0) {
      setIndeksKartu((sebelumnya) => sebelumnya - 1);
      setUlangPenjelasan(false);
    } else {
      router.push('/');
    }
  }

  function ulangiKartu(id: KartuPrasyarat['id']) {
    const index = kartuPrasyarat.findIndex((item) => item.id === id);
    if (index < 0) return;
    setIndeksKartu(index);
    setUlangiSatuKartu(true);
    setUlangPenjelasan(false);
    setTahap('kartu');
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <Link href="/" style={styles.backLink} onPress={bunyiTap}>
            ‹ Beranda
          </Link>
          <ProgressIndicator
            label={
              tahap === 'kartu'
                ? `Kartu ${indeksKartu + 1} dari ${kartuPrasyarat.length}`
                : tahap === 'soal'
                  ? `Soal ${indeksSoal + 1} dari ${soalCepatPrasyarat.length}`
                  : 'Selesai'
            }
            progress={
              tahap === 'kartu'
                ? (indeksKartu + 1) / kartuPrasyarat.length
                : tahap === 'soal'
                  ? (indeksSoal + 1) / soalCepatPrasyarat.length
                  : 1
            }
          />
        </View>

        <View style={styles.heading}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Prasyarat</Text>
            <TombolSuara />
          </View>
          {tahap === 'kartu' ? (
            <Text style={styles.stepTitle}>{kartu.judul}</Text>
          ) : tahap === 'soal' ? (
            <Text style={styles.stepTitle}>Coba ingatanmu</Text>
          ) : (
            <Text style={styles.stepTitle}>Ringkasan prasyarat</Text>
          )}
        </View>

        {tahap === 'kartu' ? (
          <>
            <View style={styles.reminderCard}>
              {kartu.id === 'kuadrat' ? (
                <IlustrasiPetak />
              ) : kartu.id === 'akar' ? (
                <View style={styles.rootIllustration}>
                  <Text style={styles.rootSymbol}>√</Text>
                  <Text style={styles.rootExamples}>{kartu.contoh}</Text>
                </View>
              ) : (
                <View style={styles.triangleIllustration}>
                  <SegitigaSiku />
                </View>
              )}
              <Text style={styles.body}>
                {ulangPenjelasan
                  ? kartu.penjelasanUlang
                  : kartu.penjelasan}
              </Text>
            </View>
            <View style={styles.navigation}>
              <View style={styles.secondaryActions}>
                <PressableDenganSuara
                  accessibilityRole="button"
                  onPress={kembaliKartu}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.pressedSecondary,
                  ]}>
                  <Text style={styles.secondaryButtonText}>Kembali</Text>
                </PressableDenganSuara>
                <PressableDenganSuara
                  accessibilityRole="button"
                  onPress={() => setUlangPenjelasan((sebelumnya) => !sebelumnya)}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.pressedSecondary,
                  ]}>
                  <Text style={styles.secondaryButtonText}>
                    {ulangPenjelasan ? 'Tutup penjelasan' : 'Ulangi penjelasan'}
                  </Text>
                </PressableDenganSuara>
              </View>
              <PressableDenganSuara
                accessibilityRole="button"
                onPress={lanjutKartu}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressedPrimary]}>
                <Text style={styles.primaryButtonText}>Lanjut</Text>
              </PressableDenganSuara>
            </View>
          </>
        ) : tahap === 'soal' ? (
          <>
            <View style={styles.questionCard}>
              <Text style={styles.instruction}>{soal.pertanyaan}</Text>
              {soal.jenis === 'angka' ? (
                <>
                  <View style={styles.answerRow}>
                    <TextInput
                      accessibilityLabel="Jawaban angka"
                      value={jawaban}
                      onChangeText={(teks) => {
                        setJawaban(teks);
                        setUmpanBalik('');
                      }}
                      onSubmitEditing={periksaJawabanAngka}
                      keyboardType="decimal-pad"
                      returnKeyType="done"
                      placeholder="Jawaban"
                      placeholderTextColor={colors.textSecondary}
                      style={styles.answerInput}
                    />
                    <PressableDenganSuara
                      bunyi="tanpa"
                      accessibilityRole="button"
                      onPress={periksaJawabanAngka}
                      style={({ pressed }) => [
                        styles.checkButton,
                        pressed && styles.pressedPrimary,
                      ]}>
                      <Text style={styles.primaryButtonText}>Periksa</Text>
                    </PressableDenganSuara>
                  </View>
                </>
              ) : (
                <View style={styles.triangleChoices}>
                  {soal.pilihan?.map((pilihan) => (
                    <PressableDenganSuara
                      bunyi="tanpa"
                      key={pilihan.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: jawabanBenar && pilihan.id === soal.jawabanPilihan }}
                      onPress={() => pilihSegitiga(pilihan.id)}
                      style={({ pressed }) => [
                        styles.triangleChoice,
                        jawabanBenar &&
                          pilihan.id === soal.jawabanPilihan &&
                          styles.selectedChoice,
                        pressed && !jawabanBenar && styles.pressedSecondary,
                      ]}>
                      <IlustrasiPilihanSegitiga sikuSiku={pilihan.sikuSiku} />
                      <Text style={styles.choiceLabel}>{pilihan.label}</Text>
                    </PressableDenganSuara>
                  ))}
                </View>
              )}
              {umpanBalik ? (
                <View
                  style={jawabanBenar ? styles.feedbackGood : styles.feedbackWrong}
                  accessibilityLiveRegion="polite">
                  <Text style={styles.feedbackText}>{umpanBalik}</Text>
                </View>
              ) : null}
              {petunjukIndex >= 0 ? (
                <View style={styles.hintCard} accessibilityLiveRegion="polite">
                  <Text style={styles.hintTitle}>Petunjuk {petunjukIndex + 1}</Text>
                  <Text style={styles.body}>{soal.petunjuk[petunjukIndex]}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.navigation}>
              {!jawabanBenar && petunjukIndex < soal.petunjuk.length - 1 ? (
                <PressableDenganSuara
                  accessibilityRole="button"
                  onPress={() =>
                    setPetunjukIndex((sebelumnya) =>
                      Math.min(sebelumnya + 1, soal.petunjuk.length - 1)
                    )
                  }
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.pressedSecondary,
                  ]}>
                  <Text style={styles.secondaryButtonText}>
                    {petunjukIndex < 0 ? 'Butuh petunjuk?' : 'Petunjuk berikutnya'}
                  </Text>
                </PressableDenganSuara>
              ) : null}
              {jawabanBenar ? (
                <PressableDenganSuara
                  accessibilityRole="button"
                  onPress={lanjutSoal}
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.pressedPrimary]}>
                  <Text style={styles.primaryButtonText}>Lanjut</Text>
                </PressableDenganSuara>
              ) : null}
            </View>
          </>
        ) : (
          <View style={styles.summaryCard}>
            <Text style={styles.body}>
              Kamu menjawab {jumlahBenar} dari {soalCepatPrasyarat.length} dengan benar.
            </Text>
            {kartuUntukDiulang.includes('kuadrat') ? (
              <PressableDenganSuara
                accessibilityRole="button"
                onPress={() => ulangiKartu('kuadrat')}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.pressedSecondary,
                ]}>
                <Text style={styles.secondaryButtonText}>Ulangi kartu kuadrat</Text>
              </PressableDenganSuara>
            ) : null}
            {kartuUntukDiulang.includes('akar') ? (
              <PressableDenganSuara
                accessibilityRole="button"
                onPress={() => ulangiKartu('akar')}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.pressedSecondary,
                ]}>
                <Text style={styles.secondaryButtonText}>Ulangi kartu akar</Text>
              </PressableDenganSuara>
            ) : null}
            {kartuUntukDiulang.includes('segitiga') ? (
              <PressableDenganSuara
                accessibilityRole="button"
                onPress={() => ulangiKartu('segitiga')}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.pressedSecondary,
                ]}>
                <Text style={styles.secondaryButtonText}>
                  Ulangi kartu segitiga siku-siku
                </Text>
              </PressableDenganSuara>
            ) : null}
            <PressableDenganSuara
              accessibilityRole="button"
              onPress={() => router.push('/kenali-sisi')}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressedPrimary]}>
              <Text style={styles.primaryButtonText}>Lanjut ke Kenali sisi</Text>
            </PressableDenganSuara>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    flexGrow: 1,
    paddingHorizontal: layout.horizontalPadding,
    paddingTop: spacing.xxs,
    paddingBottom: spacing.xxs,
    gap: spacing.sm,
  },
  topBar: {
    minHeight: layout.topBarMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backLink: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    paddingVertical: spacing.sm,
  },
  heading: {
    gap: spacing.xxs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.screenTitle,
    fontWeight: typography.weightSemiBold,
  },
  stepTitle: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.subtitle,
    fontWeight: typography.weightSemiBold,
  },
  reminderCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.diagramRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
  },
  body: {
    color: colors.text,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
    textAlign: 'center',
  },
  rootIllustration: {
    minHeight: layout.prerequisiteSquareHeight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  rootSymbol: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.heroTitle,
    fontWeight: typography.weightSemiBold,
  },
  rootExamples: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    textAlign: 'center',
  },
  triangleIllustration: {
    width: '100%',
  },
  navigation: {
    gap: spacing.sm,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    minHeight: layout.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
    textAlign: 'center',
  },
  primaryButton: {
    minHeight: layout.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.primary,
  },
  checkButton: {
    minHeight: layout.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    textAlign: 'center',
  },
  pressedPrimary: {
    opacity: layout.pressScale,
  },
  pressedSecondary: {
    backgroundColor: colors.lilac,
  },
  questionCard: {
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.diagramRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
  },
  instruction: {
    color: colors.text,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.body,
    fontWeight: typography.weightSemiBold,
    lineHeight: typography.bodyLineHeight,
  },
  answerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  answerInput: {
    flex: 1,
    minHeight: layout.buttonMinHeight,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorderStrong,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.body,
  },
  triangleChoices: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  triangleChoice: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
  },
  selectedChoice: {
    borderColor: colors.primary,
    backgroundColor: colors.lilac,
  },
  choiceLabel: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
  },
  feedbackGood: {
    padding: spacing.sm,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.successBackground,
    ...glassCardShadow,
  },
  feedbackWrong: {
    padding: spacing.sm,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.errorBackground,
    ...glassCardShadow,
  },
  feedbackText: {
    color: colors.text,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.body,
    fontWeight: typography.weightSemiBold,
    lineHeight: typography.bodyLineHeight,
  },
  hintCard: {
    gap: spacing.xxs,
    padding: spacing.sm,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.surfaceMuted,
    ...glassCardShadow,
  },
  hintTitle: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
  },
  summaryCard: {
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.diagramRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
  },
});
