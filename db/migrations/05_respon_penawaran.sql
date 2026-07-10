-- Migrasi: tabel respons penawaran (ajukan penawaran dua arah)
CREATE TABLE IF NOT EXISTS respon_penawaran (
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

CREATE INDEX IF NOT EXISTS idx_respon_penawaran_kebutuhan ON respon_penawaran (kebutuhan_ref);
CREATE INDEX IF NOT EXISTS idx_respon_penawaran_koperasi ON respon_penawaran (koperasi_ref);
