# DESAIN: Aplikasi Web Pembelajaran Teorema Pythagoras

Prinsip utama: **sederhana, satu fokus per layar, gambar dan teks berdekatan, mobile-first.** Keputusan desain berasal dari wawancara (EL02, EL03, DS03).

## 1. Warna
Didefinisikan di `src/theme.ts`; gunakan token semantik di semua layar dan komponen.

| Peran | Nilai | Dipakai untuk |
|-------|-------|---------------|
| Gradasi Soft Lavender–Peach | `#C9B5E0` → `#DFD0DF` → `#F2DACE` | Latar utama aplikasi dan hero |
| Soft Lavender | `#C9B5E0` | Aksen lembut, bidang dan penanda |
| Medium Purple/Blue | `#6061B6` | Tombol utama, progress, sorotan, ikon dan garis sisi |
| Dark Navy | `#00105B` | Semua teks utama, judul, label sisi dan kontras tinggi |
| Navy transparan | Turunan alfa dari Dark Navy | Permukaan glassmorphism, batas kartu dan bayangan |
| Putih | Khusus teks di atas tombol Medium Purple/Blue | Kontras tombol; bukan warna aksen/permukaan |

Latar utama memakai gradasi vertikal sangat halus dari Soft Lavender melalui warna transisi `#DFD0DF` menuju peach `#F2DACE`; stop tengah mencegah batas warna yang kaku. Latar yang sama tersedia pada web dan native. Teks Dark Navy dipakai untuk kontras tinggi, dan putih pada Medium Purple/Blue memiliki rasio kontras 5,41:1. Medium Purple/Blue tidak dipakai sebagai teks kecil di atas Soft Lavender (2,88:1). Pada Belajar dan Latihan, sisi yang dicari memakai garis Medium Purple/Blue yang lebih tebal dan jelas; sisi diketahui memakai warna yang sama dengan opasitas lebih rendah. Label tetap Dark Navy dan label sisi dicari diberi bobot lebih tebal. Tidak ada oranye, hijau, atau merah di UI; umpan balik tetap dibedakan oleh ikon dan teks.

## 2. Tipografi
- Font judul, subjudul, tombol, rumus, label dan angka SVG: **Poppins** (SemiBold 600 untuk judul; Medium 500 untuk tombol, label dan rumus).
- Font isi, penjelasan, soal, deskripsi dan umpan balik: **Nunito** (Regular 400; SemiBold 600 untuk penekanan). Fallback: `system-ui`.
- Skala di `src/theme.ts`: hero 30 px, judul layar 24 px, subjudul 18 px, isi minimal 16 px, keterangan 14 px, label kecil 12 px, label sisi 18 px.
- Line-height isi 1,5; judul 1,25. Letter-spacing 0,08 em hanya untuk label kecil kapital.
- Font dimuat sebelum konten tampil; saat memuat hanya ada latar peach polos.
- Maksimal sekitar 4-5 baris teks isi per layar. Lebih dari itu dipecah jadi langkah lain.

## 3. Tata letak responsif
- **Mobile-first**: desain utama untuk lebar 360-430 px.
- Di layar lebar, konten berada di tengah dengan lebar maksimal sekitar 480 px dan latar sisi kosong.
- Margin 16 px, jarak antar elemen 12-16 px.
- Tombol besar (tinggi minimal 52 px), sudut membulat 14 px. Tombol utama ungu penuh dengan teks putih; tombol sekunder putih dengan tepi lilac.
- Tombol utama hero minimal 56 px dan bersudut 16 px. Kartu menu bersudut 16 px dengan bayangan sangat halus; kartu gambar putih, bertepi lilac, dan bersudut 20 px.
- Ikon lintasan belajar adalah SVG 3D gradient buatan sendiri: kubus akar, segitiga dengan hipotenusa tersorot, buku terbuka dengan busur, dan pensil geometris dengan kilauan.
- Kartu, panel, kontrol, dan kotak umpan balik memakai permukaan transparan bernuansa Navy, garis tepi tipis, radius konsisten, dan bayangan lembut. Hindari bidang putih solid.
- Progress memiliki track Medium Purple/Blue transparan dan isi gradien horizontal dari token Medium Purple/Blue.
- Ikon lintasan adalah SVG kustom bernuansa gradien: kubus akar, segitiga dengan hipotenusa tersorot, buku terbuka dengan busur, dan pensil geometris dengan kilau.
- Keadaan ditekan memberi perubahan warna atau skala yang halus selama 200 ms; tanpa animasi dekoratif atau berulang.
- Tombol utama di bagian bawah konten. Kembali dan Ulangi di sebelahnya.
- Header: judul halaman dan indikator langkah/orientasi disertai progress bar tipis.
- Hindari scroll panjang: satu langkah harus muat di sekitar satu layar HP.
- Konten dibatasi sekitar 480 px dan dipusatkan pada layar lebar.
- Visualisasi 3D memakai material berlapis, bevel dan cahaya lembut. Label sisi diposisikan dari normal layar, dengan jarak berdasarkan ukuran DOM aktual dan diuji ulang saat rotasi/zoom; jika arah luar terlalu dekat tepi, label dicoba di sisi normal sebaliknya.

