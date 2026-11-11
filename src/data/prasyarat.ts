export type KartuPrasyarat = {
  id: 'kuadrat' | 'akar' | 'segitiga';
  judul: string;
  penjelasan: string;
  penjelasanUlang: string;
  contoh?: string;
};

export const kartuPrasyarat: KartuPrasyarat[] = [
  {
    id: 'kuadrat',
    judul: 'Kuadrat',
    penjelasan: '5² berarti 5 × 5 = 25.',
    penjelasanUlang: 'Kalikan 5 dengan 5; hasilnya adalah 25.',
  },
  {
    id: 'akar',
    judul: 'Akar kuadrat',
    penjelasan: 'Akar kuadrat adalah kebalikan dari kuadrat. √25 = 5 karena 5 × 5 = 25.',
    penjelasanUlang: 'Cari bilangan yang jika dikalikan dengan dirinya menjadi 25: bilangan itu 5.',
    contoh: '√9 = 3, √16 = 4, √81 = 9',
  },
  {
    id: 'segitiga',
    judul: 'Segitiga siku-siku',
    penjelasan:
      'Segitiga siku-siku punya satu sudut 90° yang ditandai kotak kecil.',
    penjelasanUlang: 'Kotak kecil pada gambar menandai satu sudut yang besarnya 90°.',
  },
];

export type SoalCepatPrasyarat = {
  id: 'kuadrat' | 'akar' | 'segitiga';
  jenis: 'angka' | 'segitiga';
  pertanyaan: string;
  jawaban?: number;
  jawabanPilihan?: string;
  pilihan?: { id: string; label: string; sikuSiku: boolean }[];
  penjelasanBenar: string;
  petunjuk: [string, string, string];
  kesalahanUmum?: { jawaban: number; penjelasan: string }[];
  penjelasanSalah: string;
};

export const soalCepatPrasyarat: SoalCepatPrasyarat[] = [
  {
    id: 'kuadrat',
    jenis: 'angka',
    pertanyaan: '7² = ?',
    jawaban: 49,
    penjelasanBenar: 'Tepat! 7² = 7 × 7 = 49.',
    petunjuk: [
      'Kuadrat berarti suatu bilangan dikalikan dengan dirinya sendiri.',
      'Tuliskan 7² sebagai 7 × 7.',
      'Hitung 7 × 7.',
    ],
    kesalahanUmum: [
      {
        jawaban: 14,
        penjelasan: '7² bukan 7 × 2, tetapi 7 × 7. Jadi, 7² = 49.',
      },
    ],
    penjelasanSalah: 'Kuadratkan 7 dengan mengalikan 7 dengan dirinya sendiri.',
  },
  {
    id: 'akar',
    jenis: 'angka',
    pertanyaan: '√81 = ?',
    jawaban: 9,
    penjelasanBenar: 'Tepat! 9 × 9 = 81, jadi √81 = 9.',
    petunjuk: [
      'Cari bilangan yang jika dikalikan dengan dirinya sendiri hasilnya 81.',
      'Coba 9 × 9.',
      'Karena 9 × 9 = 81, maka √81 = 9.',
    ],
    kesalahanUmum: [
      {
        jawaban: 40.5,
        penjelasan: 'Akar kuadrat bukan dibagi 2. Cari bilangan yang kuadratnya 81.',
      },
    ],
    penjelasanSalah:
      'Akar kuadrat mencari bilangan yang jika dikuadratkan menghasilkan 81.',
  },
  {
    id: 'segitiga',
    jenis: 'segitiga',
    pertanyaan: 'Pilih segitiga yang memiliki sudut siku-siku.',
    jawabanPilihan: 'siku-siku',
    penjelasanBenar: 'Benar! Tanda kotak kecil menunjukkan sudut 90°.',
    pilihan: [
      { id: 'siku-siku', label: 'Segitiga A', sikuSiku: true },
      { id: 'bukan-siku-siku', label: 'Segitiga B', sikuSiku: false },
    ],
    petunjuk: [
      'Sudut siku-siku besarnya 90°.',
      'Cari sudut yang kedua sisinya bertemu seperti sudut pojok buku.',
      'Pada gambar yang benar, sudut itu ditandai kotak kecil.',
    ],
    penjelasanSalah:
      'Segitiga siku-siku memiliki satu sudut 90°. Pilih gambar dengan tanda kotak kecil.',
  },
];
