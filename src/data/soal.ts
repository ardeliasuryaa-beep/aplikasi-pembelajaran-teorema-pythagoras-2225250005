import type { NamaSisi } from '@/components/SegitigaSiku';

export type LevelSoal = 1 | 2 | 3 | 4;
export type LabelInformasi = 'Diketahui' | 'Ditanyakan';
export type PilihanRefleksi = { id: string; teks: string; umpanBalik: string };

export type Soal = {
  id: string;
  level: LevelSoal;
  konteks?: string;
  satuan?: string;
  sisi: Record<NamaSisi, number | null>;
  yangDicari: NamaSisi;
  orientasi: 0 | 90 | 180 | 270;
  cermin?: boolean;
  jawaban: number;
  toleransi?: number;
  petunjuk: [string, string, string];
  penjelasanSalah: {
    kesalahanUmum: string;
    penjelasan: string;
    jawabanKeliru?: number;
  }[];
  refleksi?: {
    pertanyaan: string;
    jawabanBenar: string;
    pilihan: PilihanRefleksi[];
  };
  kalimatJawabanContoh?: string;
  kalimatUntukDitandai?: { teks: string; label: LabelInformasi }[];
  pilihanKalimatJawaban?: string[];
};

export const soal: Soal[] = [
  {
    id: 'l1-miring-3-4',
    level: 1,
    satuan: 'cm',
    sisi: { alas: 3, tegak: 4, miring: null },
    yangDicari: 'miring',
    orientasi: 0,
    jawaban: 5,
    petunjuk: [
      'Sisi miring berada di depan tanda sudut siku-siku.',
      'Gunakan c² = a² + b².',
      'Hitung c = √(3² + 4²).',
    ],
    penjelasanSalah: [
      {
        kesalahanUmum: 'Menjumlahkan panjang sisi biasa',
        penjelasan: 'Jangan menjumlahkan 3 + 4. Kuadratkan kedua sisi dahulu, lalu ambil akar kuadrat jumlahnya.',
        jawabanKeliru: 7,
      },
      {
        kesalahanUmum: 'Berhenti pada nilai kuadrat sisi miring',
        penjelasan: 'Nilai 25 adalah c², bukan panjang c. Ambil akar kuadrat 25 sehingga panjangnya 5 cm.',
        jawabanKeliru: 25,
      },
    ],
    refleksi: {
      pertanyaan: 'Apakah hasilnya masuk akal?',
      jawabanBenar: 'benar',
      pilihan: [
        {
          id: 'benar',
          teks: 'Ya, 5 cm lebih panjang dari 3 cm dan 4 cm, tetapi lebih pendek dari jumlahnya, 7 cm.',
          umpanBalik: 'Tepat. Sisi miring lebih panjang dari kedua sisi siku-siku, tetapi tidak harus sepanjang jumlah keduanya.',
        },
        {
          id: 'jumlah',
          teks: 'Tidak, panjangnya 7 cm karena 3 cm + 4 cm = 7 cm.',
          umpanBalik: 'Menjumlahkan kedua panjang langsung bukan cara mencari sisi miring; gunakan jumlah kuadratnya lalu ambil akar.',
        },
        {
          id: 'harus-lebih-panjang',
          teks: 'Tidak, 5 cm terlalu pendek karena sisi miring harus lebih panjang dari jumlah kedua sisi.',
          umpanBalik: 'Sisi miring harus lebih panjang dari masing-masing sisi siku-siku, bukan dari jumlah keduanya.',
        },
      ],
    },
  },
  {
    id: 'l1-miring-5-12',
    level: 1,
    satuan: 'cm',
    sisi: { alas: 5, tegak: 12, miring: null },
    yangDicari: 'miring',
    orientasi: 90,
    jawaban: 13,
    petunjuk: [
      'Cari sisi yang berhadapan dengan tanda sudut siku-siku.',
      'Gunakan c² = a² + b².',
      'Hitung c = √(5² + 12²).',
    ],
    penjelasanSalah: [
      {
        kesalahanUmum: 'Menjumlahkan panjang sisi biasa',
        penjelasan: 'Sisi miring bukan 5 + 12. Jumlahkan kuadrat kedua sisi, lalu ambil akar kuadratnya.',
        jawabanKeliru: 17,
      },
      {
        kesalahanUmum: 'Berhenti pada nilai kuadrat sisi miring',
        penjelasan: 'Nilai 169 adalah c². Panjang sisi miring adalah √169, yaitu 13 cm.',
        jawabanKeliru: 169,
      },
    ],
    refleksi: {
      pertanyaan: 'Apakah hasilnya masuk akal?',
      jawabanBenar: 'benar',
      pilihan: [
        {
          id: 'benar',
          teks: 'Ya, 13 cm lebih panjang dari 5 cm dan 12 cm, tetapi lebih pendek dari jumlahnya, 17 cm.',
          umpanBalik: 'Tepat. Sisi miring lebih panjang dari kedua sisi siku-siku, tetapi lebih pendek dari jumlah keduanya.',
        },
        {
          id: 'jumlah',
          teks: 'Tidak, panjangnya 17 cm karena 5 cm + 12 cm = 17 cm.',
          umpanBalik: 'Menjumlahkan kedua panjang langsung bukan cara mencari sisi miring; gunakan jumlah kuadratnya lalu ambil akar.',
        },
        {
          id: 'miring-pendek',
          teks: 'Tidak, 13 cm tidak masuk akal karena sisi miring harus lebih pendek dari sisi lainnya.',
          umpanBalik: 'Sisi miring justru menjadi sisi terpanjang dalam segitiga siku-siku.',
        },
      ],
    },
  },
  {
    id: 'l2-tegak-5-13',
    level: 2,
    satuan: 'cm',
    sisi: { alas: 5, tegak: null, miring: 13 },
    yangDicari: 'tegak',
    orientasi: 180,
    jawaban: 12,
    petunjuk: [
      'Sisi miring adalah sisi di depan tanda siku-siku.',
      'Untuk mencari sisi tegak, gunakan b² = c² − a².',
      'Hitung b = √(13² − 5²).',
    ],
    penjelasanSalah: [
      {
        kesalahanUmum: 'Menjumlahkan kuadrat, bukan mengurangkannya',
        penjelasan: 'Karena yang dicari sisi siku-siku, kurangi kuadrat sisi yang diketahui dari kuadrat sisi miring.',
        jawabanKeliru: Math.sqrt(194),
      },
      {
        kesalahanUmum: 'Mengurangi panjang tanpa menguadratkan',
        penjelasan: 'Jangan menghitung 13 − 5. Kuadratkan kedua panjang dahulu, kurangi, lalu ambil akarnya.',
        jawabanKeliru: 8,
      },
      {
        kesalahanUmum: 'Berhenti pada nilai kuadrat sisi yang dicari',
        penjelasan: 'Hasil pengurangan 144 adalah b². Panjang b adalah √144, yaitu 12 cm.',
        jawabanKeliru: 144,
      },
    ],
    refleksi: {
      pertanyaan: 'Apakah hasilnya masuk akal?',
      jawabanBenar: 'benar',
      pilihan: [
        {
          id: 'benar',
          teks: 'Ya, 12 cm lebih panjang dari 5 cm dan lebih pendek dari sisi miring 13 cm.',
          umpanBalik: 'Tepat. Sisi siku-siku yang dicari lebih pendek dari sisi miring.',
        },
        {
          id: 'jumlah',
          teks: 'Tidak, panjangnya sekitar 18 cm karena 13² + 5² = 194.',
          umpanBalik: 'Untuk mencari sisi siku-siku, kurangi kuadrat sisi yang diketahui dari kuadrat sisi miring.',
        },
        {
          id: 'selisih-langsung',
          teks: 'Tidak, panjangnya 8 cm karena 13 cm − 5 cm = 8 cm.',
          umpanBalik: 'Panjang sisi tidak diperoleh dengan mengurangi langsung; kuadratkan dulu, kurangi, lalu ambil akar.',
        },
      ],
    },
  },
  {
    id: 'l2-alas-8-10',
    level: 2,
    satuan: 'cm',
    sisi: { alas: null, tegak: 8, miring: 10 },
    yangDicari: 'alas',
    orientasi: 270,
    jawaban: 6,
    petunjuk: [
      'Sisi yang dicari bertemu dengan tanda sudut siku-siku.',
      'Gunakan a² = c² − b².',
      'Hitung a = √(10² − 8²).',
    ],
    penjelasanSalah: [
      {
        kesalahanUmum: 'Menjumlahkan kuadrat, bukan mengurangkannya',
        penjelasan: 'Untuk mencari sisi siku-siku, kurangi kuadrat sisi tegak dari kuadrat sisi miring.',
        jawabanKeliru: Math.sqrt(164),
      },
      {
        kesalahanUmum: 'Mengurangi panjang tanpa menguadratkan',
        penjelasan: 'Jangan menghitung 10 − 8 saja. Kuadratkan, kurangi, lalu ambil akar kuadratnya.',
        jawabanKeliru: 2,
      },
      {
        kesalahanUmum: 'Berhenti pada nilai kuadrat sisi yang dicari',
        penjelasan: 'Hasil 36 adalah a². Panjang a adalah √36, yaitu 6 cm.',
        jawabanKeliru: 36,
      },
    ],
    refleksi: {
      pertanyaan: 'Apakah hasilnya masuk akal?',
      jawabanBenar: 'benar',
      pilihan: [
        {
          id: 'benar',
          teks: 'Ya, 6 cm lebih pendek dari sisi miring 10 cm dan lebih pendek dari sisi tegak 8 cm.',
          umpanBalik: 'Tepat. Kedua sisi siku-siku lebih pendek daripada sisi miring.',
        },
        {
          id: 'jumlah',
          teks: 'Tidak, panjangnya sekitar 16 cm karena 10² + 8² = 164.',
          umpanBalik: 'Untuk mencari sisi siku-siku, kurangi kuadrat sisi lainnya dari kuadrat sisi miring.',
        },
        {
          id: 'selisih-langsung',
          teks: 'Tidak, panjangnya 2 cm karena 10 cm − 8 cm = 2 cm.',
          umpanBalik: 'Panjang sisi tidak diperoleh dengan mengurangi langsung; kuadratkan dulu, kurangi, lalu ambil akar.',
        },
      ],
    },
  },
  {
    id: 'l3-miring-4-5',
    level: 3,
    satuan: 'cm',
    sisi: { alas: 4, tegak: 5, miring: null },
    yangDicari: 'miring',
    orientasi: 0,
    jawaban: Math.sqrt(41),
    toleransi: 0.005,
    petunjuk: [
      'Sisi miring berhadapan dengan tanda siku-siku.',
      'Gunakan c² = a² + b², lalu nyatakan hasil sebagai desimal.',
      '√41 kira-kira 6,40. Bulatkan jawaban ke dua angka desimal.',
    ],
    penjelasanSalah: [
      {
        kesalahanUmum: 'Menjumlahkan panjang sisi biasa',
        penjelasan: 'Jangan menjumlahkan 4 + 5. Hitung √(4² + 5²), lalu bulatkan hasilnya ke dua angka desimal.',
        jawabanKeliru: 9,
      },
      {
        kesalahanUmum: 'Menuliskan kuadrat tanpa mengambil akar',
        penjelasan: '41 adalah c². Panjang sisi adalah √41, kira-kira 6,40 cm.',
        jawabanKeliru: 41,
      },
    ],
    refleksi: {
      pertanyaan: 'Apakah hasilnya masuk akal?',
      jawabanBenar: 'benar',
      pilihan: [
        {
          id: 'benar',
          teks: 'Ya, sekitar 6,40 cm lebih panjang dari 4 cm dan 5 cm, tetapi lebih pendek dari 9 cm.',
          umpanBalik: 'Tepat. Sisi miring lebih panjang dari kedua sisi siku-siku, tetapi tidak sepanjang jumlahnya.',
        },
        {
          id: 'jumlah',
          teks: 'Tidak, panjangnya 9 cm karena 4 cm + 5 cm = 9 cm.',
          umpanBalik: 'Menjumlahkan panjang langsung tidak menghasilkan sisi miring; jumlahkan kuadratnya lalu ambil akar.',
        },
        {
          id: 'miring-pendek',
          teks: 'Tidak, 6,40 cm terlalu pendek karena sisi miring harus lebih pendek dari kedua sisi.',
          umpanBalik: 'Sisi miring adalah sisi terpanjang pada segitiga siku-siku.',
        },
      ],
    },
  },
  {
    id: 'l3-miring-5-7',
    level: 3,
    satuan: 'cm',
    sisi: { alas: 5, tegak: 7, miring: null },
    yangDicari: 'miring',
    orientasi: 90,
    jawaban: Math.sqrt(74),
    toleransi: 0.005,
    petunjuk: [
      'Sisi miring berhadapan dengan tanda siku-siku.',
      'Gunakan c² = a² + b².',
      '√74 kira-kira 8,60. Bulatkan jawaban ke dua angka desimal.',
    ],
    penjelasanSalah: [
      {
        kesalahanUmum: 'Menjumlahkan panjang sisi biasa',
        penjelasan: 'Jangan menjumlahkan 5 + 7. Kuadratkan panjangnya dahulu, lalu ambil akar dari jumlah kuadrat.',
        jawabanKeliru: 12,
      },
      {
        kesalahanUmum: 'Menuliskan kuadrat tanpa mengambil akar',
        penjelasan: '74 adalah c², bukan panjang sisi. Panjangnya √74, kira-kira 8,60 cm.',
        jawabanKeliru: 74,
      },
    ],
    refleksi: {
      pertanyaan: 'Apakah hasilnya masuk akal?',
      jawabanBenar: 'benar',
      pilihan: [
        {
          id: 'benar',
          teks: 'Ya, sekitar 8,60 cm lebih panjang dari 5 cm dan 7 cm, tetapi lebih pendek dari 12 cm.',
          umpanBalik: 'Tepat. Sisi miring lebih panjang dari setiap sisi siku-siku, tetapi tidak sepanjang jumlahnya.',
        },
        {
          id: 'jumlah',
          teks: 'Tidak, panjangnya 12 cm karena 5 cm + 7 cm = 12 cm.',
          umpanBalik: 'Menjumlahkan panjang langsung tidak menghasilkan sisi miring; jumlahkan kuadratnya lalu ambil akar.',
        },
        {
          id: 'miring-pendek',
          teks: 'Tidak, 8,60 cm tidak masuk akal karena sisi miring harus lebih pendek dari sisi lainnya.',
          umpanBalik: 'Sisi miring justru menjadi sisi terpanjang dalam segitiga siku-siku.',
        },
      ],
    },
  },
  {
    id: 'l4-tangga',
    level: 4,
    konteks: 'Sebuah tangga bersandar pada dinding. Kaki tangga berjarak 2,4 m dari dinding dan ujungnya mencapai ketinggian 3,2 m.',
    satuan: 'm',
    sisi: { alas: 2.4, tegak: 3.2, miring: null },
    yangDicari: 'miring',
    orientasi: 0,
    jawaban: 4,
    petunjuk: [
      'Tandai jarak kaki tangga dan tinggi ujung tangga sebagai informasi diketahui.',
      'Panjang tangga adalah sisi di depan sudut siku-siku.',
      'Hitung panjang tangga dengan √(2,4² + 3,2²).',
    ],
    penjelasanSalah: [
      {
        kesalahanUmum: 'Menjumlahkan jarak dan tinggi',
        penjelasan: 'Panjang tangga bukan 2,4 + 3,2. Gunakan Teorema Pythagoras: jumlahkan kuadratnya lalu ambil akar.',
        jawabanKeliru: 5.6,
      },
      {
        kesalahanUmum: 'Mengurangi kuadrat sisi siku-siku',
        penjelasan: 'Tangga adalah sisi miring, jadi kuadrat kedua jarak dijumlahkan, bukan dikurangkan.',
        jawabanKeliru: Math.sqrt(4),
      },
    ],
    refleksi: {
      pertanyaan: 'Apakah hasilnya masuk akal?',
      jawabanBenar: 'benar',
      pilihan: [
        {
          id: 'benar',
          teks: 'Ya, tangga 4 m lebih panjang dari 2,4 m dan 3,2 m, tetapi lebih pendek dari jumlahnya, 5,6 m.',
          umpanBalik: 'Tepat. Panjang tangga adalah sisi miring: lebih panjang dari jarak mendatar dan tinggi dinding.',
        },
        {
          id: 'jumlah',
          teks: 'Tidak, tangga harus 5,6 m karena jarak 2,4 m dan tinggi 3,2 m dijumlahkan.',
          umpanBalik: 'Jarak dan tinggi membentuk sisi siku-siku; panjang tangga dicari dengan Teorema Pythagoras.',
        },
        {
          id: 'miring-pendek',
          teks: 'Tidak, tangga 4 m terlalu pendek karena sisi miring harus lebih pendek dari kedua sisi.',
          umpanBalik: 'Sisi miring berhadapan dengan sudut siku-siku dan menjadi sisi terpanjang.',
        },
      ],
    },
    kalimatJawabanContoh: 'Panjang tangga yang diperlukan adalah 4 m.',
    kalimatUntukDitandai: [
      { teks: 'Kaki tangga berjarak 2,4 m dari dinding.', label: 'Diketahui' },
      { teks: 'Ujung tangga mencapai ketinggian 3,2 m.', label: 'Diketahui' },
      { teks: 'Tentukan panjang tangga yang diperlukan.', label: 'Ditanyakan' },
    ],
    pilihanKalimatJawaban: [
      'Panjang tangga yang diperlukan adalah 4 m.',
      'Jarak kaki tangga dari dinding adalah 4 m.',
      'Tinggi ujung tangga pada dinding adalah 4 m.',
    ],
  },
  {
    id: 'l4-lapangan',
    level: 4,
    konteks: 'Sebuah lapangan berbentuk persegi panjang memiliki panjang 9 m dan lebar 12 m. Rani berjalan lurus secara diagonal melintasi lapangan.',
    satuan: 'm',
    sisi: { alas: 9, tegak: 12, miring: null },
    yangDicari: 'miring',
    orientasi: 180,
    jawaban: 15,
    petunjuk: [
      'Panjang dan lebar lapangan membentuk sudut siku-siku.',
      'Jalur diagonal adalah sisi yang berhadapan dengan sudut siku-siku.',
      'Hitung √(9² + 12²) untuk menemukan panjang jalur.',
    ],
    penjelasanSalah: [
      {
        kesalahanUmum: 'Menjumlahkan panjang dan lebar biasa',
        penjelasan: 'Jalur diagonal bukan 9 + 12. Kuadratkan panjang dan lebar, jumlahkan, lalu ambil akarnya.',
        jawabanKeliru: 21,
      },
      {
        kesalahanUmum: 'Menuliskan kuadrat tanpa mengambil akar',
        penjelasan: '225 adalah kuadrat panjang diagonal. Panjang diagonalnya √225, yaitu 15 m.',
        jawabanKeliru: 225,
      },
    ],
    refleksi: {
      pertanyaan: 'Apakah hasilnya masuk akal?',
      jawabanBenar: 'benar',
      pilihan: [
        {
          id: 'benar',
          teks: 'Ya, diagonal 15 m lebih panjang dari 9 m dan 12 m, tetapi lebih pendek dari jumlahnya, 21 m.',
          umpanBalik: 'Tepat. Diagonal menjadi sisi miring, sehingga lebih panjang dari panjang dan lebar lapangan.',
        },
        {
          id: 'jumlah',
          teks: 'Tidak, diagonalnya 21 m karena panjang 9 m dan lebar 12 m dijumlahkan.',
          umpanBalik: 'Diagonal bukan hasil penjumlahan panjang dan lebar; gunakan jumlah kuadratnya lalu ambil akar.',
        },
        {
          id: 'miring-pendek',
          teks: 'Tidak, 15 m terlalu pendek karena diagonal harus lebih pendek dari panjang dan lebar.',
          umpanBalik: 'Diagonal menjadi sisi miring dan harus lebih panjang daripada kedua sisi pembentuk sudut siku-siku.',
        },
      ],
    },
    kalimatJawabanContoh: 'Panjang jalan diagonal yang dilalui Rani adalah 15 m.',
    kalimatUntukDitandai: [
      { teks: 'Panjang lapangan adalah 9 m.', label: 'Diketahui' },
      { teks: 'Lebar lapangan adalah 12 m.', label: 'Diketahui' },
      { teks: 'Tentukan panjang jalur diagonal yang dilalui Rani.', label: 'Ditanyakan' },
    ],
    pilihanKalimatJawaban: [
      'Panjang jalan diagonal yang dilalui Rani adalah 15 m.',
      'Panjang lapangan yang dilalui Rani adalah 15 m.',
      'Lebar lapangan yang dilalui Rani adalah 15 m.',
    ],
  },
];