## 4. Komponen utama

### SegitigaSiku (paling penting)
- Objek Three.js berbentuk prisma segitiga ungu minimalis; SVG tetap menjadi fallback bila WebGL tidak tersedia atau pada target non-web.
- Menampilkan kotak kecil di sudut siku-siku, label **alas a**, **tegak b**, **miring c**, dan panjang sisi (atau "?" untuk yang dicari).
- Orientasi 0°, 90°, 180°, 270°, dan cermin.
- Pada layar Belajar, sisi yang dicari bergaris tebal dan berlabel ungu tua; sisi yang diketahui bergaris dan berlabel abu-abu keunguan. Tidak ada sisi oranye.
- Pada layar Kenali Sisi, sisi miring berubah oranye setelah jawaban benar.
- Bisa diputar 360° dengan mouse atau sentuhan. Animasi awal berputar perlahan dan berhenti pada interaksi pertama.
- Kontrol aksesibel menyediakan zoom masuk/keluar dan reset; keyboard memakai tombol panah, `+`/`-`, `0`/Home, dan A/B/C untuk memilih sisi.
- Sisi dapat diketuk pada mode Kenali Sisi; kontrol sentuh dan keyboard tidak bergantung pada warna saja.
- Label menempel pada sisi, menghadap kamera agar tetap terbaca, dan diposisikan dari normal sisi yang diproyeksikan ke layar dengan jarak minimum 12 px dari garis.
- Setelah jawaban latihan benar, label sisi yang dicari menampilkan nilai jawaban, termasuk dua angka desimal pada Level 3.
- Renderer menggunakan resolusi terbatas untuk perangkat mobile dan melepas geometri, material, frame animasi, serta konteks WebGL saat komponen dilepas.

### KartuLangkah
Satu langkah per kartu: judul langkah, satu atau dua kalimat, dan gambar segitiga dalam satu tampilan yang sama.

### TombolNavigasi
Kembali, Ulangi penjelasan, Lanjut. Lanjut aktif setelah langkah selesai.

### PetunjukBertingkat
"Butuh petunjuk?" membuka petunjuk 1, 2, lalu 3, satu per satu. Di latihan mandiri, tombol muncul hanya setelah salah.

### UmpanBalik
- Benar: tanda centang hijau dan satu kalimat alasan dalam kartu bersudut bulat.
- Salah: kartu lembut berisi **alasan**, lalu tombol "Coba lagi".
- Gunakan ikon kecil dan teks agar status tidak hanya dibedakan oleh warna.

### PenandaSoalCerita (literasi: merumuskan)
Siswa mengetuk kalimat pada soal cerita untuk menandainya **Diketahui** atau **Ditanyakan**, lalu menempatkan label sisi pada sketsa segitiga.

### KartuTafsir (literasi: menafsirkan)
Setelah menghitung, menampilkan pertanyaan "Apakah hasilnya masuk akal?" dengan tiga opsi yang urutannya diacak: satu benar dan dua pengecoh. Umpan balik untuk setiap opsi berasal dari data soal; jawaban benar menampilkan penguatan dan tombol **Lanjut**. Soal Level 4 juga meminta **kalimat jawaban** dengan satuan.

