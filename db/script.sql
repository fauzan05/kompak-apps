create table referensi_dokumen_koperasi
(
    jenis_dokumen_ref text not null
        constraint pk_referensi_dokumen_koperasi_4ea58f34
            primary key,
    nama_dokumen      text,
    dibuat_pada       timestamp,
    diperbarui_pada   timestamp
);

alter table referensi_dokumen_koperasi
    owner to hackathon_2026;

grant select on referensi_dokumen_koperasi to hackathon_kemenkop_2026;

grant select on referensi_dokumen_koperasi to hackathon_participant_2026;

create table referensi_gerai_koperasi
(
    jenis_gerai_ref  text not null
        constraint pk_referensi_gerai_koperasi_e9d11ded
            primary key,
    nama_jenis_gerai text,
    dibuat_pada      timestamp,
    diperbarui_pada  timestamp
);

alter table referensi_gerai_koperasi
    owner to hackathon_2026;

grant select on referensi_gerai_koperasi to hackathon_kemenkop_2026;

grant select on referensi_gerai_koperasi to hackathon_participant_2026;

create table referensi_wilayah
(
    provinsi        text,
    kab_kota        text,
    kecamatan       text,
    desa_kelurahan  text,
    kode_wilayah    text not null
        constraint pk_referensi_wilayah_57bb55d7
            primary key,
    dibuat_pada     timestamp,
    diperbarui_pada timestamp
);

alter table referensi_wilayah
    owner to hackathon_2026;

grant select on referensi_wilayah to hackathon_kemenkop_2026;

grant select on referensi_wilayah to hackathon_participant_2026;

create table referensi_komoditas_desa
(
    komoditas_ref       text not null
        constraint pk_referensi_komoditas_desa_fdbdbdd4
            primary key,
    kode_wilayah        text not null
        constraint fk_referensi_komoditas_desa_kode_wilayah_ba3b0dad
            references referensi_wilayah,
    nama_komoditas      text,
    luas_area           text,
    volume              text,
    jumlah_sdm_terlibat real,
    nilai_potensi_desa  bigint,
    dibuat_pada         timestamp,
    diperbarui_pada     timestamp
);

alter table referensi_komoditas_desa
    owner to hackathon_2026;

grant select on referensi_komoditas_desa to hackathon_kemenkop_2026;

grant select on referensi_komoditas_desa to hackathon_participant_2026;

create table referensi_koperasi_wilayah
(
    koperasi_ref    text not null
        constraint pk_referensi_koperasi_aktif_778fe8ef
            primary key,
    kode_wilayah    text
        constraint fk_referensi_koperasi_aktif_kode_wilayah_93c6fdcd
            references referensi_wilayah,
    dibuat_pada     timestamp,
    diperbarui_pada timestamp
);

alter table referensi_koperasi_wilayah
    owner to hackathon_2026;

grant select on referensi_koperasi_wilayah to hackathon_kemenkop_2026;

grant select on referensi_koperasi_wilayah to hackathon_participant_2026;

create table referensi_profil_desa
(
    kode_wilayah       text not null
        constraint pk_referensi_profil_desa_ed7fcc83
            primary key
        constraint fk_referensi_profil_desa_kode_wilayah_c5f8bf81
            references referensi_wilayah,
    tahun_populasi     integer,
    total_penduduk     integer,
    penduduk_laki_laki integer,
    penduduk_perempuan integer,
    tahun_pendanaan    integer,
    anggaran_dana_desa numeric,
    dibuat_pada        timestamp,
    diperbarui_pada    timestamp
);

alter table referensi_profil_desa
    owner to hackathon_2026;

grant select on referensi_profil_desa to hackathon_kemenkop_2026;

grant select on referensi_profil_desa to hackathon_participant_2026;

create table transaksi_penjualan
(
    transaksi_sample_id text not null
        constraint pk_transaksi_penjualan_2711f8e1
            primary key,
    koperasi_ref        text not null
        constraint fk_transaksi_penjualan_koperasi_ref_f99204f5
            references referensi_koperasi_wilayah,
    nama_pelanggan      text,
    tanggal_dibuat      timestamp,
    total_pembayaran    numeric,
    status_transaksi    text,
    metode_pembayaran   text,
    dibuat_pada         timestamp,
    diperbarui_pada     timestamp
);

alter table transaksi_penjualan
    owner to hackathon_2026;

