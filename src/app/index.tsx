import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Polygon, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { AppText as Text } from '@/components/AppText';
import { PressableDenganSuara } from '@/components/PressableDenganSuara';
import { ProgressGradientFill } from '@/components/ProgressGradientFill';
import { TombolSuara } from '@/components/TombolSuara';
import { useActivityProgress, type ActivityId } from '@/utils/activity-progress';
import { markLearningStarted, saveUserName, useUserProfile } from '@/utils/user-profile';
import { bunyiTap } from '@/utils/suara';
import { colors, glassCardShadow, layout, spacing, typography } from '@/theme';

const activities: {
  id: ActivityId;
  title: string;
  description: string;
  icon: 'square' | 'triangle' | 'book' | 'pencil';
  href: '/prasyarat' | '/kenali-sisi' | '/belajar' | '/latihan';
}[] = [
  {
    id: 'prerequisite',
    title: 'Prasyarat',
    description: 'Ingat kuadrat, akar, dan segitiga siku-siku.',
    icon: 'square',
    href: '/prasyarat',
  },
  {
    id: 'recognize',
    title: 'Kenali sisi',
    description: 'Temukan sisi miring dari berbagai posisi.',
    icon: 'triangle',
    href: '/kenali-sisi',
  },
  {
    id: 'learn',
    title: 'Belajar',
    description: 'Pahami contoh satu langkah demi satu langkah.',
    icon: 'book',
    href: '/belajar',
  },
  {
    id: 'practice',
    title: 'Latihan',
    description: 'Coba soal dari dasar hingga soal cerita.',
    icon: 'pencil',
    href: '/latihan',
  },
];

function ActivityIcon({ name }: { name: (typeof activities)[number]['icon'] }) {
  return (
    <Svg width={layout.activityIconSize + spacing.md} height={layout.activityIconSize + spacing.md} viewBox="0 0 64 64" fill="none" aria-hidden={true}>
      <Defs>
        <LinearGradient id="modulePrimary" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors.primary} />
          <Stop offset="1" stopColor={colors.primaryDark} />
        </LinearGradient>
        <LinearGradient id="moduleHighlight" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors.primary} />
          <Stop offset="1" stopColor={colors.primaryDark} />
        </LinearGradient>
      </Defs>
      {name === 'square' && (
        <>
          <Polygon points="32,6 54,18 54,44 32,57 10,45 10,19" fill="url(#modulePrimary)" fillOpacity={0.24} stroke="url(#modulePrimary)" strokeWidth={2} strokeLinejoin="round" />
          <Polygon points="32,6 54,18 32,31 10,19" fill="url(#moduleHighlight)" fillOpacity={0.38} />
          <Path d="M32 31v26M10 19l22 12 22-13M32 6v25" stroke={colors.primaryDark} strokeWidth={1.8} strokeLinejoin="round" />
          <SvgText x={32} y={45} fill={colors.primaryDark} fontFamily={typography.fontFamily.heading} fontSize={16} fontWeight={typography.weightSemiBold} textAnchor="middle">√x</SvgText>
        </>
      )}
      {name === 'triangle' && (
        <>
          <Polygon points="12,50 28,17 51,50" fill="url(#modulePrimary)" fillOpacity={0.18} stroke={colors.primaryDark} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M28 17 51 50" stroke="url(#moduleHighlight)" strokeWidth={5} strokeLinecap="round" />
          <Path d="M16 46h8v-8" stroke={colors.primaryDark} strokeWidth={1.8} strokeLinejoin="round" />
          <Path d="M9 53 28 14 54 53" stroke={colors.primary} strokeOpacity={0.46} strokeWidth={1} strokeLinejoin="round" />
        </>
      )}
      {name === 'book' && (
        <>
          <Path d="M31 19c-7-7-14-6-23-4v30c9-2 16-2 23 5 7-7 14-7 25-5V15c-10-2-18-3-25 4Z" fill="url(#modulePrimary)" fillOpacity={0.2} stroke={colors.primaryDark} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M31 19v31M13 23c6-1 11 0 15 3M13 31c6-1 11 0 15 3M49 23c-6-1-11 0-15 3M49 31c-6-1-11 0-15 3" stroke={colors.primaryDark} strokeWidth={1.6} strokeLinecap="round" />
          <Path d="M14 16a18 18 0 0 1 35 0" stroke="url(#moduleHighlight)" strokeWidth={2.5} strokeLinecap="round" />
          <Path d="M31 13v4M23 14l1 4M39 14l-1 4" stroke={colors.primary} strokeWidth={1.6} strokeLinecap="round" />
        </>
      )}
      {name === 'pencil' && (
        <>
          <Path d="m14 47-3 8 9-3 27-27-6-6-27 28Z" fill="url(#modulePrimary)" fillOpacity={0.28} stroke={colors.primaryDark} strokeWidth={2} strokeLinejoin="round" />
          <Path d="m41 19 6 6M16 45l6 6" stroke={colors.primary} strokeWidth={2} />
          <Path d="m49 8 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5ZM15 9l1.5 3.5L20 14l-3.5 1.5L15 19l-1.5-3.5L10 14l3.5-1.5L15 9Z" fill="url(#moduleHighlight)" />
          <Circle cx={54} cy={39} r={2} fill={colors.primary} />
        </>
      )}
    </Svg>
  );
}

