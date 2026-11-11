import type { NamaSisi } from '@/components/SegitigaSiku';

export type LangkahBelajar = {
  judul: string;
  penjelasan: string;
  penjelasanUlang: string;
  rumus?: string;
  hitungan?: string[];
  penjelasanHitungan?: {
    setelahBaris: number;
    teks: string;
  };
};

export type ContohBelajar = {
  level: 1 | 2;
  judul: string;
  sisi: Record<NamaSisi, number | null>;
  yangDicari: NamaSisi;
  satuan: string;
  langkah: [LangkahBelajar, LangkahBelajar, LangkahBelajar, LangkahBelajar];
};

export const contohBelajar: ContohBelajar[] = [
  {
    level: 1,
    judul: 'Mencari sisi miring',
    sisi: { alas: 3, tegak: 4, miring: null },
    yangDicari: 'miring',
    satuan: 'cm',
    langkah: [
      {
        judul: 'Cari sudut siku-siku',
        penjelasan: 'Tanda kotak kecil pada gambar menunjukkan sudut siku-siku.',
        penjelasanUlang:
          'Dua sisi yang bertemu pada tanda kotak membentuk sudut 90 derajat.',
      },
      {
        judul: 'Tandai diketahui dan ditanyakan',
        penjelasan:
          'Diketahui: alas 3 cm dan tegak 4 cm. Ditanyakan: panjang sisi miring.',
        penjelasanUlang:
          'Sisi miring berada di depan tanda sudut siku-siku. Dua panjang lainnya sudah diketahui.',
      },
      {
        judul: 'Pilih rumus',
        penjelasan: 'Untuk mencari sisi miring, jumlahkan kuadrat kedua sisi lainnya.',
        penjelasanUlang:
          'Sisi miring menjadi c pada rumus Pythagoras: kuadrat sisi alas ditambah kuadrat sisi tegak.',
        rumus: 'a² + b² = c²',
      },
      {
        judul: 'Hitung',
        penjelasan: 'Hitung kuadrat kedua sisi, lalu ambil akar kuadratnya.',
        penjelasanUlang:
          'Karena 25 adalah kuadrat dari 5, panjang sisi miringnya 5 cm.',
        hitungan: ['c² = 3² + 4²', 'c² = 9 + 16 = 25', 'c = √25 = 5 cm'],
        penjelasanHitungan: {
          setelahBaris: 2,
          teks: 'Yang dicari adalah c, bukan c². Jadi ambil akar kuadrat dari 25.',
        },
      },
    ],
  },
  {
    level: 2,
    judul: 'Mencari sisi tegak',
    sisi: { alas: 5, tegak: null, miring: 13 },
    yangDicari: 'tegak',
    satuan: 'cm',
    langkah: [
      {
        judul: 'Cari sudut siku-siku',
        penjelasan: 'Tanda kotak kecil pada gambar menunjukkan sudut siku-siku.',
        penjelasanUlang:
          'Sisi yang berhadapan dengan tanda kotak adalah sisi miring, yaitu 13 cm.',
      },
      {
        judul: 'Tandai diketahui dan ditanyakan',
        penjelasan:
          'Diketahui: sisi miring 13 cm dan alas 5 cm. Ditanyakan: panjang sisi tegak.',
        penjelasanUlang:
          'Sisi miring selalu berhadapan dengan tanda siku-siku; panjang satu sisi lainnya adalah 5 cm.',
      },
      {
        judul: 'Pilih rumus',
        penjelasan: 'Untuk mencari sisi tegak, kurangi kuadrat sisi alas dari kuadrat sisi miring.',
        penjelasanUlang:
          'Ubah rumus Pythagoras agar sisi yang dicari berdiri sendiri: b² = c² − a².',
        rumus: 'b² = c² − a²',
      },
      {
        judul: 'Hitung',
        penjelasan: 'Kurangi kuadrat sisi miring dengan kuadrat alas, lalu ambil akarnya.',
        penjelasanUlang:
          'Akar kuadrat 144 adalah 12, jadi panjang sisi tegak 12 cm.',
        hitungan: ['b² = 13² − 5²', 'b² = 169 − 25 = 144', 'b = √144 = 12 cm'],
        penjelasanHitungan: {
          setelahBaris: 2,
          teks: 'Yang dicari adalah b, bukan b². Jadi ambil akar kuadrat dari 144.',
        },
      },
    ],
  },
];
