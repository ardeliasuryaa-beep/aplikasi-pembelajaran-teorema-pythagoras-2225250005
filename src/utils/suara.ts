const KUNCI_PENYIMPANAN = 'pythagoras:suara-aktif';
const JARAK_KETUK_MINIMUM_MS = 80;
const SUMBER_AKTIF = new Set<OscillatorNode>();
const SUMBER_SELESAI = new WeakSet<OscillatorNode>();
const pelanggan = new Set<() => void>();

let konteksAudio: AudioContext | null = null;
let suaraAktif = true;
let preferensiDibaca = false;
let ketukTerakhir = 0;

function bacaPreferensi() {
  if (preferensiDibaca) {
    return;
  }
  preferensiDibaca = true;

  if (typeof window === 'undefined') {
    return;
  }

  try {
    const tersimpan = window.localStorage.getItem(KUNCI_PENYIMPANAN);
    if (tersimpan === 'true' || tersimpan === 'false') {
      suaraAktif = tersimpan === 'true';
    }
  } catch (error) {
    console.warn('Preferensi suara tidak dapat dibaca.', error);
  }
}

function dapatkanKonteksAudio() {
  if (!konteksAudio) {
    if (typeof window === 'undefined') {
      throw new Error('Web Audio API tidak tersedia di browser ini.');
    }

    const AudioContextCadangan = (
      window as Window & { webkitAudioContext?: typeof AudioContext }
    ).webkitAudioContext;
    const PembuatAudio = window.AudioContext ?? AudioContextCadangan;
    if (!PembuatAudio) {
      throw new Error('Web Audio API tidak tersedia di browser ini.');
    }
    konteksAudio = new PembuatAudio();
  }

  if (konteksAudio.state === 'suspended') {
    void konteksAudio.resume().catch((error: unknown) => {
      console.warn('Audio tidak dapat diaktifkan.', error);
    });
  }

  return konteksAudio;
}

function hentikanSuaraAktif() {
  for (const sumber of SUMBER_AKTIF) {
    if (SUMBER_SELESAI.has(sumber)) {
      continue;
    }
    try {
      sumber.stop();
      SUMBER_SELESAI.add(sumber);
    } catch (error) {
      console.warn('Suara sebelumnya tidak dapat dihentikan.', error);
    }
  }
  SUMBER_AKTIF.clear();
}

function bunyikanNada(
  konteks: AudioContext,
  frekuensi: number,
  waktuMulai: number,
  durasi: number,
  bentuk: OscillatorType,
  gainPuncak: number,
  frekuensiAkhir?: number
) {
  const osilator = konteks.createOscillator();
  const gain = konteks.createGain();
  osilator.type = bentuk;
  osilator.frequency.setValueAtTime(frekuensi, waktuMulai);
  if (frekuensiAkhir !== undefined) {
    osilator.frequency.exponentialRampToValueAtTime(frekuensiAkhir, waktuMulai + durasi);
  }

  const serang = Math.min(0.012, durasi / 4);
  gain.gain.setValueAtTime(0.0001, waktuMulai);
  gain.gain.exponentialRampToValueAtTime(gainPuncak, waktuMulai + serang);
  gain.gain.exponentialRampToValueAtTime(0.0001, waktuMulai + durasi);
  osilator.connect(gain);
  gain.connect(konteks.destination);
  osilator.onended = () => {
    SUMBER_AKTIF.delete(osilator);
    SUMBER_SELESAI.add(osilator);
  };
  SUMBER_AKTIF.add(osilator);
  osilator.start(waktuMulai);
  osilator.stop(waktuMulai + durasi + 0.01);
}

function bunyikanLonceng(
  konteks: AudioContext,
  frekuensi: number,
  waktuMulai: number
) {
  bunyikanNada(konteks, frekuensi, waktuMulai, 0.34, 'triangle', 0.16);
  bunyikanNada(konteks, frekuensi * 2, waktuMulai, 0.34, 'sine', 0.04);
}

function mulaiSuara(aksi: (konteks: AudioContext, waktuMulai: number) => void) {
  if (!getSuaraAktif()) {
    return;
  }

  try {
    const konteks = dapatkanKonteksAudio();
    hentikanSuaraAktif();
    aksi(konteks, konteks.currentTime);
  } catch (error) {
    console.warn('Suara tidak dapat diputar.', error);
  }
}

export function getSuaraAktif() {
  bacaPreferensi();
  return suaraAktif;
}

export function subscribeSuara(callback: () => void) {
  pelanggan.add(callback);
  return () => pelanggan.delete(callback);
}

export function aturSuaraAktif(aktif: boolean) {
  bacaPreferensi();
  if (suaraAktif === aktif) {
    return;
  }

  suaraAktif = aktif;
  if (!aktif) {
    try {
      hentikanSuaraAktif();
    } catch (error) {
      console.warn('Suara aktif tidak dapat dihentikan.', error);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(KUNCI_PENYIMPANAN, String(aktif));
    } catch (error) {
      console.warn('Preferensi suara tidak dapat disimpan.', error);
    }
  }

  pelanggan.forEach((callback) => callback());
}

export function bunyiTap() {
  if (!getSuaraAktif()) {
    return;
  }
  const sekarang = Date.now();
  if (sekarang - ketukTerakhir < JARAK_KETUK_MINIMUM_MS) {
    return;
  }
  ketukTerakhir = sekarang;

  mulaiSuara((konteks, waktuMulai) => {
    bunyikanNada(konteks, 900, waktuMulai, 0.05, 'sine', 0.07, 620);
  });
}

export function bunyiBenar() {
  mulaiSuara((konteks, waktuMulai) => {
    bunyikanLonceng(konteks, 523.25, waktuMulai);
    bunyikanLonceng(konteks, 783.99, waktuMulai + 0.11);
  });
}

export function bunyiSalah() {
  mulaiSuara((konteks, waktuMulai) => {
    bunyikanNada(konteks, 392, waktuMulai, 0.42, 'sine', 0.13, 247);
  });
}

export function bunyiSelesai() {
  mulaiSuara((konteks, waktuMulai) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((frekuensi, index) => {
      bunyikanLonceng(konteks, frekuensi, waktuMulai + index * 0.12);
    });
  });
}
