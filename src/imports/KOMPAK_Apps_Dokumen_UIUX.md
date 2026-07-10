# DOKUMEN PENGEMBANGAN UI/UX

## KOMPAK Apps

*Optimalisasi Potensi Desa Melalui Koperasi*

*"Satu Irama, Satu Data"*

Hackathon Digital Cooperatives Expo 2026 — Tema 2
Pilar 3 · Kemenkop RI × PEBS FEB UI
Tim KOMPAK Apps

---

## 1. Pendahuluan

### 1.1 Ringkasan Produk

KOMPAK Apps adalah platform web berbasis peta geospasial interaktif yang menghubungkan produsen komoditas desa — baik individu maupun komunitas berbasis RT/RW/Kelurahan — dengan Koperasi Desa/Kelurahan Merah Putih secara langsung, proaktif, dan dua arah. Dokumen ini menjabarkan arsitektur informasi, alur pengguna, wireframe konseptual, dan sistem desain yang menjadi acuan tim pengembang dan desainer.

### 1.2 Tujuan Dokumen

- Menjadi acuan bersama tim pengembang, desainer, dan pemangku kepentingan dalam membangun antarmuka KOMPAK Apps.
- Memetakan kebutuhan setiap persona pengguna ke dalam alur dan tampilan yang konkret.
- Menjabarkan prinsip dan sistem desain agar konsisten di seluruh halaman.
- Menentukan prioritas pengembangan fitur dari tahap MVP hingga skala nasional.

### 1.3 Posisi Terhadap Ekosistem Eksisting

KOMPAK Apps tidak dirancang untuk menggantikan infrastruktur yang sudah dibangun lewat Simkopdes dan CoopTrade, melainkan mengisi celah pada lapisan pencocokan proaktif, distribusi, dan analitik yang belum berjalan di platform tersebut. Ringkasan kesenjangan yang menjadi dasar perancangan fitur tercantum pada Lampiran A.

---

## 2. Prinsip Desain

Empat prinsip berikut menjadi acuan setiap keputusan desain pada KOMPAK Apps:

### 2.1 Mobile-First & Ringan

Sebagian besar produsen desa mengakses lewat ponsel dengan koneksi data terbatas. Tata letak, ukuran gambar, dan interaksi peta harus dioptimalkan untuk layar kecil dan jaringan lambat.

### 2.2 Peta sebagai Pusat Interaksi

Peta interaktif bukan sekadar halaman informasi, melainkan titik masuk utama untuk pencarian, pencocokan, dan transaksi — sejalan dengan alur kerja dua arah yang menjadi inti produk.

### 2.3 Kepercayaan Berbasis Data Terbuka

Status verifikasi, riwayat transaksi, dan data kapasitas ditampilkan secara transparan di setiap etalase digital, untuk membangun kepercayaan antara produsen dan koperasi yang belum saling mengenal.

### 2.4 Input Tanpa Hambatan (Low-Friction Input)

Formulir pendaftaran produk oleh individu dirancang sesingkat mungkin — idealnya dapat diselesaikan dalam hitungan menit dari ponsel, termasuk opsi input lewat foto untuk mengurangi ketikan manual.

---

## 3. Persona Pengguna

Perancangan alur dan tampilan KOMPAK Apps didasarkan pada empat persona utama berikut.

| Persona | Peran & Tujuan | Frustrasi Utama | Perangkat Utama |
|---|---|---|---|
| Produsen Individu (mis. Pak Budi) | Mendaftarkan produk agar terlihat oleh koperasi terdekat; mencari pembeli tanpa keluar desa. | Tidak tahu koperasi mana yang butuh produknya; bergantung pada tengkulak. | Smartphone |
| Komunitas RT/RW/Kelurahan | Mendaftarkan potensi produksi kelompok (mis. hasil panen bersama) sebagai satu entitas. | Potensi produksi kelompok tidak tercatat di sistem mana pun. | Smartphone / warung internet desa |
| Pengurus Koperasi Merah Putih | Mencari pasokan terdekat sesuai kebutuhan; mengumumkan kebutuhan aktif; menjadwalkan pickup. | Waktu dan biaya pencarian pasokan tinggi; data pemasok tersebar. | Laptop / smartphone |
| Offtaker / Buyer Eksternal | Menemukan koperasi dengan stok surplus untuk dibeli dalam jumlah besar. | Tidak ada jalur khusus untuk melihat stok surplus koperasi desa. | Laptop |