grant select on transaksi_penjualan to hackathon_kemenkop_2026;

grant select on transaksi_penjualan to hackathon_participant_2026;

create table akun_bank_koperasi
(
    akun_bank_ref   text not null
        constraint pk_akun_bank_koperasi_3314f99b
            primary key,
    koperasi_ref    text not null
        constraint fk_akun_bank_koperasi_koperasi_ref_b79a5726
            references referensi_koperasi_wilayah,
    nama_rekening   text,
    nama_bank       text,
    dibuat_pada     timestamp,
    diperbarui_pada timestamp
);

alter table akun_bank_koperasi
    owner to hackathon_2026;

grant select on akun_bank_koperasi to hackathon_kemenkop_2026;

grant select on akun_bank_koperasi to hackathon_participant_2026;

create table aset_koperasi
(
    aset_ref             text not null
        constraint pk_aset_koperasi_b272e8a6
            primary key,
    koperasi_ref         text not null
        constraint fk_aset_koperasi_koperasi_ref_2ff5abd1
            references referensi_koperasi_wilayah,
    nama_aset            text,
    tipe_aset            text,
    status               text,
    progres_pembangunan  numeric,
    foto_utama           text,
    foto_sekunder        text,
    dokumen_utama        text,
    dokumen_sekunder     text,
    dokumen_lainnya      text,
    luas_lahan           numeric,
    panjang_lahan        numeric,
    lebar_lahan          numeric,
    akses_jalan          text,
    koordinat_dibulatkan text,
    dibuat_pada          timestamp,
    diperbarui_pada      timestamp
);

alter table aset_koperasi
    owner to hackathon_2026;

grant select on aset_koperasi to hackathon_kemenkop_2026;

grant select on aset_koperasi to hackathon_participant_2026;

create table dokumen_koperasi
(
    dokumen_ref         text not null
        constraint pk_dokumen_koperasi_f5f81f61
            primary key,
    koperasi_ref        text not null
        constraint fk_dokumen_koperasi_koperasi_ref_22ac9c60
            references referensi_koperasi_wilayah,
    jenis_dokumen_ref   text not null
        constraint fk_dokumen_koperasi_jenis_dokumen_ref_5df8ee5b
            references referensi_dokumen_koperasi,
    nomor               text,
    tanggal_berlaku     date,
    tanggal_kadaluarsa  date,
    alamat_pada_dokumen text,
    unggahan_dokumen    text,
    dibuat_pada         timestamp,
    diperbarui_pada     timestamp
);

alter table dokumen_koperasi
    owner to hackathon_2026;

grant select on dokumen_koperasi to hackathon_kemenkop_2026;

grant select on dokumen_koperasi to hackathon_participant_2026;

create table gerai_koperasi
(
    gerai_ref                     text not null
        constraint pk_gerai_koperasi_2aac4c3c
            primary key,
    koperasi_ref                  text not null
        constraint fk_gerai_koperasi_koperasi_ref_9ea0835d
            references referensi_koperasi_wilayah,
    jenis_gerai_ref               text not null
        constraint fk_gerai_koperasi_jenis_gerai_ref_57ac7e95
            references referensi_gerai_koperasi,
    status_gerai                  text,
    foto_gerai                    text,
    pengisi                       text,
    akses_internet                text,
    akses_listrik                 text,
    status_kepemilikan_aset_gerai text,
    status_pemanfaatan_aset_gerai text,
    sumber_air_bersih             text,
    jenis_bangunan                text,
    koordinat_dibulatkan          text,
    dibuat_pada                   timestamp,
    diperbarui_pada               timestamp
);

alter table gerai_koperasi
    owner to hackathon_2026;

grant select on gerai_koperasi to hackathon_kemenkop_2026;

grant select on gerai_koperasi to hackathon_participant_2026;

create table karyawan_koperasi
(
    karyawan_ref      text not null
        constraint pk_karyawan_koperasi_bffc535e
            primary key,
    koperasi_ref      text not null
        constraint fk_karyawan_koperasi_koperasi_ref_4e47588f
            references referensi_koperasi_wilayah,
    nama              text,
    jabatan           text,
    nomor_hp_karyawan text,
    jenis_kelamin     text,
    nik               text,
    email             text,
    status_karyawan   text,
    dibuat_pada       timestamp,
    diperbarui_pada   timestamp
);

alter table karyawan_koperasi
    owner to hackathon_2026;

