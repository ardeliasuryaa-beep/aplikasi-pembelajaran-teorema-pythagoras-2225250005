import {
  AmbientLight,
  AdditiveBlending,
  BufferGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { createElement, useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { CSSProperties } from 'react';

import { AppText as Text } from '@/components/AppText';
import { PressableDenganSuara } from '@/components/PressableDenganSuara';
import type {
  NamaSisi,
  SegitigaSikuProps,
} from '@/components/SegitigaSikuSvg';
import { colors, layout, spacing, typography, visual3D } from '@/theme';

type Props = SegitigaSikuProps & {
  saatWebglTidakTersedia: () => void;
};

type LabelSisi = {
  element: HTMLSpanElement;
};

type SceneAktif = {
  camera: PerspectiveCamera;
  group: Group;
  draw: () => void;
  stopIntro: () => void;
  aturZoom: (nilai: number) => void;
  reset: () => void;
  updatePresentation: () => void;
};

const URUTAN_SISI: NamaSisi[] = ['alas', 'tegak', 'miring'];
const NAMA_SISI: Record<NamaSisi, string> = {
  alas: 'Alas',
  tegak: 'Tegak',
  miring: 'Miring',
};
const VARIABEL_SISI: Record<NamaSisi, string> = {
  alas: 'a',
  tegak: 'b',
  miring: 'c',
};
const LABEL_NETRAL: Record<NamaSisi, string> = {
  alas: 'A',
  tegak: 'B',
  miring: 'C',
};

function nilaiNumerik(nilai: number | string | null | undefined) {
  if (nilai == null) return null;
  const hasil = Number(String(nilai).replace(',', '.'));
  return Number.isFinite(hasil) && hasil > 0 ? hasil : null;
}

function panjangSisi(props: SegitigaSikuProps) {
  let alas = nilaiNumerik(props.sisi?.alas) ?? 3;
  let tegak = nilaiNumerik(props.sisi?.tegak) ?? 4;
  const miring = nilaiNumerik(props.sisi?.miring);

  if (nilaiNumerik(props.sisi?.alas) === null && miring !== null) {
    alas = Math.sqrt(Math.max(0, miring ** 2 - tegak ** 2));
  } else if (nilaiNumerik(props.sisi?.tegak) === null && miring !== null) {
    tegak = Math.sqrt(Math.max(0, miring ** 2 - alas ** 2));
  }

  return { alas, tegak };
}

function teksNilai(
  nilai: number | string | null | undefined,
  satuan: string,
  dicari: boolean,
  tampilkanNilaiYangDicari: boolean
) {
  if ((dicari && !tampilkanNilaiYangDicari) || nilai == null) return '?';
  return `${nilai}${satuan ? ` ${satuan}` : ''}`;
}

function teksLabel(props: SegitigaSikuProps, sisi: NamaSisi) {
  const nilai = teksNilai(
    props.sisi?.[sisi],
    props.satuan ?? '',
    props.yangDicari === sisi,
    props.tampilkanNilaiYangDicari ?? false
  );

  if (
    props.onPilihSisi &&
    !props.tampilkanSemuaNamaSisi &&
    !props.tampilkanMiring
  ) {
    return LABEL_NETRAL[sisi];
  }

  const tampilkanNama =
    props.tampilkanSemuaNamaSisi ||
    (sisi === 'miring' && props.tampilkanMiring);
  if (!tampilkanNama) return nilai;

  const nama = props.tampilkanVariabel
    ? `${NAMA_SISI[sisi]} ${VARIABEL_SISI[sisi]} = `
    : `${NAMA_SISI[sisi]} `;
  return `${nama}${nilai}`;
}

function warnaSisi(props: SegitigaSikuProps, sisi: NamaSisi) {
  if (props.warnaBerdasarkanPeran) {
    return colors.primary;
  }
  if (sisi === 'miring' && props.tampilkanMiring) return colors.emphasis;
  if (props.tampilkanSemuaNamaSisi && props.sisiAktif === sisi) {
    return colors.primary;
  }
  return colors.sideKnown;
}

function buatLabel(): LabelSisi {
  const element = document.createElement('span');
  element.setAttribute('aria-hidden', 'true');
  Object.assign(element.style, {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: `${typography.sideLabel}px`,
    fontWeight: typography.weightMedium,
    lineHeight: `${typography.captionLineHeight}px`,
    textShadow: `0 0 ${spacing.xxs}px ${colors.surface}`,
    zIndex: String(visual3D.labelRenderOrder),
  });
  return { element };
}

function gambarLabel(label: LabelSisi, teks: string, warna: string) {
  label.element.textContent = teks;
  label.element.style.color = warna;
}

function jarakKeSegmen(titik: Vector2, awal: Vector2, akhir: Vector2) {
  const sisiX = akhir.x - awal.x;
  const sisiY = akhir.y - awal.y;
  const panjangKuadrat = sisiX ** 2 + sisiY ** 2;
  const posisi = panjangKuadrat
    ? Math.max(
        0,
        Math.min(
          1,
          ((titik.x - awal.x) * sisiX + (titik.y - awal.y) * sisiY) /
            panjangKuadrat
        )
      )
    : 0;
  return Math.hypot(
    titik.x - (awal.x + posisi * sisiX),
    titik.y - (awal.y + posisi * sisiY)
  );
}

function buatSilinder(awal: Vector3, akhir: Vector3, radius: number) {
  const arah = new Vector3().subVectors(akhir, awal);
  const geometry = new CylinderGeometry(
    radius,
    radius,
    arah.length(),
    visual3D.edgeSegments
  );
  const mesh = new Mesh(geometry);
  mesh.position.copy(new Vector3().addVectors(awal, akhir).multiplyScalar(0.5));
  mesh.quaternion.setFromUnitVectors(
    new Vector3(0, 1, 0),
    arah.normalize()
  );
  return mesh;
}

function formatAksesibilitas(props: SegitigaSikuProps) {
  const sisi = URUTAN_SISI.map((nama) => {
    const isi = teksLabel(props, nama);
    return `${LABEL_NETRAL[nama]}: ${isi}`;
  }).join('. ');
  return `Segitiga siku-siku tiga dimensi. ${sisi}. Seret dengan mouse atau satu jari untuk memutar. Cubit untuk memperbesar atau memperkecil. Tekan tombol panah untuk memutar, plus atau minus untuk zoom, dan nol untuk mengatur ulang. Saat memilih sisi, tombol A, B, dan C memilih sisi pada gambar.`;
}

export function VisualisasiSegitiga3D(props: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneAktif | null>(null);
  const konfigurasi = useMemo<SegitigaSikuProps>(
    () => ({
      sisi: props.sisi ?? { alas: 3, tegak: 4, miring: 5 },
      satuan: props.satuan,
      orientasi: props.orientasi,
      cermin: props.cermin,
      yangDicari: props.yangDicari,
      sisiAktif: props.sisiAktif,
      tampilkanMiring: props.tampilkanMiring,
      tampilkanSemuaNamaSisi: props.tampilkanSemuaNamaSisi,
      tampilkanVariabel: props.tampilkanVariabel,
      tampilkanNilaiYangDicari: props.tampilkanNilaiYangDicari,
      warnaBerdasarkanPeran: props.warnaBerdasarkanPeran,
      onPilihSisi: props.onPilihSisi,
    }),
    [
      props.sisi,
      props.satuan,
      props.orientasi,
      props.cermin,
      props.yangDicari,
      props.sisiAktif,
      props.tampilkanMiring,
      props.tampilkanSemuaNamaSisi,
      props.tampilkanVariabel,
      props.tampilkanNilaiYangDicari,
      props.warnaBerdasarkanPeran,
      props.onPilihSisi,
    ]
  );
  const propsRef = useRef<SegitigaSikuProps>(konfigurasi);
  const unavailableRef = useRef(props.saatWebglTidakTersedia);

  const lengths = panjangSisi(konfigurasi);
  const shapeKey = JSON.stringify([
    lengths.alas,
    lengths.tegak,
    props.orientasi ?? 0,
    props.cermin ?? false,
  ]);
  useEffect(() => {
    propsRef.current = konfigurasi;
    unavailableRef.current = props.saatWebglTidakTersedia;
    sceneRef.current?.updatePresentation();
  }, [konfigurasi, props.saatWebglTidakTersedia]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !hostRef.current) return;

    const host = hostRef.current;
    let active = true;
    let frame = 0;
    let observer: ResizeObserver | null = null;
    let renderer: WebGLRenderer;

    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
    } catch (error) {
      console.warn('Visualisasi 3D tidak tersedia; menggunakan gambar cadangan.', error);
      unavailableRef.current();
      return;
    }

    const propsAwal = propsRef.current;
    const ukuran = panjangSisi(propsAwal);
    const skala = visual3D.triangleMaxLeg / Math.max(ukuran.alas, ukuran.tegak);
    const lebar = ukuran.alas * skala;
    const tinggi = ukuran.tegak * skala;
    const depth = visual3D.triangleDepth;
    const sisiKiri = propsAwal.cermin ? lebar / 2 : -lebar / 2;
    const sisiKanan = -sisiKiri;
    const siku = new Vector3(sisiKiri, -tinggi / 2, 0);
    const tegak = new Vector3(sisiKiri, tinggi / 2, 0);
    const alas = new Vector3(sisiKanan, -tinggi / 2, 0);
    const centroid = new Vector3(
      (siku.x + tegak.x + alas.x) / 3,
      (siku.y + tegak.y + alas.y) / 3,
      0
    );
    const shape = new Shape();
    shape.moveTo(siku.x, siku.y);
    shape.lineTo(tegak.x, tegak.y);
    shape.lineTo(alas.x, alas.y);
    shape.closePath();

    const geometry = new ExtrudeGeometry(shape, {
      bevelEnabled: true,
      bevelSegments: visual3D.bevelSegments,
      bevelSize: visual3D.bevelSize,
      bevelThickness: visual3D.bevelThickness,
      depth,
      steps: visual3D.extrudeSteps,
    });
    const faceMaterial = new MeshPhysicalMaterial({
      color: colors.primary,
      emissive: colors.primary,
      emissiveIntensity: visual3D.materialEmissiveIntensity,
      roughness: visual3D.materialRoughness,
      metalness: visual3D.materialMetalness,
      clearcoat: visual3D.materialClearcoat,
      transparent: true,
      opacity: visual3D.faceOpacity,
      side: DoubleSide,
    });
    const face = new Mesh(geometry, faceMaterial);
    face.name = 'bidang-segitiga';

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      visual3D.cameraFieldOfView,
      1,
      visual3D.cameraNear,
      visual3D.cameraFar
    );
    camera.position.set(0, 0, visual3D.cameraDistance);
    camera.lookAt(0, 0, 0);

    const group = new Group();
    group.rotation.z = ((propsAwal.orientasi ?? 0) * Math.PI) / 180;
    group.rotation.y = visual3D.introInitialYaw;
    group.rotation.x = visual3D.introInitialPitch;
    group.add(face);

    const edges = new Map<NamaSisi, Mesh>();
    const edgeGlows = new Map<NamaSisi, Mesh>();
    const labels = new Map<NamaSisi, LabelSisi>();
    const edgeTargets = new Map<NamaSisi, [Vector3, Vector3]>();
    const sidePoints: Record<NamaSisi, [Vector3, Vector3]> = {
      alas: [siku, alas],
      tegak: [siku, tegak],
      miring: [tegak, alas],
    };

    for (const name of URUTAN_SISI) {
      const [start, end] = sidePoints[name];
      const frontStart = start.clone();
      const frontEnd = end.clone();
      frontStart.z = depth + visual3D.edgeFrontOffset;
      frontEnd.z = depth + visual3D.edgeFrontOffset;
      edgeTargets.set(name, [frontStart, frontEnd]);

      const edge = buatSilinder(
        frontStart,
        frontEnd,
        visual3D.edgeRadius
      );
      edge.material = new MeshStandardMaterial({
        color: colors.sideKnown,
        roughness: visual3D.materialRoughness,
        metalness: visual3D.materialMetalness,
        transparent: true,
      });
      edge.userData.sisi = name;
      edges.set(name, edge);
      group.add(edge);

      const glow = buatSilinder(
        frontStart,
        frontEnd,
        visual3D.edgeRadius * visual3D.edgeGlowRadiusScale
      );
      glow.material = new MeshBasicMaterial({
        color: colors.primary,
        transparent: true,
        opacity: visual3D.edgeGlowOpacity,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      edgeGlows.set(name, glow);
      group.add(glow);

      labels.set(name, buatLabel());
    }

    const markerSize = visual3D.rightAngleSize;
    const arahAlas = new Vector3(alas.x - siku.x, 0, 0).normalize();
    const arahTegak = new Vector3(0, tegak.y - siku.y, 0).normalize();
    const markerPoints = [
      siku
        .clone()
        .addScaledVector(arahAlas, markerSize)
        .add(new Vector3(0, 0, depth + visual3D.markerFrontOffset)),
      siku
        .clone()
        .addScaledVector(arahAlas, markerSize)
        .addScaledVector(arahTegak, markerSize)
        .add(new Vector3(0, 0, depth + visual3D.markerFrontOffset)),
      siku
        .clone()
        .addScaledVector(arahTegak, markerSize)
        .add(new Vector3(0, 0, depth + visual3D.markerFrontOffset)),
    ];
    const markerGeometry = new BufferGeometry().setFromPoints(markerPoints);
    const marker = new Line(
      markerGeometry,
      new LineBasicMaterial({ color: colors.primaryDark })
    );
    group.add(marker);

    scene.add(group);
    scene.add(new AmbientLight(colors.onPrimary, visual3D.ambientLightIntensity));
    const keyLight = new DirectionalLight(
      colors.onPrimary,
      visual3D.directionalLightIntensity
    );
    keyLight.position.set(
      visual3D.lightPositionX,
      visual3D.lightPositionY,
      visual3D.lightPositionZ
    );
    scene.add(keyLight);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.touchAction = 'none';
    canvas.style.outline = 'none';
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-roledescription', 'segitiga tiga dimensi interaktif');
    canvas.setAttribute('aria-label', formatAksesibilitas(propsAwal));
    host.appendChild(canvas);
    for (const label of labels.values()) {
      host.appendChild(label.element);
    }

    const resize = () => {
      if (!active) return;
      const { width, height: viewHeight } = host.getBoundingClientRect();
      if (width <= 0 || viewHeight <= 0) return;
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, visual3D.maxPixelRatio)
      );
      renderer.setSize(width, viewHeight, false);
      camera.aspect = width / viewHeight;
      camera.updateProjectionMatrix();
      draw();
    };

    const draw = () => {
      group.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      const { width, height: viewHeight } = host.getBoundingClientRect();
      const projectPoint = (point: Vector3) =>
        group.localToWorld(point.clone()).project(camera);
      const centroidFront = centroid.clone();
      centroidFront.z = depth + visual3D.edgeFrontOffset;
      const projectedCentroid = projectPoint(centroidFront);
      for (const [name, label] of labels) {
        const target = edgeTargets.get(name);
        if (!target) continue;
        const [start, end] = target.map(projectPoint);
        const startOnScreen = new Vector2(
          ((start.x + 1) / 2) * width,
          ((1 - start.y) / 2) * viewHeight
        );
        const endOnScreen = new Vector2(
          ((end.x + 1) / 2) * width,
          ((1 - end.y) / 2) * viewHeight
        );
        const middle = new Vector2()
          .addVectors(startOnScreen, endOnScreen)
          .multiplyScalar(0.5);
        const direction = new Vector2().subVectors(endOnScreen, startOnScreen);
        const outward = middle.clone().sub(
          new Vector2(
            ((projectedCentroid.x + 1) / 2) * width,
            ((1 - projectedCentroid.y) / 2) * viewHeight
          )
        );
        const normal = new Vector2(-direction.y, direction.x);
        if (normal.lengthSq() < 1e-6) normal.copy(outward);
        if (normal.lengthSq() < 1e-6) normal.set(0, -1);
        normal.normalize();
        if (normal.dot(outward) < 0) normal.negate();
        const labelWidth = label.element.offsetWidth;
        const labelHeight = label.element.offsetHeight;
        const extent =
          Math.abs(normal.x) * (labelWidth / 2) +
          Math.abs(normal.y) * (labelHeight / 2);
        const distance = extent + visual3D.labelScreenGap;
        const position = middle.clone().addScaledVector(normal, distance);
        const fits = (point: Vector2) =>
          point.x - labelWidth / 2 >= visual3D.labelViewportPadding &&
          point.x + labelWidth / 2 <= width - visual3D.labelViewportPadding &&
          point.y - labelHeight / 2 >= visual3D.labelViewportPadding &&
          point.y + labelHeight / 2 <= viewHeight - visual3D.labelViewportPadding;
        if (!fits(position)) {
          const alternate = middle.clone().addScaledVector(normal, -distance);
          if (fits(alternate)) position.copy(alternate);
        }
        const visible =
          (start.z + end.z) / 2 >= -1 &&
          (start.z + end.z) / 2 <= 1 &&
          fits(position);
        label.element.style.display = visible ? 'block' : 'none';
        if (visible) {
          label.element.style.left = `${position.x}px`;
          label.element.style.top = `${position.y}px`;
        }
      }
      renderer.render(scene, camera);
    };
    let animating = true;
    let introFrame = 0;
    const animate = () => {
      if (!active || !animating) return;
      introFrame += 1;
      group.rotation.y =
        visual3D.introInitialYaw +
        Math.sin(introFrame * visual3D.introOscillationSpeed) *
          visual3D.introRotationAmplitude;
      draw();
      frame = window.requestAnimationFrame(animate);
    };
    const stopIntro = () => {
      if (!animating) return;
      animating = false;
      window.cancelAnimationFrame(frame);
    };
    const aturZoom = (nilai: number) => {
      camera.zoom = Math.max(
        visual3D.minZoom,
        Math.min(visual3D.maxZoom, nilai)
      );
      camera.updateProjectionMatrix();
      draw();
    };
    const reset = () => {
      stopIntro();
      group.rotation.set(
        visual3D.introInitialPitch,
        visual3D.introInitialYaw,
        ((propsRef.current.orientasi ?? 0) * Math.PI) / 180
      );
      camera.zoom = visual3D.defaultZoom;
      camera.updateProjectionMatrix();
      draw();
    };

    const updatePresentation = () => {
      const current = propsRef.current;
      canvas.setAttribute('aria-label', formatAksesibilitas(current));
      for (const name of URUTAN_SISI) {
        const edge = edges.get(name);
        const glow = edgeGlows.get(name);
        const label = labels.get(name);
        if (!edge || !glow || !label) continue;

        const material = edge.material as MeshStandardMaterial;
        material.color.set(warnaSisi(current, name));
        material.opacity =
          current.warnaBerdasarkanPeran && current.yangDicari === name
            ? visual3D.wantedEdgeOpacity
            : visual3D.normalEdgeOpacity;
        material.needsUpdate = true;
        const glowMaterial = glow.material as MeshBasicMaterial;
        glowMaterial.color.set(colors.primary);
        const thickness = current.warnaBerdasarkanPeran && current.yangDicari === name
          ? visual3D.wantedEdgeScale
          : visual3D.normalEdgeScale;
        edge.scale.set(thickness, 1, thickness);
        glow.scale.set(thickness, 1, thickness);
        label.element.style.fontWeight =
          current.warnaBerdasarkanPeran && current.yangDicari === name
            ? typography.weightSemiBold
            : typography.weightMedium;
        gambarLabel(label, teksLabel(current, name), colors.sideLabel);
      }
      draw();
    };

    const resizeObserverAvailable = typeof ResizeObserver !== 'undefined';
    if (resizeObserverAvailable) {
      observer = new ResizeObserver(resize);
      observer.observe(host);
    } else {
      window.addEventListener('resize', resize);
    }
    resize();

    const pointerDown = (event: PointerEvent) => {
      stopIntro();
      canvas.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, {
        awal: new Vector2(event.clientX, event.clientY),
        terakhir: new Vector2(event.clientX, event.clientY),
      });
      if (pointers.size === 2) {
        const [first, second] = [...pointers.values()];
        jarakCubit = first.terakhir.distanceTo(second.terakhir);
      }
    };

    const pointers = new Map<
      number,
      { awal: Vector2; terakhir: Vector2; mulai?: Vector2 }
    >();
    let jarakCubit = 0;
    const pointerMove = (event: PointerEvent) => {
      const pointer = pointers.get(event.pointerId);
      if (!pointer) return;

      const next = new Vector2(event.clientX, event.clientY);
      const deltaX = next.x - pointer.terakhir.x;
      const deltaY = next.y - pointer.terakhir.y;
      pointer.terakhir.copy(next);

      if (pointers.size >= 2) {
        const [first, second] = [...pointers.values()];
        const distance = first.terakhir.distanceTo(second.terakhir);
        if (jarakCubit > 0) {
          aturZoom(
            camera.zoom * (distance / jarakCubit) ** visual3D.pinchZoomPower
          );
        }
        jarakCubit = distance;
        return;
      }

      group.rotation.y += deltaX * visual3D.rotationSensitivity;
      group.rotation.x += deltaY * visual3D.rotationSensitivity;
      draw();
    };

    const pilihSisiDenganSatuKetukan = (event: PointerEvent) => {
      const pointer = pointers.get(event.pointerId);
      if (!pointer) return;
      const moved = pointer.awal.distanceTo(pointer.terakhir);
      if (moved <= visual3D.tapMoveThreshold && pointers.size === 1) {
        const bounds = canvas.getBoundingClientRect();
        const tapPoint = new Vector2(event.clientX, event.clientY);
        let closestSide: NamaSisi | undefined;
        let closestDistance = Number.POSITIVE_INFINITY;
        group.updateMatrixWorld(true);
        camera.updateMatrixWorld(true);
        for (const [name, [start, end]] of edgeTargets) {
          const project = (point: Vector3) => {
            const screenPoint = group.localToWorld(point.clone()).project(camera);
            return new Vector2(
              bounds.left + ((screenPoint.x + 1) / 2) * bounds.width,
              bounds.top + ((1 - screenPoint.y) / 2) * bounds.height
            );
          };
          const projectedStart = project(start);
          const projectedEnd = project(end);
          const distance = jarakKeSegmen(tapPoint, projectedStart, projectedEnd);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSide = name;
          }
        }
        if (
          closestSide &&
          closestDistance <= visual3D.edgeHitTolerance &&
          propsRef.current.onPilihSisi
        ) {
          propsRef.current.onPilihSisi(closestSide);
        }
      }
      pointers.delete(event.pointerId);
    };

    const pointerCancel = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const current = propsRef.current;
      const sideKeys: Record<string, NamaSisi> = {
        a: 'alas',
        b: 'tegak',
        c: 'miring',
      };
      const key = event.key.toLowerCase();
      if (sideKeys[key] && current.onPilihSisi) {
        event.preventDefault();
        stopIntro();
        current.onPilihSisi(sideKeys[key]);
        return;
      }

      stopIntro();
      if (event.key === 'ArrowLeft') group.rotation.y -= visual3D.keyboardRotationStep;
      else if (event.key === 'ArrowRight') group.rotation.y += visual3D.keyboardRotationStep;
      else if (event.key === 'ArrowUp') group.rotation.x -= visual3D.keyboardRotationStep;
      else if (event.key === 'ArrowDown') group.rotation.x += visual3D.keyboardRotationStep;
      else if (event.key === '+' || event.key === '=') {
        aturZoom(camera.zoom + visual3D.zoomStep);
        return;
      } else if (event.key === '-') {
        aturZoom(camera.zoom - visual3D.zoomStep);
        return;
      } else if (event.key === '0' || event.key === 'Home') {
        reset();
        return;
      } else {
        return;
      }
      event.preventDefault();
      draw();
    };

    const focus = () => {
      canvas.style.outline = `${layout.iconStrokeWidth}px solid ${colors.primary}`;
      canvas.style.outlineOffset = `${spacing.xs}px`;
    };
    const blur = () => {
      canvas.style.outline = 'none';
      canvas.style.outlineOffset = '0';
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      console.warn('Konteks WebGL terputus; beralih ke gambar segitiga cadangan.');
      unavailableRef.current();
    };

    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pilihSisiDenganSatuKetukan);
    canvas.addEventListener('pointercancel', pointerCancel);
    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('focus', focus);
    canvas.addEventListener('blur', blur);
    canvas.addEventListener('webglcontextlost', contextLost);

    const sceneAktif: SceneAktif = {
      camera,
      group,
      draw,
      stopIntro,
      aturZoom,
      reset,
      updatePresentation,
    };
    sceneRef.current = sceneAktif;
    updatePresentation();
    frame = window.requestAnimationFrame(animate);

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      if (!resizeObserverAvailable) window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pilihSisiDenganSatuKetukan);
      canvas.removeEventListener('pointercancel', pointerCancel);
      canvas.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('focus', focus);
      canvas.removeEventListener('blur', blur);
      canvas.removeEventListener('webglcontextlost', contextLost);
      scene.traverse((object) => {
        if (
          (object instanceof Mesh || object instanceof Line) &&
          object.geometry instanceof BufferGeometry
        ) {
          object.geometry.dispose();
        }
        const materials =
          object instanceof Mesh
            ? Array.isArray(object.material)
              ? object.material
              : [object.material]
            : object instanceof Line
              ? [object.material]
              : [];
        for (const material of materials) material.dispose();
      });
      for (const label of labels.values()) label.element.remove();
      renderer.dispose();
      renderer.forceContextLoss();
      if (canvas.parentElement === host) host.removeChild(canvas);
      sceneRef.current = null;
    };
  }, [shapeKey]);

  const kontrol = (aksi: 'zoom-in' | 'zoom-out' | 'reset') => {
    const activeScene = sceneRef.current;
    if (!activeScene) return;
    activeScene.stopIntro();
    if (aksi === 'reset') {
      activeScene.reset();
    } else {
      activeScene.aturZoom(
        activeScene.camera.zoom +
          (aksi === 'zoom-in' ? visual3D.zoomStep : -visual3D.zoomStep)
      );
    }
  };

  const hostStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: layout.triangle3DCanvasHeight,
    overflow: 'hidden',
    borderRadius: layout.diagramRadius,
    backgroundColor: colors.surface,
    border: `${spacing.xxs}px solid ${colors.glassBorder}`,
    boxSizing: 'border-box',
    touchAction: 'none',
  };

  return (
    <View style={styles.viewer}>
      {createElement('div', {
        ref: hostRef,
        role: 'group',
        'aria-label': formatAksesibilitas(konfigurasi),
        style: hostStyle,
      })}
      <View style={styles.controlRow}>
        <Text style={styles.gestureHint}>Seret untuk putar</Text>
        <View style={styles.controls}>
          <PressableDenganSuara
            accessibilityRole="button"
            accessibilityLabel="Perkecil segitiga"
            onPress={() => kontrol('zoom-out')}
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlPressed,
            ]}>
            <Text style={styles.controlText}>−</Text>
          </PressableDenganSuara>
          <PressableDenganSuara
            accessibilityRole="button"
            accessibilityLabel="Perbesar segitiga"
            onPress={() => kontrol('zoom-in')}
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlPressed,
            ]}>
            <Text style={styles.controlText}>+</Text>
          </PressableDenganSuara>
          <PressableDenganSuara
            accessibilityRole="button"
            accessibilityLabel="Atur ulang posisi dan zoom segitiga"
            onPress={() => kontrol('reset')}
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.controlPressed,
            ]}>
            <Text style={styles.resetText}>Reset</Text>
          </PressableDenganSuara>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewer: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  controlRow: {
    width: '100%',
    minHeight: layout.triangle3DControlsHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  gestureHint: {
    flexShrink: 1,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.small,
    lineHeight: typography.captionLineHeight,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  controlButton: {
    width: layout.triangle3DControlSize,
    height: layout.triangle3DControlSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.surface,
  },
  resetButton: {
    minWidth: layout.triangle3DResetWidth,
    height: layout.triangle3DControlSize,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.surface,
  },
  controlText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.subtitle,
    fontWeight: typography.weightMedium,
  },
  resetText: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.headingMedium,
    fontSize: typography.caption,
    fontWeight: typography.weightMedium,
  },
  controlPressed: {
    backgroundColor: colors.lilac,
  },
});