function HeroIllustration() {
  return (
    <Svg
      width="100%"
      height={layout.heroIllustrationHeight}
      viewBox={`0 0 ${layout.heroIllustrationWidth} ${layout.heroIllustrationHeight}`}
      fill="none"
      aria-hidden={true}>
      <Circle
        cx={layout.heroDecorationCircleX}
        cy={layout.heroDecorationCircleY}
        r={layout.heroDecorationCircleRadius}
        fill={colors.lilacMid}
        fillOpacity={layout.decorationOpacity}
      />
      <Polygon
        points={layout.heroDecorationTriangle}
        fill={colors.lilacMid}
        fillOpacity={layout.decorationOpacity}
      />
      <Path
        d={layout.heroTrianglePath}
        stroke={colors.primaryDark}
        strokeWidth={layout.heroStrokeWidth}
        strokeLinejoin="round"
      />
      <Path
        d={layout.heroRightAnglePath}
        stroke={colors.primaryDark}
        strokeWidth={layout.heroRightAngleStrokeWidth}
        strokeLinejoin="round"
      />
      <SvgText
        x={layout.heroLabelAX}
        y={layout.heroLabelAY}
        fill={colors.primaryDark}
        fontFamily={typography.fontFamily.headingMedium}
        fontSize={typography.body}
        fontWeight={typography.weightMedium}>
        a
      </SvgText>
      <SvgText
        x={layout.heroLabelBX}
        y={layout.heroLabelBY}
        fill={colors.primaryDark}
        fontFamily={typography.fontFamily.headingMedium}
        fontSize={typography.body}
        fontWeight={typography.weightMedium}>
        b
      </SvgText>
      <SvgText
        x={layout.heroLabelCX}
        y={layout.heroLabelCY}
        fill={colors.primaryDark}
        fontFamily={typography.fontFamily.headingMedium}
        fontSize={typography.body}
        fontWeight={typography.weightMedium}>
        c
      </SvgText>
      <Rect
        x={layout.heroFormulaX}
        y={layout.heroFormulaY}
        width={layout.heroFormulaWidth}
        height={layout.heroFormulaHeight}
        rx={layout.cardRadius}
        fill={colors.surface}
      />
      <SvgText
        x={layout.heroFormulaTextX}
        y={layout.heroFormulaTextY}
        fill={colors.primaryDark}
        fontFamily={typography.fontFamily.headingMedium}
        fontSize={typography.heroFormula}
        fontWeight={typography.weightMedium}>
        a² + b² = c²
      </SvgText>
    </Svg>
  );
}