---

## 4. Pemetaan Fitur ke Layar

Tabel berikut menghubungkan setiap fitur dengan layar yang menampungnya, sekaligus menandai prioritas pengembangan.

| Fitur | Layar Terkait | Prioritas |
|---|---|---|
| Pendaftaran produk oleh individu | Form Tambah Produk | MVP |
| Peta komoditas dua arah | Peta Utama, Detail Pin | MVP |
| Etalase digital produsen & koperasi | Halaman Profil Entitas | MVP |
| Pencocokan berbasis jarak & komoditas | Peta Utama, Panel Rekomendasi | MVP |
| Pengumuman kebutuhan koperasi | Dashboard Koperasi — Kebutuhan Aktif | MVP |
| Rekomendasi AI: koperasi yang butuh produk saya | Dashboard Produsen — Rekomendasi | Fase 2 |
| Status distribusi & tracking pickup | Halaman Pesanan / Detail Transaksi | Fase 2 |
| Rekomendasi nilai tambah produk | Halaman Detail Produk | Fase 2 |
| Listing stok surplus ke offtaker | Dashboard Koperasi — Stok Surplus | Fase 2 |
| Smart Village Analytics | Dashboard Analitik Wilayah | Fase 3 |

---

## 5. Arsitektur Informasi

Struktur navigasi KOMPAK Apps dibagi menjadi lima kelompok utama:

### 5.1 Publik (Tanpa Login)

- Landing Page — pengantar produk & nilai utama
- Peta Komoditas — peta nasional, dapat difilter tanpa login
- Detail Entitas (Produsen/Koperasi) — versi terbatas, mendorong login untuk fitur penuh
- Komoditas & Katalog Produk

### 5.2 Akun Produsen Individu / Komunitas

- Onboarding & Pendaftaran Produk
- Dashboard Produsen — ringkasan etalase, status verifikasi
- Rekomendasi Koperasi yang Membutuhkan (AI)
- Riwayat Penawaran & Transaksi

### 5.3 Akun Koperasi

- Dashboard Koperasi — kebutuhan aktif, rekomendasi produsen terdekat
- Buat Pengumuman Kebutuhan
- Pelacakan Pesanan & Penjadwalan Pickup
- Listing Stok Surplus (untuk offtaker)

### 5.4 Akun Offtaker/Buyer Eksternal

- Pencarian Stok Surplus Koperasi
- Permintaan Penawaran (RFQ)

### 5.5 Admin/Verifikator (opsional, fase lanjutan)

- Verifikasi Data Produsen & Koperasi
- Dashboard Smart Village Analytics (tingkat wilayah)

---

## 6. Alur Pengguna (User Flow)

### 6.1 Alur A — Produsen Mendaftarkan Produk

1. Produsen individu membuka KOMPAK Apps dan memilih "Daftar sebagai Produsen".
2. Mengisi profil singkat: nama, lokasi (otomatis dari GPS atau pilih di peta), dan kontak.
3. Menambahkan produk: jenis komoditas, estimasi jumlah/kapasitas, foto produk (opsional mempercepat verifikasi).
4. Sistem menampilkan pratinjau etalase digital sebelum dipublikasikan.
5. Produk tayang di peta komoditas dengan status "Menunggu Verifikasi", lalu berubah menjadi "Terverifikasi" setelah proses berjalan.

*Tujuan alur: meminimalkan langkah dari niat mendaftar hingga produk tampil di peta.*

### 6.2 Alur B — Koperasi Mencari Produsen Terdekat

6. Pengurus koperasi login dan membuka Dashboard Koperasi.
7. Memilih "Cari Pasokan" dan menentukan jenis komoditas serta radius pencarian.
8. Sistem menampilkan daftar dan pin peta produsen terdekat, diurutkan berdasarkan jarak dan kecocokan komoditas.
9. Koperasi membuka etalase salah satu produsen, meninjau stok dan harga.
10. Koperasi mengajukan penawaran atau langsung menjadwalkan pickup lewat armada Koperasi Merah Putih.

### 6.3 Alur C — Produsen Menerima Rekomendasi AI

11. Produsen membuka Dashboard Produsen dan tab "Rekomendasi untuk Saya".
12. Sistem menyusun daftar koperasi yang berpotensi membutuhkan produk, berdasarkan dua sumber: pola transaksi historis koperasi sejenis dan pengumuman kebutuhan aktif yang sedang dipasang.
13. Setiap rekomendasi menampilkan skor kecocokan, jarak, dan alasan singkat (contoh: "Koperasi ini rutin membeli gula aren setiap bulan").
14. Produsen dapat langsung mengajukan penawaran dari kartu rekomendasi tanpa berpindah halaman.