grant select on karyawan_koperasi to hackathon_kemenkop_2026;

grant select on karyawan_koperasi to hackathon_participant_2026;

create table kbli_koperasi
(
    __row_id        integer not null
        constraint pk_kbli_koperasi_55bee0fc
            primary key,
    koperasi_ref    text    not null
        constraint fk_kbli_koperasi_koperasi_ref_659f6886
            references referensi_koperasi_wilayah,
    kode_kbli       text,
    nama_kbli       text,
    tipe_izin_usaha text,
    tahun_kbli      smallint,
    dibuat_pada     timestamp,
    diperbarui_pada timestamp
);

alter table kbli_koperasi
    owner to hackathon_2026;

grant select on kbli_koperasi to hackathon_kemenkop_2026;

grant select on kbli_koperasi to hackathon_participant_2026;

create table modal_koperasi
(
    modal_ref        text not null
        constraint pk_modal_koperasi_a1180c73
            primary key,
    koperasi_ref     text not null
        constraint fk_modal_koperasi_koperasi_ref_1bb5cd3d
            references referensi_koperasi_wilayah,
    nomor_perjanjian text,
    tipe_sumber      text,
    nama_sumber      text,
    tipe_modal       text,
    jumlah           numeric,
    tanggal_diterima date,
    file_perjanjian  text,
    dibuat_pada      timestamp,
    diperbarui_pada  timestamp
);

alter table modal_koperasi
    owner to hackathon_2026;

grant select on modal_koperasi to hackathon_kemenkop_2026;

grant select on modal_koperasi to hackathon_participant_2026;

create table pengajuan_domain
(
    domain_ref        text not null
        constraint pk_pengajuan_domain_6763303c
            primary key,
    koperasi_ref      text not null
        constraint fk_pengajuan_domain_koperasi_ref_980169cd
            references referensi_koperasi_wilayah,
    domain_koperasi   text,
    status_verifikasi text,
    status_domain     text,
    dibuat_pada       timestamp,
    diperbarui_pada   timestamp
);

alter table pengajuan_domain
    owner to hackathon_2026;

grant select on pengajuan_domain to hackathon_kemenkop_2026;

grant select on pengajuan_domain to hackathon_participant_2026;

create table pengajuan_kemitraan
(
    pengajuan_kemitraan_ref text not null
        constraint pk_pengajuan_kemitraan_625d306d
            primary key,
    koperasi_ref            text not null
        constraint fk_pengajuan_kemitraan_koperasi_ref_33626c2e
            references referensi_koperasi_wilayah,
    nik                     text,
    penanggung_jawab        text,
    nomor_penanggung_jawab  text,
    status_permohonan       text,
    bisnis_kemitraan        text,
    paket_kemitraan         text,
    formulir_permohonan     text,
    ktp_penanggung_jawab    text,
    tipe_kemitraan          text,
    catatan                 text,
    dibuat_pada             timestamp,
    diperbarui_pada         timestamp
);

alter table pengajuan_kemitraan
    owner to hackathon_2026;

grant select on pengajuan_kemitraan to hackathon_kemenkop_2026;

grant select on pengajuan_kemitraan to hackathon_participant_2026;

create table pengajuan_pembiayaan
(
    pengajuan_pembiayaan_ref       text not null
        constraint pk_pengajuan_pembiayaan_28483833
            primary key,
    koperasi_ref                   text not null
        constraint fk_pengajuan_pembiayaan_koperasi_ref_cb273759
            references referensi_koperasi_wilayah,
    nik                            text,
    penanggung_jawab               text,
    nomor_penanggung_jawab         text,
    status_permohonan              text,
    formulir_permohonan_pembiayaan text,
    nominal_permohonan             real,
    tenor                          integer,
    tujuan_permohonan              text,
    dibuat_pada                    timestamp,
    diperbarui_pada                timestamp
);

alter table pengajuan_pembiayaan
    owner to hackathon_2026;

grant select on pengajuan_pembiayaan to hackathon_kemenkop_2026;

grant select on pengajuan_pembiayaan to hackathon_participant_2026;

create table pengajuan_rekening_bank
(
    pengajuan_rekening_ref text not null
        constraint pk_pengajuan_rekening_bank_93255ee4
            primary key,
    koperasi_ref           text not null
        constraint fk_pengajuan_rekening_bank_koperasi_ref_fd7eef0a
            references referensi_koperasi_wilayah,
    nik                    text,
    penanggung_jawab       text,
    nomor_penanggung_jawab text,
    status                 text,
    kode_bank              text,
    nama_bank              text,
    dibuat_pada            timestamp,
    diperbarui_pada        timestamp
);

