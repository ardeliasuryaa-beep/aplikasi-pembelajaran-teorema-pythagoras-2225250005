# CLAUDE.md

Panduan untuk Claude Code di proyek ini. Baca juga `PRD.md` (apa yang dibuat) dan `DESAIN.md` (tampilan) sebelum menulis kode.

## Ringkasan proyek
Aplikasi **web** pembelajaran **Teorema Pythagoras** untuk siswa SMP (kelas VIII-IX), dapat dibuka di **browser laptop maupun smartphone** lewat satu link.
Tujuan: **mengurangi cognitive load** siswa (Intrinsic, Extraneous, Germane) agar **kemampuan literasi matematikanya** meningkat, yaitu merumuskan situasi secara matematis, menggunakan konsep dan prosedur, serta menafsirkan dan mengevaluasi hasil.
Dasar rancangan: hasil wawancara siswa (S01, simulasi) pada tahap Analysis model ADDIE. Proyek ini bagian dari tugas mahasiswa S1 Pendidikan Matematika.

## Tech stack
- Expo (React Native) dengan **Expo Router**, TypeScript, dijalankan sebagai **web** (react-native-web)
- Folder kode di `src/app` (jangan dipindahkan ke root)
- Visualisasi segitiga memakai Three.js di web dengan SVG sebagai fallback saat WebGL tidak tersedia
- Tanpa backend, tanpa login. Data soal dan materi disimpan lokal di `src/data/`
- Font Poppins dan Nunito dimuat dengan `expo-font` sebelum layar tampil
- Bunyi umpan balik dibuat dengan Web Audio API; tidak memakai berkas audio atau pustaka suara tambahan
- Target utama: **browser mobile (layar sempit, sekitar 360-430 px)**, lalu desktop
- Paket web yang diperlukan:
  ```
  npx expo install react-dom react-native-web @expo/metro-runtime react-native-svg
  ```
- Di `app.json`, set `"web": { "bundler": "metro", "output": "single" }` agar mudah dihosting statis.

## Struktur folder
```
src/
  app/            # layar (Expo Router)
  components/     # SegitigaSiku, teks, tombol bersama, dan umpan balik
  data/           # soal.ts, materi.ts (data statis)
  utils/          # fungsi hitung & validasi jawaban
  theme.ts        # warna, ukuran font, jarak (satu sumber)
```

## Aturan penulisan kode
- Semua teks untuk siswa memakai **Bahasa Indonesia** yang sederhana.
- Komponen fungsional dan hooks. Hindari library tambahan kecuali perlu.
- Warna, font, jarak, dan parameter visual 3D **hanya** dari `src/theme.ts`. Latar utama memakai gradasi Soft Lavender `#C9B5E0` melalui `#DFD0DF` ke peach `#F2DACE`; Medium Purple/Blue `#6061B6` untuk tombol/progress dan Dark Navy `#00105B` untuk teks. Putih hanya untuk teks tombol yang memerlukan kontras.
- Gunakan permukaan transparan bernuansa Navy, batas tipis, radius seragam, dan bayangan lembut untuk tampilan glassmorphism. Progress bar memakai gradien SVG yang bersumber dari token tema.
- Gunakan Poppins untuk judul/tombol/rumus/label SVG dan Nunito untuk isi; pakai token skala dan font di `src/theme.ts`, jangan menulis ukuran/font langsung di komponen.
- Logika hitung dan cek jawaban ada di `src/utils/`, bukan di layar.
- Data soal berupa objek terstruktur (lihat `PRD.md`), bukan teks yang ditulis langsung di layar.
- Refleksi, pengecoh, dan umpan balik setiap pilihan disimpan per soal di `src/data/soal.ts`; tampilkan satu opsi benar dan dua pengecoh dengan urutan acak.
- Progres kegiatan dan pilihan suara disimpan di `localStorage` dengan penanganan kegagalan dan fallback memori.
- Buat AudioContext hanya dari interaksi pengguna. Gunakan tombol ketuk bersama untuk bunyi tap; jangan menambahkan bunyi tap ke interaksi jawaban yang memiliki bunyi benar/salah.
- Layout **responsif**: lebar konten maksimal sekitar 480 px dan di tengah pada layar lebar. Jangan membuat desain yang hanya cocok di desktop.
- Pastikan semuanya berfungsi di web: hindari API khusus native (haptics, dll.) tanpa pengaman.

## Aturan desain yang tidak boleh dilanggar (dari temuan wawancara)
1. **Satu langkah per layar.** Jangan tampilkan banyak langkah sekaligus.
2. **Gambar dan teks berdekatan** dalam satu tampilan, tanpa bolak-balik.
3. **Sederhana.** Maksimal 3 warna aksen, tanpa animasi dekoratif, tanpa teks panjang dalam satu halaman.
4. **Penekanan warna hanya untuk bagian penting** (misalnya sisi miring).
5. **Setiap jawaban salah punya penjelasan alasan**, bukan hanya "Salah".
6. Bantuan **bertingkat** (petunjuk 1, 2, 3) dan dikurangi bertahap pada latihan mandiri.

## Aturan literasi matematika (tambahan)
Setiap soal konteks (Level 4) harus melatih tiga proses berurutan, dan aplikasi tidak boleh melewatkan salah satunya:
1. **Merumuskan**: siswa menandai Diketahui/Ditanyakan, membuat sketsa segitiga, memilih rumus.
2. **Menggunakan**: siswa menghitung.
3. **Menafsirkan dan mengevaluasi**: siswa menjawab "Apakah hasilnya masuk akal?" dan menyatakan jawaban dalam konteks (dengan satuan dan kalimat jawaban).

## Perintah penting
```
npx expo start --web      # jalankan di browser (http://localhost:8081)
npx expo start --tunnel   # bila ingin mencoba di HP lewat Expo Go
npx tsc --noEmit          # cek tipe
npx expo export --platform web   # hasil build statis di folder dist/
```
Untuk dibagikan lewat link: unggah folder `dist/` ke Netlify atau Vercel. Tidak perlu `eas build` atau APK.

## Cara kerja yang diharapkan
- Kerjakan **bertahap per layar**. Setelah satu layar jadi, jalankan dan pastikan tidak error sebelum lanjut.
- Sebelum menambah fitur di luar `PRD.md`, tanyakan dulu.
- Jangan mengubah `PRD.md`, `DESAIN.md`, atau `app.json` tanpa diminta (kecuali pengaturan web di atas).
- Jangan mengedit atau menghapus `node_modules`.
- Setelah selesai satu tahap, ringkas apa yang dibuat dan langkah berikutnya.
- Setelah perubahan, jalankan lint dan typecheck; periksa alur utama di web pada lebar HP.

## Catatan
Data wawancara bersifat simulasi. Untuk laporan penelitian, kode dan interpretasi harus ditetapkan dari wawancara nyata. Isi soal dan konten bisa direvisi setelah uji coba dengan siswa sebenarnya.