*Fase awal (MVP/Fase 2) menggunakan rule-based scoring (jarak + histori + kecocokan kategori) yang ditampilkan sebagai rekomendasi cerdas; model machine learning penuh menjadi peningkatan pada fase lanjutan.*

### 6.4 Alur D — Koperasi Mengumumkan Kebutuhan

15. Koperasi membuka "Buat Pengumuman Kebutuhan" dari Dashboard Koperasi.
16. Mengisi jenis komoditas, jumlah yang dibutuhkan, dan batas waktu.
17. Sistem menayangkan pengumuman di peta dan mengirim notifikasi ke produsen relevan dalam radius tertentu.
18. Produsen yang berminat merespons langsung dari notifikasi atau dashboard masing-masing.

---

## 7. Deskripsi Wireframe Konseptual

Bagian ini menjabarkan elemen-elemen utama pada layar kunci sebagai acuan desainer sebelum masuk ke tahap desain visual definitif.

### 7.1 Peta Komoditas (Layar Utama)

- Bilah pencarian di bagian atas: cari barang, lokasi, atau nama koperasi/produsen.
- Peta memenuhi sebagian besar layar, dengan pin dua jenis: koperasi (ikon rumah) dan produsen individu/komunitas (ikon berbeda agar terbedakan dari koperasi).
- Filter komoditas dan radius sebagai chip di atas peta, dapat digulir horizontal pada mobile.
- Tap pin menampilkan kartu ringkas (nama, jenis komoditas, jarak); tap kartu membuka Detail Entitas penuh.
- Tombol mengambang "+ Tambah Produk Saya" untuk produsen yang belum terdaftar.

### 7.2 Form Tambah Produk

- Formulir bertahap (stepper) tiga langkah: Data Diri → Data Produk → Pratinjau.
- Input lokasi memakai peta mini dengan pin yang dapat digeser, dilengkapi deteksi GPS otomatis.
- Unggah foto produk opsional namun disarankan, dengan keterangan "mempercepat proses verifikasi".
- Tombol utama tetap terlihat (sticky) di bagian bawah layar pada tampilan mobile.

### 7.3 Dashboard Produsen — Rekomendasi Koperasi

- Daftar kartu koperasi yang direkomendasikan, setiap kartu menampilkan: nama koperasi, jarak, skor kecocokan, dan alasan singkat rekomendasi.
- Filter sederhana: berdasarkan jarak terdekat atau skor kecocokan tertinggi.
- Tombol aksi cepat pada tiap kartu: "Ajukan Penawaran" dan "Lihat Detail Koperasi".

### 7.4 Dashboard Koperasi — Kebutuhan & Pasokan

- Dua tab utama: "Kebutuhan Aktif" (pengumuman yang sedang berjalan) dan "Cari Pasokan" (pencarian produsen terdekat).
- Tab Kebutuhan Aktif menampilkan status setiap pengumuman: jumlah respons, sisa waktu, dan tombol "Tutup Pengumuman".
- Panel ringkas status pesanan berjalan (dijadwalkan, dalam perjalanan, selesai) di bagian atas dashboard.

### 7.5 Detail Entitas (Etalase Digital)

- Header dengan nama entitas, badge status verifikasi, dan lokasi.
- Bagian data: jenis komoditas, kapasitas produksi, harga, riwayat transaksi ringkas.
- Tombol aksi utama: "Hubungi" dan "Ajukan Penawaran", ditempatkan menonjol dan konsisten dengan pola pada aplikasi peta koperasi eksisting.
- Untuk produk mentah, tampilkan kotak "Rekomendasi Nilai Tambah" berisi saran pengolahan/pengemasan yang relevan.

---

## 8. Sistem Desain

### 8.1 Palet Warna

Palet warna diselaraskan dengan identitas yang sudah digunakan pada materi presentasi KOMPAK Apps, terinspirasi nuansa hijau desa dan hasil bumi.

