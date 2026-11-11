import type { Soal } from '@/data/soal';

export function acakUrutan<T>(items: readonly T[]): T[] {
  const hasil = [...items];
  for (let index = hasil.length - 1; index > 0; index -= 1) {
    const acak = Math.floor(Math.random() * (index + 1));
    [hasil[index], hasil[acak]] = [hasil[acak], hasil[index]];
  }
  return hasil;
}

export type HasilPemeriksaan =
  | { status: 'kosong' }
  | { status: 'tidak-valid' }
  | { status: 'benar' }
  | { status: 'salah'; penjelasan: string };

export function periksaJawaban(soal: Soal, masukan: string): HasilPemeriksaan {
  const normal = masukan.trim().replace(',', '.');
  if (!normal) {
    return { status: 'kosong' };
  }

  const jawaban = Number(normal);
  if (!Number.isFinite(jawaban)) {
    return { status: 'tidak-valid' };
  }

  if (Math.abs(jawaban - soal.jawaban) <= (soal.toleransi ?? 0.01)) {
    return { status: 'benar' };
  }

  const kesalahanUmum = soal.penjelasanSalah.find(
    (kesalahan) =>
      kesalahan.jawabanKeliru !== undefined &&
      Math.abs(jawaban - kesalahan.jawabanKeliru) <= (soal.toleransi ?? 0.01)
  );
  const fallback = soal.penjelasanSalah[0];

  return {
    status: 'salah',
    penjelasan: kesalahanUmum?.penjelasan ?? fallback.penjelasan,
  };
}
