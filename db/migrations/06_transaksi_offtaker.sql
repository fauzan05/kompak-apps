-- Perluas transaksi_kompak untuk deal, bayar simulasi, offtaker
ALTER TABLE transaksi_kompak ADD COLUMN IF NOT EXISTS respon_ref text REFERENCES respon_penawaran (respon_ref);
ALTER TABLE transaksi_kompak ADD COLUMN IF NOT EXISTS arah text DEFAULT 'produsen_koperasi';
ALTER TABLE transaksi_kompak ADD COLUMN IF NOT EXISTS status_deal text DEFAULT 'disepakati';
ALTER TABLE transaksi_kompak ADD COLUMN IF NOT EXISTS status_bayar text DEFAULT 'belum';
ALTER TABLE transaksi_kompak ADD COLUMN IF NOT EXISTS status_kirim text DEFAULT 'dijadwalkan';
ALTER TABLE transaksi_kompak ADD COLUMN IF NOT EXISTS offtaker_ref text;
ALTER TABLE transaksi_kompak ADD COLUMN IF NOT EXISTS rfq_ref text;
ALTER TABLE transaksi_kompak ADD COLUMN IF NOT EXISTS metode_bayar text;
ALTER TABLE transaksi_kompak ADD COLUMN IF NOT EXISTS dibayar_pada timestamp;

UPDATE transaksi_kompak
SET status_kirim = COALESCE(NULLIF(status, ''), 'dijadwalkan')
WHERE status_kirim IS NULL OR status_kirim = 'dijadwalkan';

UPDATE transaksi_kompak SET status_bayar = 'belum' WHERE status_bayar IS NULL;
UPDATE transaksi_kompak SET status_deal = 'disepakati' WHERE status_deal IS NULL;
UPDATE transaksi_kompak SET arah = 'produsen_koperasi' WHERE arah IS NULL;

CREATE TABLE IF NOT EXISTS offtaker (
    offtaker_ref   text NOT NULL PRIMARY KEY,
    nama           text NOT NULL,
    perusahaan     text,
    telepon        text,
    dibuat_pada    timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stok_surplus_koperasi (
    surplus_ref    text NOT NULL PRIMARY KEY,
    koperasi_ref   text NOT NULL REFERENCES referensi_koperasi_wilayah (koperasi_ref),
    nama_komoditas text NOT NULL,
    jumlah         numeric NOT NULL,
    satuan         text DEFAULT 'kg',
    harga          numeric,
    status         text DEFAULT 'aktif',
    dibuat_pada    timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rfq_offtaker (
    rfq_ref        text NOT NULL PRIMARY KEY,
    offtaker_ref   text NOT NULL REFERENCES offtaker (offtaker_ref),
    koperasi_ref   text NOT NULL REFERENCES referensi_koperasi_wilayah (koperasi_ref),
    surplus_ref    text REFERENCES stok_surplus_koperasi (surplus_ref),
    nama_komoditas text NOT NULL,
    jumlah         numeric NOT NULL,
    satuan         text DEFAULT 'kg',
    catatan        text,
    status         text DEFAULT 'diajukan',
    dibuat_pada    timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_surplus_koperasi ON stok_surplus_koperasi (koperasi_ref);
CREATE INDEX IF NOT EXISTS idx_rfq_koperasi ON rfq_offtaker (koperasi_ref);
CREATE INDEX IF NOT EXISTS idx_rfq_offtaker ON rfq_offtaker (offtaker_ref);

INSERT INTO offtaker (offtaker_ref, nama, perusahaan, telepon)
VALUES ('OFT-DEMO-001', 'PT Nusantara Food', 'Nusantara Food Trading', '021-5550123')
ON CONFLICT (offtaker_ref) DO NOTHING;

INSERT INTO stok_surplus_koperasi (surplus_ref, koperasi_ref, nama_komoditas, jumlah, satuan, harga, status)
SELECT
    'SPL-DEMO-001',
    'KOP-02AFA0134DB2',
    'Gula Aren',
    500,
    'kg',
    17000,
    'aktif'
WHERE EXISTS (SELECT 1 FROM referensi_koperasi_wilayah WHERE koperasi_ref = 'KOP-02AFA0134DB2')
ON CONFLICT (surplus_ref) DO NOTHING;