alter table pengajuan_rekening_bank
    owner to hackathon_2026;

grant select on pengajuan_rekening_bank to hackathon_kemenkop_2026;

grant select on pengajuan_rekening_bank to hackathon_participant_2026;

create table pengurus_koperasi
(
    pengurus_ref      text not null
        constraint pk_pengurus_koperasi_5b9a4e2c
            primary key,
    koperasi_ref      text not null
        constraint fk_pengurus_koperasi_koperasi_ref_762eb9ec
            references referensi_koperasi_wilayah,
    nama              text,
    jabatan           text,
    status            text,
    no_hp             text,
    nik               text,
    jenis_kelamin     text,
    foto_profil       text,
    email             text,
    alamat            text,
    kode_pos          text,
    tanggal_lahir     text,
    status_pendidikan text,
    periode_mulai     text,
    periode_selesai   date,
    file_ktp          text,
    sumber_data       text,
    dibuat_pada       timestamp,
    diperbarui_pada   timestamp
);

alter table pengurus_koperasi
    owner to hackathon_2026;

grant select on pengurus_koperasi to hackathon_kemenkop_2026;

grant select on pengurus_koperasi to hackathon_participant_2026;

create table produk_koperasi
(
    produk_sample_id text not null
        constraint pk_produk_koperasi_4e63ea77
            primary key,
    koperasi_ref     text not null
        constraint fk_produk_koperasi_koperasi_ref_5e27414b
            references referensi_koperasi_wilayah,
    kode_barcode     text,
    nama_produk      text,
    unit             text,
    dibuat_pada      timestamp,
    diperbarui_pada  timestamp
);

alter table produk_koperasi
    owner to hackathon_2026;

grant select on produk_koperasi to hackathon_kemenkop_2026;

grant select on produk_koperasi to hackathon_participant_2026;

create table profil_koperasi
(
    koperasi_ref         text not null
        constraint pk_profil_koperasi_26375302
            primary key
        constraint fk_profil_koperasi_koperasi_ref_2fda584b
            references referensi_koperasi_wilayah,
    nama_koperasi        text,
    status_registrasi    text,
    bentuk_koperasi      text,
    kategori_usaha       text,
    nik_koperasi         text,
    alamat_lengkap       text,
    kode_pos             text,
    koordinat_dibulatkan text,
    modal_awal           text,
    sumber_persetujuan   text,
    tentang_koperasi     text,
    pola_pengelolaan     text,
    metode_pengisian     text,
    dibuat_pada          timestamp,
    diperbarui_pada      timestamp
);

alter table profil_koperasi
    owner to hackathon_2026;

grant select on profil_koperasi to hackathon_kemenkop_2026;

grant select on profil_koperasi to hackathon_participant_2026;

create table rat_koperasi
(
    rat_sample_id           text not null
        constraint pk_rat_koperasi_6272548f
            primary key,
    koperasi_ref            text not null
        constraint fk_rat_koperasi_koperasi_ref_7258ec7e
            references referensi_koperasi_wilayah,
    jenis_sektor_koperasi   text,
    urutan_rat              text,
    tahun_buku              smallint,
    tahun_rencana_kerja     smallint,
    tahun_rencana_anggaran  smallint,
    tanggal_rat             date,
    jumlah_peserta_rat      integer,
    status_rat              text,
    tahap_rat               text,
    laporan_posisi_keuangan text,
    laporan_hasil_usaha     text,
    rapb_posisi_keuangan    text,
    rapb_hasil_usaha        text,
    dibuat_pada             timestamp,
    diperbarui_pada         timestamp
);

alter table rat_koperasi
    owner to hackathon_2026;

grant select on rat_koperasi to hackathon_kemenkop_2026;

grant select on rat_koperasi to hackathon_participant_2026;

