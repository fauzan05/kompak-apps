CREATE TABLE entitas_komoditas (
    entitas_ref          text NOT NULL PRIMARY KEY,
    tipe                 text NOT NULL CHECK (tipe IN ('produsen', 'komunitas')),
    nama                 text,
    koordinat_dibulatkan text,
    kode_wilayah         text REFERENCES referensi_wilayah (kode_wilayah),
    verified             boolean DEFAULT false,
    tentang              text,
    telepon              text,
    rating               numeric(3, 1) DEFAULT 4.5,
    rating_count         integer DEFAULT 0,
    dibuat_pada          timestamp DEFAULT now(),
    diperbarui_pada      timestamp DEFAULT now()
);

CREATE TABLE penawaran_komoditas (
    penawaran_ref   text NOT NULL PRIMARY KEY,
    entitas_ref     text NOT NULL REFERENCES entitas_komoditas (entitas_ref),
    nama_komoditas  text NOT NULL,
    jumlah          numeric,
    satuan          text DEFAULT 'kg',
    harga           numeric,
    status          text DEFAULT 'aktif',
    dibuat_pada     timestamp DEFAULT now(),
    diperbarui_pada timestamp DEFAULT now()
);

CREATE TABLE kebutuhan_koperasi (
    kebutuhan_ref   text NOT NULL PRIMARY KEY,
    koperasi_ref    text NOT NULL REFERENCES referensi_koperasi_wilayah (koperasi_ref),
    nama_komoditas  text NOT NULL,
    jumlah          numeric,
    satuan          text DEFAULT 'kg',
    deadline        date,
    status          text DEFAULT 'aktif',
    jumlah_respon   integer DEFAULT 0,
    dibuat_pada     timestamp DEFAULT now(),
    diperbarui_pada timestamp DEFAULT now()
);

CREATE TABLE transaksi_kompak (
    transaksi_ref   text NOT NULL PRIMARY KEY,
    entitas_ref     text REFERENCES entitas_komoditas (entitas_ref),
    koperasi_ref    text REFERENCES referensi_koperasi_wilayah (koperasi_ref),
    nama_komoditas  text,
    jumlah          numeric,
    nilai           numeric,
    status          text DEFAULT 'selesai',
    tanggal         date,
    dibuat_pada     timestamp DEFAULT now()
);

CREATE TABLE respon_penawaran (
    respon_ref      text NOT NULL PRIMARY KEY,
    arah            text NOT NULL CHECK (arah IN ('produsen_ke_koperasi', 'koperasi_ke_produsen')),
    entitas_ref     text NOT NULL REFERENCES entitas_komoditas (entitas_ref),
    koperasi_ref    text NOT NULL REFERENCES referensi_koperasi_wilayah (koperasi_ref),
    kebutuhan_ref   text REFERENCES kebutuhan_koperasi (kebutuhan_ref),
    nama_komoditas  text NOT NULL,
    jumlah          numeric NOT NULL,
    satuan          text DEFAULT 'kg',
    harga           numeric,
    catatan         text,
    status          text DEFAULT 'diajukan',
    dibuat_pada     timestamp DEFAULT now(),
    diperbarui_pada timestamp DEFAULT now()
);

CREATE INDEX idx_entitas_komoditas_tipe ON entitas_komoditas (tipe);
CREATE INDEX idx_penawaran_entitas ON penawaran_komoditas (entitas_ref);
CREATE INDEX idx_kebutuhan_koperasi_ref ON kebutuhan_koperasi (koperasi_ref);
CREATE INDEX idx_transaksi_kompak_entitas ON transaksi_kompak (entitas_ref);
CREATE INDEX idx_respon_penawaran_kebutuhan ON respon_penawaran (kebutuhan_ref);
CREATE INDEX idx_respon_penawaran_koperasi ON respon_penawaran (koperasi_ref);
