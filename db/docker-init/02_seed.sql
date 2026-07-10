SET session_replication_role = replica;

\i /seed/referensi_dokumen_koperasi.sql
\i /seed/referensi_gerai_koperasi.sql
\i /seed/referensi_wilayah.sql
\i /seed/referensi_komoditas_desa.sql
\i /seed/referensi_koperasi_wilayah.sql
\i /seed/referensi_profil_desa.sql
\i /seed/profil_koperasi.sql
\i /seed/akun_bank_koperasi.sql
\i /seed/aset_koperasi.sql
\i /seed/dokumen_koperasi.sql
\i /seed/gerai_koperasi.sql
\i /seed/karyawan_koperasi.sql
\i /seed/kbli_koperasi.sql
\i /seed/modal_koperasi.sql
\i /seed/pengajuan_domain.sql
\i /seed/pengajuan_kemitraan.sql
\i /seed/pengajuan_pembiayaan.sql
\i /seed/pengurus_koperasi.sql
\i /seed/produk_koperasi.sql
\i /seed/rat_koperasi.sql
\i /seed/anggota_koperasi.sql
\i /seed/transaksi_penjualan.sql
\i /seed/simpanan_anggota.sql
\i /seed/inventaris_produk.sql
\i /seed/barang_masuk_produk.sql
\i /seed/barang_keluar_produk.sql

SET session_replication_role = DEFAULT;