create table anggota_koperasi
(
    anggota_ref        text not null
        constraint pk_anggota_koperasi_4fe6109d
            primary key
        constraint uq_anggota_koperasi_anggota_ref
            unique,
    koperasi_ref       text not null
        constraint fk_anggota_koperasi_koperasi_ref_b8176ae0
            references referensi_koperasi_wilayah,
    nama               text,
    nik                text,
    kode_wilayah       text
        constraint fk_anggota_koperasi_kode_wilayah_96a41cef
            references referensi_wilayah,
    jenis_kelamin      text,
    status_keanggotaan text,
    tanggal_terdaftar  date,
    dibuat_pada        timestamp,
    diperbarui_pada    timestamp,
    file_ktp           text,
    status_akun        text,
    pekerjaan          text
);

alter table anggota_koperasi
    owner to hackathon_2026;

create table simpanan_anggota
(
    simpanan_ref       text not null
        constraint pk_simpanan_anggota_a226bf54
            primary key,
    koperasi_ref       text not null
        constraint fk_simpanan_anggota_koperasi_ref_c7fd2f70
            references referensi_koperasi_wilayah,
    anggota_ref        text not null
        constraint fk_simpanan_anggota_anggota_koperasi
            references anggota_koperasi
            on update cascade on delete restrict,
    periode_pembayaran text,
    jumlah_simpanan    numeric,
    status             text,
    dibuat_pada        timestamp,
    dibayar_pada       timestamp
);

alter table simpanan_anggota
    owner to hackathon_2026;

grant select on simpanan_anggota to hackathon_kemenkop_2026;

grant select on simpanan_anggota to hackathon_participant_2026;

grant select on anggota_koperasi to hackathon_kemenkop_2026;

grant select on anggota_koperasi to hackathon_participant_2026;

create table barang_keluar_produk
(
    __row_id            integer not null
        constraint pk_barang_keluar_produk_d5471b08
            primary key,
    transaksi_sample_id text    not null
        constraint fk_barang_keluar_produk_transaksi_sample_id_05bcac05
            references transaksi_penjualan,
    produk_sample_id    text    not null
        constraint fk_barang_keluar_produk_produk_sample_id_05348b01
            references produk_koperasi,
    koperasi_ref        text    not null
        constraint fk_barang_keluar_produk_koperasi_ref_6dbc1a6c
            references referensi_koperasi_wilayah,
    kode_barcode        text,
    tanggal_keluar      timestamp,
    status              text,
    nama_produk         text,
    nama_tampilan       text,
    jumlah_keluar       numeric,
    harga               numeric,
    total_nilai         numeric,
    status_transaksi    text,
    dibuat_pada         timestamp,
    diperbarui_pada     timestamp
);

alter table barang_keluar_produk
    owner to hackathon_2026;

grant select on barang_keluar_produk to hackathon_kemenkop_2026;

grant select on barang_keluar_produk to hackathon_participant_2026;

create table barang_masuk_produk
(
    barang_masuk_ref text not null
        constraint pk_barang_masuk_produk_018e5056
            primary key,
    produk_sample_id text not null
        constraint fk_barang_masuk_produk_produk_sample_id_491ee0a5
            references produk_koperasi,
    koperasi_ref     text not null
        constraint fk_barang_masuk_produk_koperasi_ref_fbd3b8a5
            references referensi_koperasi_wilayah,
    kode_barcode     text,
    nama_produk      text,
    nama_tampilan    text,
    jumlah_masuk     numeric,
    jumlah_tersedia  numeric,
    harga_beli       numeric,
    harga_jual       numeric,
    total_biaya      numeric,
    keterangan       text,
    status           text,
    tanggal_masuk    timestamp,
    dibuat_pada      timestamp,
    diperbarui_pada  timestamp
);

alter table barang_masuk_produk
    owner to hackathon_2026;

grant select on barang_masuk_produk to hackathon_kemenkop_2026;

grant select on barang_masuk_produk to hackathon_participant_2026;

create table inventaris_produk
(
    inventaris_ref   text not null
        constraint pk_inventaris_produk_5920d0e6
            primary key,
    produk_sample_id text not null
        constraint fk_inventaris_produk_produk_sample_id_e49cff5a
            references produk_koperasi,
    koperasi_ref     text not null
        constraint fk_inventaris_produk_koperasi_ref_934f6014
            references referensi_koperasi_wilayah,
    nama_produk      text,
    stok             numeric,
    dibuat_pada      timestamp,
    diperbarui_pada  timestamp,
    kode_barcode     text
);

alter table inventaris_produk
    owner to hackathon_2026;

grant select on inventaris_produk to hackathon_kemenkop_2026;

grant select on inventaris_produk to hackathon_participant_2026;


