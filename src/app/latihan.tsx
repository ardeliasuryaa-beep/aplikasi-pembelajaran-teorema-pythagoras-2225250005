import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText as Text } from '@/components/AppText';
import { PressableDenganSuara } from '@/components/PressableDenganSuara';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { SegitigaSiku, type NamaSisi } from '@/components/SegitigaSiku';
import { TombolSuara } from '@/components/TombolSuara';
import { type LabelInformasi, type PilihanRefleksi, soal } from '@/data/soal';
import { acakUrutan, periksaJawaban } from '@/utils/latihan';
import { completeActivity } from '@/utils/activity-progress';
import { bunyiBenar, bunyiSalah, bunyiSelesai, bunyiTap } from '@/utils/suara';
import { colors, glassCardShadow, layout, spacing, typography } from '@/theme';

type TahapLatihan = 'penandaan' | 'jawaban' | 'refleksi' | 'kalimat-jawaban' | 'selesai';

const labelSisi: Record<NamaSisi, string> = {
  alas: 'alas',
  tegak: 'sisi tegak',
  miring: 'sisi miring',
};

function tahapAwal(index: number): TahapLatihan {
  return soal[index].level === 4 ? 'penandaan' : 'jawaban';
}

export default function Latihan() {
  const [soalIndex, setSoalIndex] = useState(0);
  const [tahap, setTahap] = useState<TahapLatihan>('jawaban');
  const [jawaban, setJawaban] = useState('');
  const [umpanBalik, setUmpanBalik] = useState('');
  const [petunjukIndex, setPetunjukIndex] = useState(-1);
  const [penandaan, setPenandaan] = useState<Record<number, LabelInformasi>>({});
  const [pilihanRefleksi, setPilihanRefleksi] = useState<string | null>(null);
  const [opsiRefleksi, setOpsiRefleksi] = useState<PilihanRefleksi[]>(() =>
    acakUrutan(soal[0].refleksi?.pilihan ?? [])
  );
  const [pilihanKalimat, setPilihanKalimat] = useState<string | null>(null);

  const soalAktif = soal[soalIndex];
  const jumlahTahap = soalAktif.level === 4 ? 4 : 2;
  const tahapIndex =
    tahap === 'penandaan' ? 0 : tahap === 'jawaban' ? (soalAktif.level === 4 ? 1 : 0) : tahap === 'refleksi' ? (soalAktif.level === 4 ? 2 : 1) : 3;
  const progress = Math.min(
    1,
    (soalIndex + (tahapIndex + 1) / jumlahTahap) / soal.length
  );

  function ubahTahap(tahapBerikut: TahapLatihan) {
    setTahap(tahapBerikut);
    setUmpanBalik('');
  }

  function lanjutSoal() {
    const indexBerikut = soalIndex + 1;
    if (indexBerikut >= soal.length) {
      bunyiSelesai();
      completeActivity('practice');
      ubahTahap('selesai');
      return;
    }

    bunyiSelesai();
    setSoalIndex(indexBerikut);
    setTahap(tahapAwal(indexBerikut));
    setOpsiRefleksi(acakUrutan(soal[indexBerikut].refleksi?.pilihan ?? []));
    setJawaban('');
    setUmpanBalik('');
    setPetunjukIndex(-1);
    setPenandaan({});
    setPilihanRefleksi(null);
    setPilihanKalimat(null);
  }

  function periksaPenandaan() {
    const kalimat = soalAktif.kalimatUntukDitandai ?? [];
    if (kalimat.some((item, index) => penandaan[index] !== item.label)) {
      bunyiSalah();
      setUmpanBalik(
        'Periksa kembali: informasi ukuran termasuk Diketahui, sedangkan hal yang dicari termasuk Ditanyakan.'
      );
      return;
    }
    bunyiBenar();
    ubahTahap('jawaban');
  }

  function periksaIsian() {
    const hasil = periksaJawaban(soalAktif, jawaban);
    if (hasil.status === 'kosong') {
      setUmpanBalik('Masukkan angka terlebih dahulu agar jawaban dapat diperiksa.');
    } else if (hasil.status === 'tidak-valid') {
      setUmpanBalik('Masukkan jawaban berupa angka. Kamu boleh memakai koma untuk desimal.');
    } else if (hasil.status === 'salah') {
      bunyiSalah();
      setUmpanBalik(hasil.penjelasan);
    } else {
      bunyiBenar();
      setPilihanRefleksi(null);
      ubahTahap('refleksi');
    }
  }

  function jawabRefleksi(pilihan: string) {
    const opsi = soalAktif.refleksi?.pilihan.find((item) => item.id === pilihan);
    if (!opsi) {
      return;
    }

    setPilihanRefleksi(pilihan);
    if (pilihan !== soalAktif.refleksi?.jawabanBenar) {
      bunyiSalah();
    } else {
      bunyiBenar();
    }
    setUmpanBalik(opsi.umpanBalik);
  }

  function jawabKalimat(pilihan: string) {
    setPilihanKalimat(pilihan);
    if (pilihan !== soalAktif.kalimatJawabanContoh) {
      bunyiSalah();
      setUmpanBalik(
        'Pilih kalimat yang menyebutkan ukuran yang dicari, satuannya, dan maknanya dalam cerita.'
      );
      return;
    }
    bunyiBenar();
    setUmpanBalik('Tepat, kalimat ini menyebutkan panjang yang dicari beserta satuan dan konteksnya.');
  }

  function bukaPetunjuk() {
    setPetunjukIndex((sebelumnya) => Math.min(sebelumnya + 1, 2));
  }

  function renderSegitiga() {
    const tampilkanJawaban = tahap === 'refleksi' || tahap === 'kalimat-jawaban';
    const jawabanTampilan =
      soalAktif.level === 3 ? soalAktif.jawaban.toFixed(2).replace('.', ',') : soalAktif.jawaban;

    return (
      <View style={styles.triangleCard}>
        <SegitigaSiku
          sisi={{
            ...soalAktif.sisi,
            ...(tampilkanJawaban && { [soalAktif.yangDicari]: jawabanTampilan }),
          }}
          satuan={soalAktif.satuan}
          orientasi={soalAktif.orientasi}
          cermin={soalAktif.cermin}
          yangDicari={soalAktif.yangDicari}
          tampilkanSemuaNamaSisi
          tampilkanVariabel
          tampilkanNilaiYangDicari={tampilkanJawaban}
          warnaBerdasarkanPeran
        />
      </View>
    );
  }

  function renderPilihan(teks: string, dipilih: boolean, saatPilih: () => void) {
    return (
      <PressableDenganSuara
        bunyi="tanpa"
        key={teks}
        accessibilityRole="button"
        accessibilityState={{ selected: dipilih }}
        onPress={saatPilih}
        style={({ pressed }) => [
          styles.choiceButton,
          dipilih && styles.selectedChoice,
          pressed && styles.pressedChoice,
        ]}>
        <Text style={[styles.choiceText, dipilih && styles.selectedChoiceText]}>{teks}</Text>
      </PressableDenganSuara>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topBar}>
          <Link href="/" style={styles.backLink} onPress={bunyiTap}>
            ‹ Beranda
          </Link>
          <ProgressIndicator
            label={`Soal ${Math.min(soalIndex + 1, soal.length)} dari ${soal.length}`}
            progress={tahap === 'selesai' ? 1 : progress}
          />
        </View>

        {tahap === 'selesai' ? (
          <View style={styles.completion}>
            <View style={styles.feedbackGood}>
              <View style={styles.feedbackRow}>
                <View style={styles.feedbackIcon}>
                  <Text style={styles.feedbackIconText}>✓</Text>
                </View>
                <Text style={styles.feedbackTitle}>Latihan selesai!</Text>
              </View>
            </View>
            <Text style={styles.body}>
              Kamu sudah mencoba soal dari tingkat dasar hingga soal cerita.
            </Text>
            <PressableDenganSuara
                accessibilityRole="button"
                onPress={() => router.push('/')}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressedPrimary]}>
                <Text style={styles.primaryButtonText}>Kembali ke Beranda</Text>
            </PressableDenganSuara>
          </View>
        ) : (
          <>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>LEVEL {soalAktif.level}</Text>
              <View style={styles.titleRow}>
                <Text style={styles.title}>
                  {tahap === 'penandaan'
                    ? 'Tandai informasi'
                    : tahap === 'jawaban'
                      ? 'Cari panjang sisi'
                      : tahap === 'refleksi'
                        ? 'Periksa jawaban'
                        : 'Pilih kalimat jawaban'}
                </Text>
                <TombolSuara />
              </View>
            </View>

            {tahap === 'penandaan' ? (
              <>
                {renderSegitiga()}
                {!umpanBalik ? (
                  <Text style={styles.instruction}>
                    Tandai setiap kalimat sebagai Diketahui atau Ditanyakan.
                  </Text>
                ) : null}
                <View style={styles.sentenceList}>
                  {soalAktif.kalimatUntukDitandai?.map((kalimat, index) => (
                    <View key={kalimat.teks} style={styles.sentenceCard}>
                      <Text style={styles.sentenceText}>{kalimat.teks}</Text>
                      <View style={styles.tagChoices}>
                        {(['Diketahui', 'Ditanyakan'] as const).map((label) => (
                          <PressableDenganSuara
                            bunyi="tanpa"
                            key={label}
                            accessibilityRole="button"
                            accessibilityState={{ selected: penandaan[index] === label }}
                            onPress={() =>
                              setPenandaan((sebelumnya) => ({ ...sebelumnya, [index]: label }))
                            }
                            style={({ pressed }) => [
                              styles.tagButton,
                              penandaan[index] === label && styles.selectedTag,
                              pressed && styles.pressedChoice,
                            ]}>
                            <Text
                              style={[
                                styles.tagText,
                                penandaan[index] === label && styles.selectedChoiceText,
                              ]}>
                              {label}
                            </Text>
                          </PressableDenganSuara>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
                {umpanBalik ? <Feedback teks={umpanBalik} salah /> : null}
                <PressableDenganSuara
                  bunyi="tanpa"
                  accessibilityRole="button"
                  onPress={periksaPenandaan}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.pressedPrimary,
                  ]}>
                  <Text style={styles.primaryButtonText}>Periksa penandaan</Text>
                </PressableDenganSuara>
              </>
            ) : tahap === 'jawaban' ? (
              <>
                {soalAktif.konteks ? (
                  <Text style={styles.contextText}>{soalAktif.konteks}</Text>
                ) : null}
                {renderSegitiga()}
                <Text style={styles.instruction}>
                  Berapa panjang {labelSisi[soalAktif.yangDicari]}?
                </Text>
                <Text style={styles.helper}>
                  {soalAktif.level === 3
                    ? `Masukkan jawaban dalam ${soalAktif.satuan}; bulatkan ke dua angka di belakang koma.`
                    : `Masukkan angka dalam ${soalAktif.satuan}.`}
                </Text>
                <View style={styles.answerRow}>
                  <TextInput
                    accessibilityLabel={`Jawaban dalam ${soalAktif.satuan}`}
                    value={jawaban}
                    onChangeText={(teks) => {
                      setJawaban(teks);
                      setUmpanBalik('');
                    }}
                    onSubmitEditing={periksaIsian}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    placeholder="Jawaban"
                    placeholderTextColor={colors.textSecondary}
                    style={styles.answerInput}
                  />
                  <Text style={styles.unit}>{soalAktif.satuan}</Text>
                </View>
                {umpanBalik ? <Feedback teks={umpanBalik} salah /> : null}
                {petunjukIndex >= 0 ? (
                  <View style={styles.hintCard} accessibilityLiveRegion="polite">
                    <Text style={styles.hintTitle}>Petunjuk {petunjukIndex + 1}</Text>
                    <Text style={styles.hintText}>{soalAktif.petunjuk[petunjukIndex]}</Text>
                  </View>
                ) : null}
                <View style={styles.answerActions}>
                  <PressableDenganSuara
                    bunyi="tanpa"
                    accessibilityRole="button"
                    onPress={periksaIsian}
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && styles.pressedPrimary,
                    ]}>
                    <Text style={styles.primaryButtonText}>Periksa jawaban</Text>
                  </PressableDenganSuara>
                  {petunjukIndex < 2 && (
                    <PressableDenganSuara
                      accessibilityRole="button"
                      onPress={bukaPetunjuk}
                      style={({ pressed }) => [
                        styles.hintButton,
                        pressed && styles.pressedChoice,
                      ]}>
                      <Text style={styles.hintButtonText}>
                        {petunjukIndex < 0 ? 'Butuh petunjuk?' : 'Petunjuk berikutnya'}
                      </Text>
                    </PressableDenganSuara>
                  )}
                </View>
              </>
            ) : tahap === 'refleksi' ? (
              <>
                {renderSegitiga()}
                <Text style={styles.instruction}>
                  {soalAktif.refleksi?.pertanyaan ?? 'Apakah hasilnya masuk akal?'}
                </Text>
                <View style={styles.choiceList}>
                  {opsiRefleksi.map((pilihan) =>
                    renderPilihan(pilihan.teks, pilihanRefleksi === pilihan.id, () =>
                      jawabRefleksi(pilihan.id)
                    )
                  )}
                </View>
                {umpanBalik ? (
                  <Feedback
                    teks={umpanBalik}
                    salah={pilihanRefleksi !== soalAktif.refleksi?.jawabanBenar}
                  />
                ) : null}
                {pilihanRefleksi === soalAktif.refleksi?.jawabanBenar && (
                  <PressableDenganSuara
                    bunyi="tanpa"
                    accessibilityRole="button"
                    onPress={() => {
                      if (soalAktif.level === 4) {
                        bunyiTap();
                        ubahTahap('kalimat-jawaban');
                      } else {
                        lanjutSoal();
                      }
                    }}
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && styles.pressedPrimary,
                    ]}>
                    <Text style={styles.primaryButtonText}>Lanjut</Text>
                  </PressableDenganSuara>
                )}
              </>
            ) : (
              <>
                {renderSegitiga()}
                <Text style={styles.instruction}>
                  Pilih kalimat yang menjawab pertanyaan sesuai konteks dan satuannya.
                </Text>
                <View style={styles.choiceList}>
                  {soalAktif.pilihanKalimatJawaban?.map((pilihan) =>
                    renderPilihan(pilihan, pilihanKalimat === pilihan, () =>
                      jawabKalimat(pilihan)
                    )
                  )}
                </View>
                {umpanBalik ? (
                  <Feedback
                    teks={umpanBalik}
                    salah={pilihanKalimat !== soalAktif.kalimatJawabanContoh}
                  />
                ) : null}
                {pilihanKalimat === soalAktif.kalimatJawabanContoh && (
                  <PressableDenganSuara
                    bunyi="tanpa"
                    accessibilityRole="button"
                    onPress={lanjutSoal}
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && styles.pressedPrimary,
                    ]}>
                    <Text style={styles.primaryButtonText}>Lanjut</Text>
                  </PressableDenganSuara>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Feedback({ teks, salah = false }: { teks: string; salah?: boolean }) {
  return (
    <View
      style={salah ? styles.feedbackWrong : styles.feedbackGood}
      accessibilityLiveRegion="polite">
      <View style={styles.feedbackRow}>
        <View style={[styles.feedbackIcon, salah && styles.feedbackIconWrong]}>
          <Text style={[styles.feedbackIconText, salah && styles.feedbackIconTextWrong]}>
            {salah ? '!' : '✓'}
          </Text>
        </View>
        <Text style={styles.feedbackText}>{teks}</Text>
      </View>
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
    gap: spacing.xs,
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
  contextText: {
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
    paddingHorizontal: spacing.xs,
  },
  instruction: {
    color: colors.text,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.body,
    fontWeight: typography.weightSemiBold,
    lineHeight: typography.bodyLineHeight,
  },
  helper: {
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  unit: {
    color: colors.text,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  sentenceList: {
    gap: spacing.xs,
  },
  sentenceCard: {
    gap: spacing.xs,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
  },
  sentenceText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  tagChoices: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tagButton: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.glassBorderStrong,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.surface,
  },
  selectedTag: {
    borderColor: colors.primary,
    backgroundColor: colors.lilac,
  },
  tagText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  answerActions: {
    gap: spacing.xs,
  },
  primaryButton: {
    minHeight: layout.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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
  hintButton: {
    minHeight: layout.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.borderRadius,
    backgroundColor: colors.lilac,
  },
  hintButtonText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  pressedPrimary: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: layout.pressScale }],
  },
  pressedChoice: {
    transform: [{ scale: layout.pressScale }],
  },
  hintCard: {
    gap: spacing.xxs,
    padding: spacing.md,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.lilac,
    ...glassCardShadow,
  },
  hintTitle: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.caption,
    fontWeight: typography.weightSemiBold,
  },
  hintText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  feedbackGood: {
    padding: spacing.md,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.successBackground,
    ...glassCardShadow,
  },
  feedbackWrong: {
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
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: layout.buttonPillRadius,
    backgroundColor: colors.successBackground,
  },
  feedbackIconWrong: {
    borderColor: colors.error,
    backgroundColor: colors.errorBackground,
  },
  feedbackIconText: {
    color: colors.successDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: layout.feedbackIconFontSize,
    fontWeight: typography.weightMedium,
  },
  feedbackIconTextWrong: {
    color: colors.errorDark,
  },
  feedbackTitle: {
    flex: 1,
    color: colors.successDark,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.body,
    fontWeight: typography.weightSemiBold,
    alignSelf: 'center',
  },
  feedbackText: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  choiceList: {
    gap: spacing.sm,
  },
  choiceButton: {
    minHeight: layout.buttonMinHeight,
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorderStrong,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
  },
  selectedChoice: {
    borderColor: colors.primary,
    backgroundColor: colors.lilac,
  },
  choiceText: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  selectedChoiceText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontWeight: typography.weightSemiBold,
  },
  completion: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  body: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
});
