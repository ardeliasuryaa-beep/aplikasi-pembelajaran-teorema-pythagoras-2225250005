# PRD: Aplikasi Web Pembelajaran Teorema Pythagoras Berbasis Pengurangan Cognitive Load

## 1. Latar belakang
Hasil wawancara siswa (S01, kelas IX, mempelajari materi di kelas VIII) menunjukkan bahwa siswa mengingat rumus `a² + b² = c²`, tetapi kesulitan pada proses **sebelum dan sesudah** menghitung: mengenali sisi miring, memilah informasi soal cerita, memilih rumus, dan memeriksa kewajaran jawaban. Analisis memakai kerangka Cognitive Load (Intrinsic, Extraneous, Germane).

## 2. Tujuan
**Tujuan umum:** mengatasi cognitive load siswa agar kemampuan literasi matematikanya baik.

**Tujuan khusus.** Siswa dapat:
1. Mengenali sisi miring pada segitiga siku-siku dalam berbagai posisi.
2. **Merumuskan** situasi: menentukan yang diketahui dan ditanyakan, membuat sketsa, dan memilih rumus.
3. **Menggunakan** konsep dan prosedur Pythagoras dengan benar (mencari sisi miring maupun sisi tegak/alas).
4. **Menafsirkan dan mengevaluasi** hasil: memeriksa kewajaran dan menyatakan jawaban dalam konteks.

## 3. Platform dan pengguna
- **Aplikasi web**, dibuka lewat link di browser smartphone maupun laptop. Tanpa instalasi, tanpa akun.
- Pengguna: siswa SMP kelas VIII-IX (belajar mandiri atau pendamping di kelas) dan guru/dosen untuk uji coba.
- Catatan: wawancara menyebut "aplikasi Android" (DS01). Kebutuhan itu dipenuhi dengan web yang ramah layar HP (mobile-first).

## 4. Kerangka literasi matematika
Mengacu pada tiga proses literasi matematika (kerangka PISA):

| Proses | Arti dalam aplikasi | Fitur |
|--------|---------------------|-------|
| **Merumuskan** | Mengubah situasi/cerita menjadi model matematika | F1, F4, F2 (langkah 1-3) |
| **Menggunakan** | Menerapkan konsep, fakta, dan prosedur | F2 (langkah 4), F3, F7 |
| **Menafsirkan dan mengevaluasi** | Menilai kewajaran dan memaknai hasil dalam konteks | F8, F11, F12 |

Konteks soal dibuat dekat dengan siswa (tangga bersandar di dinding, layang-layang, jalan pintas di lapangan, diagonal layar, tiang bendera).

## 5. Fitur dan dasar temuan wawancara