function ActivityCard({
  activity,
  index,
  completed,
}: {
  activity: (typeof activities)[number];
  index: number;
  completed: boolean;
}) {
  const [lift] = useState(() => new Animated.Value(0));
  const [hovered, setHovered] = useState(false);
  const available = true;

  function animateLift(value: number) {
    Animated.timing(lift, {
      toValue: value,
      duration: layout.transitionDuration,
      useNativeDriver: false,
    }).start();
  }

  const card = (
    <View style={styles.activityRow}>
      <View style={styles.markerColumn}>
        <View style={[styles.marker, completed && styles.markerDone]}>
          {completed ? (
            <Svg width={layout.markerIconSize} height={layout.markerIconSize} viewBox="0 0 20 20" fill="none">
              <Path d={layout.checkMarkPath} stroke={colors.primaryDark} strokeWidth={layout.iconStrokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          ) : (
            <Text style={styles.markerNumber}>{index + 1}</Text>
          )}
        </View>
        {index < activities.length - 1 ? <View style={styles.connector} /> : null}
      </View>

      <Animated.View
        style={[
          styles.activityCard,
          !available && styles.activityCardDisabled,
          { transform: [{ translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -layout.cardLift] }) }] },
        ]}>
        <View style={styles.iconBox}>
          <ActivityIcon name={activity.icon} />
        </View>
        <View style={styles.activityText}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityDescription}>{activity.description}</Text>
        </View>
        <View style={[styles.activityAction, !available && styles.comingBadge]}>
          <Text style={available ? styles.actionText : styles.comingText}>
            {available ? (completed ? 'Ulangi' : 'Mulai') : 'Segera hadir'}
          </Text>
          {available ? (
            <Svg width={layout.actionArrowSize} height={layout.actionArrowSize} viewBox="0 0 20 20" fill="none">
              <Path d={layout.arrowPath} stroke={colors.onPrimary} strokeWidth={layout.iconStrokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          ) : null}
        </View>
      </Animated.View>

      {available ? (
        <PressableDenganSuara
            accessibilityRole="button"
            onPress={() => router.push(activity.href!)}
            onHoverIn={() => {
              setHovered(true);
              animateLift(1);
            }}
            onHoverOut={() => {
              setHovered(false);
              animateLift(0);
            }}
            onPressIn={() => animateLift(1)}
            onPressOut={() => animateLift(hovered ? 1 : 0)}
            style={styles.cardHitArea}
            accessibilityLabel={`${activity.title}, ${completed ? 'Ulangi' : 'Mulai'}`}>
            <View />
        </PressableDenganSuara>
      ) : null}
    </View>
  );

  return card;
}

