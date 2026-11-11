import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/AppText';
import { PressableDenganSuara } from '@/components/PressableDenganSuara';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SegitigaSiku } from '@/components/SegitigaSiku';
import { TombolSuara } from '@/components/TombolSuara';
import { contohBelajar } from '@/data/contoh-belajar';
import { completeActivity } from '@/utils/activity-progress';
import { bunyiSelesai, bunyiTap } from '@/utils/suara';
import { colors, glassCardShadow, layout, spacing, typography } from '@/theme';

export default function Belajar() {
  const [contohIndex, setContohIndex] = useState(0);
  const [langkahIndex, setLangkahIndex] = useState(0);
  const [tampilkanUlangan, setTampilkanUlangan] = useState(false);
  const [barisHitunganTampil, setBarisHitunganTampil] = useState(1);
  const [selesai, setSelesai] = useState(false);

  const contoh = contohBelajar[contohIndex];
  const langkah = contoh.langkah[langkahIndex];

  function ubahLangkah(contohBerikut: number, langkahBerikut: number) {
    setContohIndex(contohBerikut);
    setLangkahIndex(langkahBerikut);
    setTampilkanUlangan(false);
    setBarisHitunganTampil(1);
  }

  function kembali() {
    if (selesai) {
      setSelesai(false);
      return;
    }
    if (langkahIndex > 0) {
      ubahLangkah(contohIndex, langkahIndex - 1);
    } else if (contohIndex > 0) {
      ubahLangkah(contohIndex - 1, contohBelajar[contohIndex - 1].langkah.length - 1);
    }
  }

  function lanjut() {
    if (langkahIndex < contoh.langkah.length - 1) {
      bunyiTap();
      ubahLangkah(contohIndex, langkahIndex + 1);
    } else if (contohIndex < contohBelajar.length - 1) {
      bunyiSelesai();
      ubahLangkah(contohIndex + 1, 0);
    } else {
      bunyiSelesai();
      completeActivity('learn');
      setSelesai(true);
    }
  }

  const bisaKembali = selesai || langkahIndex > 0 || contohIndex > 0;
  const hitunganLengkap =
    !langkah.hitungan || barisHitunganTampil >= langkah.hitungan.length;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Link href="/" style={styles.backLink} onPress={bunyiTap}>
            ‹ Beranda
          </Link>
          <ProgressIndicator
            label={selesai ? 'Selesai' : `Langkah ${langkahIndex + 1} dari 4`}
            progress={selesai ? 1 : (langkahIndex + 1) / 4}
          />
        </View>

        {selesai ? (
          <View style={styles.completion}>
            <Text style={styles.title}>Contoh selesai</Text>
            <Text style={styles.body}>
              Kamu sudah belajar mencari sisi miring dan sisi tegak menggunakan Teorema
              Pythagoras.
            </Text>
            <PressableDenganSuara
                accessibilityRole="button"
                onPress={() => router.push('/')}
                style={({ pressed }) => [styles.nextButton, pressed && styles.pressedButton]}>
                <Text style={styles.nextButtonText}>Kembali ke Beranda</Text>
            </PressableDenganSuara>
          </View>
        ) : (
          <>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>CONTOH LEVEL {contoh.level}</Text>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{contoh.judul}</Text>
                <TombolSuara />
              </View>
              <Text style={styles.stepTitle}>{langkah.judul}</Text>
            </View>

            <View style={styles.triangleCard}>
              <SegitigaSiku
                sisi={contoh.sisi}
                satuan={contoh.satuan}
                yangDicari={contoh.yangDicari}
                tampilkanSemuaNamaSisi
                tampilkanVariabel
                warnaBerdasarkanPeran
              />
            </View>

            <View style={styles.explanation} accessibilityLiveRegion="polite">
              <Text style={styles.body}>
                {tampilkanUlangan ? langkah.penjelasanUlang : langkah.penjelasan}
              </Text>
              {langkah.rumus && <Text style={styles.formula}>{langkah.rumus}</Text>}
              {langkah.hitungan?.slice(0, barisHitunganTampil).map((baris) => (
                <Text key={baris} style={styles.calculation}>
                  {baris}
                </Text>
              ))}
              {langkah.penjelasanHitungan &&
                barisHitunganTampil >= langkah.penjelasanHitungan.setelahBaris && (
                  <Text style={styles.calculationNote}>
                    {langkah.penjelasanHitungan.teks}
                  </Text>
                )}
            </View>

            <View style={styles.navigation}>
              <View style={styles.secondaryActions}>
                <PressableDenganSuara
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !bisaKembali }}
                  disabled={!bisaKembali}
                  onPress={kembali}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    !bisaKembali && styles.disabledButton,
                    bisaKembali && pressed && styles.pressedSecondary,
                  ]}>
                  <Text style={styles.secondaryButtonText}>Kembali</Text>
                </PressableDenganSuara>
                <PressableDenganSuara
                  accessibilityRole="button"
                  accessibilityState={{ expanded: tampilkanUlangan }}
                  onPress={() => setTampilkanUlangan((terbuka) => !terbuka)}
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.pressedSecondary,
                  ]}>
                  <Text style={styles.secondaryButtonText}>
                    {tampilkanUlangan ? 'Tutup penjelasan' : 'Ulangi penjelasan'}
                  </Text>
                </PressableDenganSuara>
              </View>
              <PressableDenganSuara
                bunyi="tanpa"
                accessibilityRole="button"
                onPress={() => {
                  if (langkah.hitungan && !hitunganLengkap) {
                    bunyiTap();
                    setBarisHitunganTampil((jumlah) =>
                      Math.min(jumlah + 1, langkah.hitungan?.length ?? jumlah)
                    );
                    return;
                  }
                  lanjut();
                }}
                style={({ pressed }) => [styles.nextButton, pressed && styles.pressedButton]}>
                <Text style={styles.nextButtonText}>
                  {langkah.hitungan && !hitunganLengkap
                    ? 'Tampilkan langkah berikutnya'
                    : 'Lanjut'}
                </Text>
              </PressableDenganSuara>
            </View>
          </>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  topBar: {
    minHeight: 36,
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
  eyebrow: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.small,
    fontWeight: typography.weightMedium,
    letterSpacing: typography.smallLabelSpacing,
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
  triangleCard: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.diagramRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
    paddingHorizontal: spacing.xs,
  },
  explanation: {
    gap: spacing.xs,
  },
  body: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  formula: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  calculation: {
    color: colors.text,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    lineHeight: typography.bodyLineHeight,
  },
  calculationNote: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  navigation: {
    marginTop: spacing.xs,
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
    borderColor: colors.glassBorderStrong,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
    textAlign: 'center',
  },
  disabledButton: {
    borderColor: colors.glassBorderStrong,
    backgroundColor: colors.surfaceMuted,
  },
  pressedSecondary: {
    backgroundColor: colors.surfaceMuted,
    transform: [{ scale: layout.pressScale }],
  },
  pressedButton: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: layout.pressScale }],
  },
  nextButton: {
    minHeight: layout.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.primary,
  },
  nextButtonText: {
    color: colors.onPrimary,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  completion: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
});