| No | Fitur | Dasar temuan | Kode | Beban yang dikelola |
|----|-------|--------------|------|----------------------|
| F1 | **Segitiga interaktif 3D**: objek ungu dapat diputar dengan mouse atau sentuhan, di-zoom, dan diatur ulang; menampilkan label sisi, penanda sudut siku-siku, serta mendukung ketukan sisi. Animasi awal yang lembut berhenti saat siswa berinteraksi. | Bingung menentukan sisi miring saat gambar diputar | IL01, DS01 | Intrinsic |
| F2 | **Penyelesaian bertahap**: (1) cari sudut siku-siku, (2) tandai diketahui dan ditanyakan, (3) pilih rumus, (4) hitung. Satu langkah per layar. | Harus memperhatikan banyak hal sekaligus | IL02, IL05, DS02 | Intrinsic |
| F3 | **Pengingat prasyarat**: tiga kartu satu per layar (kuadrat, akar kuadrat, segitiga siku-siku), lalu tiga soal cepat dengan petunjuk bertingkat dan umpan balik kesalahan umum. Ringkasan mengarahkan siswa mengulang kartu yang relevan atau lanjut ke Kenali Sisi. | Prasyarat memengaruhi pemahaman | IL03 | Intrinsic |
| F4 | **Penanda "Diketahui" dan "Ditanyakan"** pada soal cerita, plus langkah menjadikan cerita sebuah sketsa segitiga. | Soal cerita panjang membingungkan | IL04, EL01, EL05 | Extraneous |
| F5 | **Teks, gambar, dan keterangan sisi dalam satu tampilan** yang berdekatan. | Gambar dan penjelasan berjauhan | EL02 | Extraneous |
| F6 | **Navigasi per langkah**: Kembali, Ulangi penjelasan, Lanjut. | Penjelasan terlalu cepat | EL04 | Extraneous |
| F7 | **Contoh soal berjenjang** yang menghubungkan gambar, rumus, dan hitungan. | Contoh bertahap membantu | GL01 | Germane |
| F8 | **Pertanyaan refleksi**: "Mengapa ini sisi miring?", "Apakah hasilnya masuk akal?" | Siswa memeriksa kewajaran jawaban | GL02 | Germane |
| F9 | **Petunjuk bertingkat** (3 level) dan **umpan balik penjelas** saat salah; petunjuk berkurang di latihan mandiri. | Butuh petunjuk sedikit demi sedikit | GL03, DS02 | Germane |
| F10 | **Ringkasan langkah oleh siswa** (menyusun urutan langkah) setelah latihan. | Menjelaskan ulang membantu mengingat | GL04 | Germane |
| F11 | **Variasi soal konteks** dengan cerita berbeda untuk melatih transfer konsep. | Mengenali struktur matematika yang sama | GL05 | Germane |
| F12 | **Kalimat jawaban dalam konteks**: siswa menulis jawaban dengan satuan dan makna (contoh: "Tangga harus setidaknya 2,5 m"). | Memaknai hasil sesuai situasi | (literasi) | Germane |
| F13 | **Tampilan sederhana**: sedikit warna, tanpa animasi dekoratif berulang, tidak banyak teks per halaman. Rotasi awal objek 3D bersifat lembut dan berhenti saat siswa berinteraksi. | Warna/animasi mengalihkan perhatian | EL03, DS03 | Extraneous |
| F14 | **Lintasan dan ringkasan progres**: kegiatan selesai tersimpan di perangkat dan ditandai di Beranda. | Memudahkan siswa melihat langkah berikutnya | (navigasi) | Germane |
| F15 | **Sapaan personal** dengan nama panggilan, disimpan hanya di perangkat melalui `localStorage` dengan fallback memori. | Membuat pengalaman belajar terasa personal | (personalisasi) | Extraneous |
| F16 | **Umpan balik suara opsional**: bunyi tap, benar, salah, dan selesai dapat dimatikan. | Memberi isyarat singkat tanpa menggantikan penjelasan | (aksesibilitas) | Extraneous |
| F17 | **Tema visual ungu-peach-navy**: latar utama bergradasi halus dari Soft Lavender `#C9B5E0` melalui stop transisi ke peach `#F2DACE`; Medium Purple/Blue dan Dark Navy diterapkan konsisten di semua layar, dengan kartu glassmorphism, progress bergradasi, ikon modul SVG kustom, dan visualisasi 3D yang jelas saat diputar. | Konsistensi visual membantu orientasi tanpa menambah beban | EL03, DS03 | Extraneous |

## 6. Alur penggunaan
1. **Beranda** memiliki tiga keadaan. Pertama, siswa menyimpan nama panggilan (maksimal 20 karakter; hanya huruf dan spasi). Kedua, siswa melihat sapaan personal dan menekan "Mulai belajar". Ketiga, ringkasan kemajuan dan lintasan empat kegiatan ditampilkan; kartu bebas dibuka, nama bisa diganti, dan tombol Lanjutkan belajar membuka kegiatan pertama yang belum selesai. Nama, status Mulai belajar, dan progres disimpan hanya di perangkat dengan fallback memori bila `localStorage` gagal.
2. **Prasyarat**: tiga kartu pengingat (kuadrat dengan petak persegi, akar kuadrat, dan segitiga siku-siku) ditampilkan satu per layar dengan navigasi Kembali/Ulangi penjelasan/Lanjut. Setelahnya, siswa menjawab tiga soal cepat: kuadrat, akar kuadrat, dan memilih gambar segitiga siku-siku. Setiap soal memiliki tiga petunjuk bertahap, alasan khusus untuk kesalahan umum, dan kesempatan mencoba lagi. Ringkasan menyebut jumlah jawaban benar, menawarkan kartu kuadrat/akar yang perlu diulang, lalu mengarahkan ke Kenali Sisi. Prasyarat ditandai selesai setelah soal ketiga dijawab benar.
3. **Kenali Sisi**: segitiga siku-siku 3D dalam berbagai orientasi; siswa dapat memutar, memperbesar, memperkecil, mengatur ulang, dan mengetuk sisi miring untuk mendapat umpan balik. Jika WebGL tidak tersedia, gambar SVG tetap digunakan.
4. **Belajar**: contoh soal berjenjang, satu langkah per layar.
5. **Latihan**: soal level 1-4 dengan petunjuk bertingkat. Refleksi berisi satu opsi benar dan dua pengecoh yang diacak per soal; tiap pilihan memiliki umpan balik, dan jawaban benar membuka tombol Lanjut. Soal Level 4 juga meminta penandaan Diketahui/Ditanyakan dan pemilihan kalimat jawaban bersatuan.
6. **Ringkasan**: skor per proses literasi (merumuskan, menggunakan, menafsirkan), bagian yang perlu diulang, dan susunan langkah buatan siswa.
7. **Suara**: tombol di Beranda dan setiap kegiatan mengaktifkan atau mematikan bunyi Web Audio; preferensi disimpan secara lokal.