| Token | Hex | Penggunaan |
|---|---|---|
| Primary (Forest Green) | `#2C5F2D` | Warna utama identitas, tombol primer, ikon aktif |
| Primary Dark | `#1F4B2E` | Latar gelap pada halaman sambutan/penutup, header |
| Secondary (Moss/Olive) | `#6E8B3D` | Aksen sekunder, status "dalam proses" |
| Accent (Gold/Harvest) | `#D98E30` | Tombol ajakan bertindak, badge, sorotan rekomendasi |
| Netral Gelap | `#22301C` | Teks utama |
| Netral Redup | `#5C6B52` | Teks sekunder, keterangan |
| Latar Kartu | `#F3F6EE` | Latar kartu dan panel konten |

### 8.2 Tipografi

- Judul halaman & tajuk bagian: Cambria, bold, 24–30pt.
- Sub-tajuk: Cambria, bold, 16–18pt.
- Teks isi & label formulir: Calibri, regular, 12–14pt.
- Keterangan/caption: Calibri, italic, 10–11pt, warna netral redup.

### 8.3 Komponen Utama

- **Kartu (Card)**: sudut membulat, bayangan tipis, latar `#F3F6EE` untuk kartu sekunder dan putih untuk kartu utama.
- **Badge Status Verifikasi**: bentuk pil, warna hijau untuk "Terverifikasi", abu-abu untuk "Menunggu Verifikasi".
- **Pin Peta**: dua bentuk berbeda untuk koperasi dan produsen individu, dengan warna kontras terhadap latar satelit peta.
- **Tombol Primer**: latar warna Primary atau Accent tergantung konteks aksi (aksi utama transaksi memakai Accent agar menonjol).
- **Chip Filter**: bentuk pil dengan status aktif/tidak aktif yang jelas, digunakan pada filter komoditas dan radius.

### 8.4 Aksesibilitas & Responsif

- Kontras teks terhadap latar mengikuti standar keterbacaan minimum (rasio kontras memadai untuk teks kecil).
- Seluruh interaksi utama (tambah produk, cari pasokan, ajukan penawaran) dapat diselesaikan penuh dari layar ponsel tanpa perlu versi desktop.
- Ukuran target sentuh minimum mengikuti pedoman umum antarmuka mobile agar nyaman digunakan di lapangan.

---

## 9. Prioritas Pengembangan

Pengembangan dirancang bertahap agar validasi dapat dilakukan sejak fase awal sebelum menambah kompleksitas fitur.

| Fase | Fokus | Fitur Kunci |
|---|---|---|
| Fase 1 — MVP / Validasi | Peta dasar dan pendaftaran mandiri berjalan di beberapa koperasi mitra. | Peta komoditas, pendaftaran produk individu, etalase digital, pencarian pasokan manual. |
| Fase 2 — Ekspansi | Pencocokan proaktif dan distribusi mulai berjalan otomatis. | Rekomendasi AI (rule-based), pengumuman kebutuhan, tracking pesanan, rekomendasi nilai tambah. |
| Fase 3 — Skala Nasional | Integrasi penuh ke jaringan Koperasi Merah Putih nasional. | Smart Village Analytics, listing stok surplus ke offtaker, model rekomendasi lanjutan. |

---

## Lampiran A — Ringkasan Kesenjangan terhadap Ekosistem Eksisting

Tabel berikut merangkum posisi KOMPAK Apps terhadap CoopTrade/Simkopdes yang menjadi dasar penentuan prioritas fitur pada dokumen ini.

| Aspek | Sudah Ada (CoopTrade/Simkopdes) | Sesudah KOMPAK Apps |
|---|---|---|
| Peta sebaran entitas | Peta cluster nasional, level koperasi saja | Produsen individu & kelompok RT/RW turut terpetakan |
| Input produk oleh individu | Belum tersedia jalur pendaftaran mandiri | Produsen mendaftarkan produk sendiri, membentuk peta komoditas dari bawah |
| Pencocokan produsen–koperasi | RFQ pasif, menunggu diajukan | Pencocokan proaktif dua arah berbasis jarak & komoditas |
| Rekomendasi kebutuhan ke produsen | Tidak tersedia | Rekomendasi berbasis histori transaksi & pengumuman kebutuhan aktif |
| Distribusi & logistik | Tidak ada status pengiriman | Pelacakan status pesanan terintegrasi armada Koperasi Merah Putih |
| Nilai tambah produk | Taksonomi datar | Rekomendasi pengolahan/pengemasan berbasis komoditas |
| Analitik wilayah | Tabel potensi statis per desa | Smart Village Analytics: potensi termanfaatkan & tren permintaan |