export default function Beranda() {
  const progress = useActivityProgress();
  const profile = useUserProfile();
  const completedCount = Object.values(progress).filter(Boolean).length;
  const [showNameEditor, setShowNameEditor] = useState(false);
  const [draftName, setDraftName] = useState(profile.name);
  const [showNameError, setShowNameError] = useState(false);
  const [activityFade] = useState(() => new Animated.Value(0));
  const showNameForm = !profile.name || showNameEditor;
  const showActivities = Boolean(profile.name && profile.started && !showNameEditor);
  const nextActivity = activities.find((activity) => !progress[activity.id]) ?? activities[0];
  const nextActivityTitle = completedCount === activities.length
    ? 'Ulangi dari awal'
    : `Lanjutkan belajar`;

  useEffect(() => {
    if (!showActivities) {
      activityFade.setValue(0);
      return;
    }
    Animated.timing(activityFade, {
      toValue: 1,
      duration: layout.homeActivityCardFadeDuration,
      useNativeDriver: false,
    }).start();
  }, [activityFade, showActivities]);

  function ubahDraftNama(teks: string) {
    const aman = teks.normalize('NFC').replace(/[^\p{L} ]/gu, '').replace(/ +/g, ' ');
    setDraftName(aman.slice(0, layout.nameMaxLength));
    if (showNameError) setShowNameError(false);
  }

  function simpanNama() {
    const namaBersih = draftName.trim().replace(/\s+/g, ' ');
    if (!namaBersih) {
      setShowNameError(true);
      return;
    }
    const namaTampil = namaBersih
      .toLocaleLowerCase('id-ID')
      .replace(/(^|\s)\p{L}/gu, (huruf) => huruf.toLocaleUpperCase('id-ID'));
    saveUserName(namaTampil);
    setDraftName(namaTampil);
    setShowNameError(false);
    setShowNameEditor(false);
  }

  function mulaiBelajar() {
    markLearningStarted();
  }

  function gantiNama() {
    setDraftName(profile.name);
    setShowNameError(false);
    setShowNameEditor(true);
  }

  function lanjutkanBelajar() {
    router.push(nextActivity.href);
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Svg
            pointerEvents="none"
            width="100%"
            height="100%"
            style={StyleSheet.absoluteFill}
            preserveAspectRatio="none"
            aria-hidden={true}>
            <Defs>
              <LinearGradient id="heroBackground" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={colors.backgroundStart} />
                <Stop offset="0.52" stopColor={colors.backgroundMid} />
                <Stop offset="1" stopColor={colors.heroEnd} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#heroBackground)" />
          </Svg>
          <View style={styles.heroContent}>
            <View style={styles.heroTopRow}>
              <Text style={styles.eyebrow}>MATEMATIKA KELAS VIII–IX</Text>
              <TombolSuara />
            </View>
            {showNameForm ? (
              <>
                <Text style={styles.greeting}>Halo! Siapa namamu?</Text>
                <Text style={styles.heroDescription}>
                  Aku akan memanggilmu dengan nama ini selama belajar.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.greeting}>Halo, {profile.name}!</Text>
                {showActivities ? (
                  <PressableDenganSuara
                    accessibilityRole="button"
                    onPress={gantiNama}
                    style={styles.changeNameLink}>
                    <Text style={styles.changeNameText}>Ganti nama</Text>
                  </PressableDenganSuara>
                ) : null}
                <Text style={styles.heroTitle}>Teorema Pythagoras</Text>
                <Text style={styles.heroDescription}>
                  {showActivities
                    ? 'Kenali sisi, pilih rumus, dan pahami jawabanmu.'
                    : 'Siap belajar Teorema Pythagoras?'}
                </Text>
              </>
            )}
            <HeroIllustration />
            {showNameForm ? (
              <View style={styles.nameForm}>
                <Text style={styles.nameLabel}>Nama panggilan</Text>
                <TextInput
                  accessibilityLabel="Nama panggilan"
                  autoFocus={showNameForm}
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={layout.nameMaxLength}
                  onChangeText={ubahDraftNama}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Enter') {
                      bunyiTap();
                      simpanNama();
                    }
                  }}
                  placeholder="Contoh: Ardelia"
                  placeholderTextColor={colors.textSecondary}
                  returnKeyType="done"
                  style={styles.nameInput}
                  value={draftName}
                />
                {showNameError ? (
                  <Text style={styles.nameError}>Tulis namamu dulu ya.</Text>
                ) : null}
                <PressableDenganSuara
                  accessibilityRole="button"
                  onPress={simpanNama}
                  style={({ pressed }) => [
                    styles.startButton,
                    pressed && styles.startButtonPressed,
                  ]}>
                  <Text style={styles.startButtonText}>Lanjut</Text>
                </PressableDenganSuara>
              </View>
            ) : !profile.started ? (
              <>
                <PressableDenganSuara
                  accessibilityRole="button"
                  onPress={mulaiBelajar}
                  style={({ pressed }) => [
                    styles.startButton,
                    pressed && styles.startButtonPressed,
                  ]}>
                  <Text style={styles.startButtonText}>Mulai belajar</Text>
                  <Svg width={layout.actionArrowSize} height={layout.actionArrowSize} viewBox="0 0 20 20" fill="none">
                    <Path d={layout.arrowPath} stroke={colors.onPrimary} strokeWidth={layout.iconStrokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </PressableDenganSuara>
                <PressableDenganSuara
                  accessibilityRole="button"
                  onPress={gantiNama}
                  style={styles.changeNameLink}>
                  <Text style={styles.changeNameText}>Bukan {profile.name}? Ganti nama</Text>
                </PressableDenganSuara>
              </>
            ) : (
              <>
                {completedCount > 0 ? (
                  <View style={styles.heroContinue}>
                    <Text style={styles.nextActivityText}>
                      Berikutnya: {completedCount === activities.length ? activities[0].title : nextActivity.title}
                    </Text>
                    <PressableDenganSuara
                      accessibilityRole="button"
                      onPress={lanjutkanBelajar}
                      style={({ pressed }) => [
                        styles.startButton,
                        pressed && styles.startButtonPressed,
                      ]}>
                      <Text style={styles.startButtonText}>{nextActivityTitle}</Text>
                      <Svg width={layout.actionArrowSize} height={layout.actionArrowSize} viewBox="0 0 20 20" fill="none">
                        <Path d={layout.arrowPath} stroke={colors.onPrimary} strokeWidth={layout.iconStrokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </PressableDenganSuara>
                  </View>
                ) : null}
              </>
            )}
          </View>
        </View>

        {showActivities ? (
          <Animated.View style={[styles.homeContent, { opacity: activityFade }]}>
          <View style={styles.progressSummary}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressTitle}>Kemajuan belajar</Text>
              <Text style={styles.progressText}>{completedCount} dari 4 selesai</Text>
            </View>
            <View
              accessibilityRole="progressbar"
              accessibilityValue={{ min: 0, max: 4, now: completedCount }}
              style={styles.progressTrack}>
              <ProgressGradientFill
                progress={completedCount / activities.length}
                style={styles.progressFill}
              />
            </View>
          </View>

          <View style={styles.pathHeading}>
            <Text style={styles.pathTitle}>Lintasan belajar</Text>
            <Text style={styles.pathSubtitle}>Lanjutkan satu kegiatan dalam satu waktu.</Text>
          </View>
          <View style={styles.activityList}>
            {activities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                completed={progress[activity.id]}
              />
            ))}
          </View>
          </Animated.View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  hero: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: layout.heroRadius,
    borderBottomRightRadius: layout.heroRadius,
  },
  heroContent: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.horizontalPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.small,
    fontWeight: typography.weightSemiBold,
    letterSpacing: typography.smallLabelSpacing,
  },
  greeting: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.subtitle,
    fontWeight: typography.weightSemiBold,
    lineHeight: typography.subtitleLineHeight,
  },
  heroTitle: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.heroTitle,
    fontWeight: typography.weightSemiBold,
    lineHeight: typography.heroTitleLineHeight,
  },
  heroDescription: {
    color: colors.text,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  nameForm: {
    gap: spacing.xs,
  },
  nameLabel: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  nameInput: {
    minHeight: layout.nameInputMinHeight,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorderStrong,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.body,
  },
  nameError: {
    minHeight: layout.homeNameErrorHeight,
    color: colors.errorDark,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.caption,
    lineHeight: typography.captionLineHeight,
  },
  changeNameLink: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  },
  changeNameText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.caption,
    fontWeight: typography.weightSemiBold,
    textDecorationLine: 'underline',
  },
  heroContinue: {
    gap: layout.nameFieldLabelSpacing,
  },
  nextActivityText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.caption,
    fontWeight: typography.weightSemiBold,
    textAlign: 'center',
  },
  startButton: {
    minHeight: layout.homeActionHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.primary,
  },
  startButtonPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: layout.pressScale }],
  },
  startButtonText: {
    color: colors.onPrimary,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.body,
    fontWeight: typography.weightMedium,
  },
  homeContent: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.horizontalPadding,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  progressSummary: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.caption,
    fontWeight: typography.weightSemiBold,
  },
  progressText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.small,
    fontWeight: typography.weightSemiBold,
  },
  progressTrack: {
    height: layout.progressTrackHeight,
    overflow: 'hidden',
    borderRadius: layout.buttonPillRadius,
    backgroundColor: colors.progressTrack,
  },
  progressFill: {
    height: '100%',
    borderRadius: layout.buttonPillRadius,
    overflow: 'hidden',
  },
  pathHeading: {
    gap: spacing.xxs,
  },
  pathTitle: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.subtitle,
    fontWeight: typography.weightSemiBold,
    lineHeight: typography.subtitleLineHeight,
  },
  pathSubtitle: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  activityList: {
    gap: spacing.xs,
  },
  activityRow: {
    minHeight: layout.activityCardHeight,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
    position: 'relative',
  },
  markerColumn: {
    width: layout.timelineColumnWidth,
    alignItems: 'center',
  },
  marker: {
    zIndex: 1,
    width: layout.timelineMarkerSize,
    height: layout.timelineMarkerSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorderStrong,
    borderRadius: layout.buttonPillRadius,
    backgroundColor: colors.surface,
  },
  markerDone: {
    borderColor: colors.glassBorderStrong,
    backgroundColor: colors.surfaceMuted,
  },
  markerNumber: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.caption,
    fontWeight: typography.weightSemiBold,
  },
  connector: {
    position: 'absolute',
    top: layout.timelineMarkerSize,
    bottom: 0,
    width: layout.connectorWidth,
    backgroundColor: colors.lilacMid,
  },
  activityCard: {
    flex: 1,
    minHeight: layout.activityCardHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.cardRadius,
    backgroundColor: colors.surface,
    ...glassCardShadow,
  },
  activityCardDisabled: {
    backgroundColor: colors.surfaceMuted,
  },
  iconBox: {
    width: layout.activityIconBoxSize,
    height: layout.activityIconBoxSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.borderRadius,
    backgroundColor: colors.surfaceMuted,
  },
  activityText: {
    flex: 1,
    gap: spacing.xxs,
  },
  activityTitle: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.body,
    fontWeight: typography.weightSemiBold,
  },
  activityDescription: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.body,
    lineHeight: typography.bodyLineHeight,
  },
  activityAction: {
    minHeight: layout.pillActionHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: layout.buttonPillRadius,
    backgroundColor: colors.primary,
  },
  actionText: {
    color: colors.onPrimary,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.small,
    fontWeight: typography.weightMedium,
  },
  comingBadge: {
    backgroundColor: colors.lilac,
  },
  comingText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.small,
    fontWeight: typography.weightMedium,
  },
  cardHitArea: {
    ...StyleSheet.absoluteFill,
  },
});