## 7. Jenjang soal
- **Level 1**: cari sisi miring, angka bulat sederhana (3-4-5, 6-8-10, 5-12-13), dengan gambar.
- **Level 2**: cari sisi tegak atau alas (ada langkah mengurangi kuadrat), dengan gambar.
- **Level 3**: hasil akar bukan bilangan bulat (tampilkan bentuk akar dan perkiraan desimal), dengan gambar.
- **Level 4**: soal konteks/cerita. Siswa menandai diketahui/ditanyakan, membuat sketsa, memilih rumus, menghitung, memeriksa kewajaran, dan menulis kalimat jawaban.

## 8. Model data soal
```ts
type Soal = {
  id: string;
  level: 1 | 2 | 3 | 4;
  konteks?: string;                // cerita, hanya level 4
  satuan?: string;                 // contoh: "m", "cm"
  sisi: { alas: number | null; tegak: number | null; miring: number | null };
  yangDicari: 'alas' | 'tegak' | 'miring';
  orientasi: 0 | 90 | 180 | 270;
  cermin?: boolean;
  jawaban: number;                 // boleh desimal
  toleransi?: number;              // untuk pembulatan
  petunjuk: [string, string, string];
  penjelasanSalah: { kesalahanUmum: string; penjelasan: string }[];
  refleksi?: {
    pertanyaan: string;
    jawabanBenar: string;          // id opsi benar
    pilihan: { id: string; teks: string; umpanBalik: string }[]; // 1 benar + 2 pengecoh
  };
  kalimatJawabanContoh?: string;   // level 4
  kalimatUntukDitandai?: { teks: string; label: 'Diketahui' | 'Ditanyakan' }[];
  pilihanKalimatJawaban?: string[];
};
```

## 9. Kebutuhan non-fungsional
- Berjalan di browser modern (Chrome, Safari, Edge) pada layar HP dan desktop.
- Tanpa login dan tanpa backend. Dapat dipakai setelah halaman termuat.
- Ringan dan responsif; ketukan merespons cepat.
- Font Poppins (judul, tombol, rumus, label) dan Nunito (isi) dimuat sebelum layar tampil; sediakan `system-ui` sebagai fallback.
- Progres kegiatan dan pilihan suara disimpan lokal dengan fallback memori bila `localStorage` tidak tersedia.
- Bunyi memakai Web Audio API tanpa berkas audio atau pustaka suara tambahan; konteks audio dibuat hanya setelah interaksi pengguna.
- Pindah langkah tidak membuat siswa kehilangan konteks soal.

## 10. Di luar cakupan (versi ini)
Login/akun, database online, leaderboard, berkas audio, video, multi-bahasa, aplikasi native (APK), materi di luar Pythagoras.

## 11. Cara menguji (dari matriks analisis)
- Siswa menunjuk sisi miring pada beberapa gambar dengan posisi berbeda dan menjelaskan alasannya.
- Siswa mengerjakan soal cerita dan diamati apakah bisa menemukan informasi penting dan membuat sketsa tanpa petunjuk langsung.
- Dicatat jumlah petunjuk yang dibutuhkan di latihan awal dibanding latihan akhir.
- Siswa menjelaskan hubungan gambar, informasi yang diketahui, dan rumus.
- Siswa menilai kemudahan menghubungkan teks dan gambar serta kenyamanan tampilan.

## 12. Kriteria berhasil (draf)
- Siswa menunjuk sisi miring dengan benar pada semua orientasi.
- Kebutuhan petunjuk menurun dari latihan awal ke latihan berikutnya.
- Siswa mampu menuntaskan tiga proses literasi (merumuskan, menggunakan, menafsirkan) pada soal Level 4.
- Siswa menyatakan tampilan tidak membingungkan.

## 13. Catatan metodologis
Data wawancara bersifat simulasi. Untuk laporan penelitian sebenarnya, kode IL/EL/GL dan interpretasi ditetapkan dari kutipan wawancara nyata, artefak, dan/atau observasi.