### Beranda
- **Keadaan 1 (nama belum ada):** hero lilac dan ilustrasi tetap tampil; sapaan meminta nama, kolom Nama panggilan dibatasi 20 karakter dan menerima huruf/spasi, lalu tombol Lanjut menyimpan nama dengan kapital awal tiap kata. Daftar kegiatan dan progres disembunyikan. Kolom otomatis fokus dan Enter menyimpan nama.
- **Keadaan 2 (nama ada, belum mulai):** hero menyapa dengan nama dan menanyakan kesiapan. Tombol Mulai belajar mengubah keadaan tanpa langsung berpindah layar; tautan Ganti nama membuka editor dengan nama lama.
- **Keadaan 3 (sudah mulai):** sapaan tetap tampil dan ringkasan kemajuan serta lintasan empat kegiatan muncul dengan fade-in 300 ms. Kartu Prasyarat, Kenali sisi, Belajar, dan Latihan selalu dapat dibuka. Jika ada kegiatan selesai, satu tombol Lanjutkan belajar menuju kegiatan pertama yang belum selesai; jika semuanya selesai, tombol Ulangi dari awal menuju Prasyarat. Ganti nama tersedia dekat sapaan.
- Nama dan status Mulai belajar hanya disimpan di perangkat melalui `localStorage` dengan fallback memori; progres tiap kegiatan tetap disimpan terpisah. Nama dan progres tidak dikirim ke layanan lain.

### TombolSuara
- Tombol sakelar berikon tersedia di Beranda dan setiap kegiatan; status aktif/nonaktif disimpan di `localStorage`.
- Bunyi menggunakan Web Audio API tanpa berkas audio: tap sine 900→620 Hz/50 ms/gain 0,07; benar dua lonceng C5-G5; salah sine 392→247 Hz/420 ms/gain 0,13; selesai empat lonceng C5-E5-G5-C6.
- AudioContext baru dibuat pada interaksi pertama, suara aktif dihentikan sebelum suara berikutnya, dan bunyi tap berjarak kurang dari 80 ms diabaikan. Ketukan jawaban hanya memainkan bunyi benar/salah, bukan bunyi tap.

## 5. Halaman

1. **Beranda**: hero lilac halus dengan ilustrasi geometri dan rumus, tombol "Mulai belajar", ringkasan progres, lalu lintasan empat kartu aktivitas. Tombol suara tersedia di hero.
2. **Prasyarat**: tiga kartu satu per layar dengan indikator Kartu X dari 3 dan tombol Kembali/Ulangi penjelasan/Lanjut. Kartu kuadrat memakai SVG persegi 3 × 3 dengan sembilan petak, kartu akar menampilkan contoh akar, dan kartu segitiga memakai SegitigaSiku serta tanda sudut 90°. Setelahnya ada tiga soal cepat berindikator Soal X dari 3: 7², √81, dan memilih satu dari dua gambar segitiga. Setiap soal menyediakan tiga petunjuk bertahap, alasan kesalahan umum, dan kesempatan mencoba lagi. Ringkasan memuat jumlah jawaban benar, tautan untuk mengulang kartu kuadrat/akar yang diperlukan, dan tombol Lanjut ke Kenali sisi. Kegiatan ditandai selesai setelah soal ketiga dijawab benar.
3. **Kenali Sisi**: objek 3D di tengah, perintah "Ketuk sisi miringnya", umpan balik, lalu orientasi berikutnya. Siswa dapat memutar, zoom, atau reset dengan tombol yang memiliki label aksesibel.
4. **Belajar**: contoh soal per level, 4 langkah, satu per layar.
5. **Latihan**: soal level 1-4 dengan petunjuk bertingkat, tiga opsi refleksi acak dengan umpan balik, nilai jawaban pada segitiga, dan kalimat jawaban Level 4.
6. **Ringkasan**: skor per proses literasi (merumuskan, menggunakan, menafsirkan), bagian yang perlu diulang, dan susunan langkah buatan siswa.

## 6. Yang dihindari
- Banyak warna dan animasi ramai.
- Banyak langkah muncul sekaligus.
- Paragraf panjang dalam satu halaman.
- Gambar dan penjelasan di bagian layar yang berjauhan.
- Pesan "Salah" tanpa alasan.

## 7. Animasi
Konten Beranda memudar masuk selama 300 ms; kartu aktif terangkat 2 px saat hover/tekan dan tombol/sorotan berubah halus selama 200 ms. Tidak ada animasi dekoratif atau berulang.

## 8. Aksesibilitas dasar
- Kontras teks dan latar minimal 4.5:1, termasuk teks tombol putih di atas ungu.
- Warna tidak jadi satu-satunya penanda: sisi miring juga diberi label teks "miring".
- Area ketuk minimal 48 × 48 px.
- Fokus keyboard terlihat jelas (untuk pemakaian di laptop).
- Sakelar suara memiliki nama aksesibel yang berubah antara "Nyalakan suara" dan "Matikan suara".