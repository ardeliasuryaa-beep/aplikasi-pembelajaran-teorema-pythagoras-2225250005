import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/AppText';
import { PressableDenganSuara } from '@/components/PressableDenganSuara';
import {
  SegitigaSiku,
  type NamaSisi,
  type OrientasiSegitiga,
} from '@/components/SegitigaSiku';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { TombolSuara } from '@/components/TombolSuara';
import { completeActivity } from '@/utils/activity-progress';
import { bunyiBenar, bunyiSalah, bunyiSelesai, bunyiTap } from '@/utils/suara';
import { colors, glassCardShadow, layout, spacing, typography } from '@/theme';

const orientasi: OrientasiSegitiga[] = [0, 90, 180, 270];

export default function KenaliSisi() {
  const [langkah, setLangkah] = useState(0);
  const [pilihan, setPilihan] = useState<NamaSisi | null>(null);
  const [selesai, setSelesai] = useState(false);

  const benar = pilihan === 'miring';

  function pilihSisi(sisi: NamaSisi) {
    if (pilihan === null || !benar) {
      setPilihan(sisi);
      if (sisi === 'miring') {
        bunyiBenar();
      } else {
        bunyiSalah();
      }
    }
  }

  function lanjut() {
    if (!benar) {
      return;
    }
    if (langkah === orientasi.length - 1) {
      bunyiSelesai();
      completeActivity('recognize');
      setSelesai(true);
      return;
    }
    bunyiTap();
    setLangkah((sebelumnya) => sebelumnya + 1);
    setPilihan(null);
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <Link href="/" style={styles.backLink} onPress={bunyiTap}>
            ‹ Beranda
          </Link>
          <ProgressIndicator
            label={selesai ? 'Selesai' : `Orientasi ${langkah + 1} dari ${orientasi.length}`}
            progress={selesai ? 1 : (langkah + 1) / orientasi.length}
          />
        </View>

        <View style={styles.heading}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Kenali Sisi</Text>
            <TombolSuara />
          </View>
          <Text style={styles.instruction}>
            {selesai
              ? 'Kamu berhasil menemukan sisi miring dalam semua posisi.'
              : 'Ketuk sisi miring pada segitiga.'}
          </Text>
        </View>

        {!selesai && (
          <View style={styles.triangleCard}>
            <SegitigaSiku
              orientasi={orientasi[langkah]}
              sisiAktif={benar ? pilihan ?? undefined : undefined}
              tampilkanMiring={benar}
              onPilihSisi={pilihSisi}
            />
          </View>
        )}

        {selesai ? (
          <View style={styles.feedbackCorrect} accessibilityLiveRegion="polite">
            <View style={styles.feedbackRow}>
              <View style={[styles.feedbackIcon, styles.correctIcon]}>
                <Text style={styles.correctIconText}>✓</Text>
              </View>
              <View style={styles.feedbackCopy}>
                <Text style={styles.feedbackTitle}>Hebat!</Text>
                <Text style={styles.feedbackText}>
                  Sisi miring selalu berhadapan dengan sudut siku-siku.
                </Text>
              </View>
            </View>
          </View>
        ) : pilihan !== null ? (
          <View
            style={benar ? styles.feedbackCorrect : styles.feedbackTryAgain}
            accessibilityLiveRegion="polite">
            <View style={styles.feedbackRow}>
              <View style={[styles.feedbackIcon, benar ? styles.correctIcon : styles.errorIcon]}>
                <Text style={benar ? styles.correctIconText : styles.errorIconText}>
                  {benar ? '✓' : '!'}
                </Text>
              </View>
              <View style={styles.feedbackCopy}>
                <Text style={styles.feedbackTitle}>{benar ? 'Benar!' : 'Belum tepat'}</Text>
                <Text style={styles.feedbackText}>
                  {benar
                    ? 'Sisi miring berada di depan sudut siku-siku.'
                    : 'Sisi yang diketuk bertemu di tanda sudut siku-siku; cari sisi yang berada tepat di seberangnya.'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.helper}>
            Cari sisi yang berhadapan dengan tanda sudut siku-siku.
          </Text>
        )}

        <View style={styles.actions}>
          {selesai ? (
            <PressableDenganSuara
                accessibilityRole="button"
                onPress={() => router.push('/')}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressedButton]}>
                <Text style={styles.primaryButtonText}>Kembali ke Beranda</Text>
            </PressableDenganSuara>
          ) : pilihan !== null && !benar ? (
            <PressableDenganSuara
              accessibilityRole="button"
              onPress={() => setPilihan(null)}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressedSecondary]}>
              <Text style={styles.secondaryButtonText}>Coba lagi</Text>
            </PressableDenganSuara>
          ) : (
            <PressableDenganSuara
              bunyi="tanpa"
              accessibilityRole="button"
              onPress={lanjut}
              disabled={!benar}
              accessibilityState={{ disabled: !benar }}
              style={[
                styles.primaryButton,
                !benar && styles.disabledButton,
              ]}>
              <Text style={[styles.primaryButtonText, !benar && styles.disabledButtonText]}>
                Lanjut
              </Text>
            </PressableDenganSuara>
          )}
        </View>
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
    gap: spacing.md,
  },
  topBar: {
    minHeight: layout.buttonMinHeight,
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
  progress: {
    color: colors.textSecondary,
    fontSize: typography.caption,
    fontWeight: typography.weightSemiBold,
  },
  heading: {
    gap: spacing.xs,
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
  instruction: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  triangleCard: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.diagramRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
    paddingHorizontal: spacing.sm,
  },
  helper: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  feedbackCorrect: {
    padding: spacing.md,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.successBackground,
    ...glassCardShadow,
  },
  feedbackTryAgain: {
    padding: spacing.md,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.errorBackground,
    ...glassCardShadow,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  feedbackIcon: {
    width: layout.feedbackIconSize,
    height: layout.feedbackIconSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.buttonPillRadius,
  },
  correctIcon: {
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: colors.successBackground,
  },
  errorIcon: {
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: colors.errorBackground,
  },
  correctIconText: {
    color: colors.successDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: layout.feedbackIconFontSize,
    fontWeight: typography.weightMedium,
  },
  errorIconText: {
    color: colors.errorDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: layout.feedbackIconFontSize,
    fontWeight: typography.weightMedium,
  },
  feedbackCopy: {
    flex: 1,
    gap: spacing.xxs,
  },
  feedbackTitle: {
    color: colors.text,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.body,
    fontWeight: typography.weightSemiBold,
  },
  feedbackText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  actions: {
    marginTop: 'auto',
  },
  primaryButton: {
    minHeight: layout.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.lilac,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  disabledButtonText: {
    color: colors.primaryDark,
  },
  pressedButton: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: layout.pressScale }],
  },
  pressedSecondary: {
    backgroundColor: colors.lilac,
    transform: [{ scale: layout.pressScale }],
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  secondaryButton: {
    minHeight: layout.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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
  },
});
