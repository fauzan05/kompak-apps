-- Seed produsen & komunitas dari koperasi yang punya koordinat
WITH coop AS (
    SELECT
        p.koperasi_ref,
        p.koordinat_dibulatkan,
        p.status_registrasi,
        r.kode_wilayah,
        w.kab_kota,
        row_number() OVER (ORDER BY p.koperasi_ref) AS rn
    FROM profil_koperasi p
    JOIN referensi_koperasi_wilayah r ON r.koperasi_ref = p.koperasi_ref
    LEFT JOIN referensi_wilayah w ON w.kode_wilayah = r.kode_wilayah
    WHERE p.koordinat_dibulatkan IS NOT NULL
      AND trim(p.koordinat_dibulatkan) <> ''
),
picked AS (
    SELECT * FROM coop WHERE rn <= 400
)
INSERT INTO entitas_komoditas (
    entitas_ref, tipe, nama, koordinat_dibulatkan, kode_wilayah, verified, tentang, telepon, rating, rating_count
)
SELECT
    CASE WHEN rn = 1 THEN 'ENT-DEMO-PRODUCER-001' ELSE 'ENT-' || upper(substr(md5(koperasi_ref || 'ent'), 1, 12)) END,
    CASE WHEN rn % 3 = 0 THEN 'komunitas' ELSE 'produsen' END,
    CASE
        WHEN rn = 1 THEN 'Pak Budi Santoso'
        WHEN rn % 3 = 0 THEN 'Kelompok Tani ' || coalesce(kab_kota, 'Desa') || ' RT ' || ((rn % 12) + 1)::text
        ELSE (ARRAY['Pak Budi', 'Bu Sari', 'Pak Ahmad', 'Bu Ketut', 'Pak Yohanes', 'Pak Rahman', 'Bu Wayan', 'Pak Joko'])[1 + (rn % 8)]
             || ' (' || coalesce(kab_kota, 'Desa') || ')'
    END,
    (trim(split_part(koordinat_dibulatkan, ',', 1))::double precision + ((rn % 20) - 10) * 0.003)::text
        || ', '
        || (trim(split_part(koordinat_dibulatkan, ',', 2))::double precision + ((rn % 17) - 8) * 0.003)::text,
    kode_wilayah,
    status_registrasi = 'Approved',
    CASE WHEN rn % 3 = 0
        THEN 'Kelompok produksi komoditas desa yang terdaftar di KOMPAK.'
        ELSE 'Produsen komoditas lokal yang memasarkan hasil panen ke koperasi terdekat.'
    END,
    '08' || lpad((rn % 100000000)::text, 9, '0'),
    4.0 + (rn % 10) * 0.1,
    10 + (rn % 90)
FROM picked;

-- Penawaran komoditas per entitas
INSERT INTO penawaran_komoditas (penawaran_ref, entitas_ref, nama_komoditas, jumlah, satuan, harga, status)
SELECT
    'PWN-' || upper(substr(md5(e.entitas_ref || 'a'), 1, 12)),
    e.entitas_ref,
    (ARRAY['Gula Aren', 'Kopi', 'Beras Organik', 'Madu', 'Sayuran', 'Buah-buahan', 'Ikan', 'Kakao'])[1 + (row_number() OVER (PARTITION BY e.entitas_ref) % 8)],
    50 + (row_number() OVER () % 20) * 25,
    'kg',
    12000 + (row_number() OVER () % 15) * 1000,
    'aktif'
FROM entitas_komoditas e;

-- Demo penawaran tambahan untuk Pak Budi
INSERT INTO penawaran_komoditas (penawaran_ref, entitas_ref, nama_komoditas, jumlah, satuan, harga, status)
VALUES
    ('PWN-DEMO-GULA', 'ENT-DEMO-PRODUCER-001', 'Gula Aren Murni', 150, 'kg', 18000, 'aktif'),
    ('PWN-DEMO-SEMUT', 'ENT-DEMO-PRODUCER-001', 'Gula Semut Organik', 80, 'kg', 22000, 'aktif')
ON CONFLICT (penawaran_ref) DO NOTHING;

-- Kebutuhan koperasi (~30%)
INSERT INTO kebutuhan_koperasi (kebutuhan_ref, koperasi_ref, nama_komoditas, jumlah, satuan, deadline, status, jumlah_respon)
SELECT
    kebutuhan_ref, koperasi_ref, nama_komoditas, jumlah, satuan, deadline, status, jumlah_respon
FROM (
    SELECT
        'KBT-' || upper(substr(md5(p.koperasi_ref || 'k'), 1, 12)) AS kebutuhan_ref,
        p.koperasi_ref,
        (ARRAY['Gula Aren', 'Kopi', 'Beras Organik', 'Madu', 'Sayuran', 'Buah-buahan', 'Ikan'])[1 + (row_number() OVER (ORDER BY p.koperasi_ref) % 7)] AS nama_komoditas,
        100 + (row_number() OVER (ORDER BY p.koperasi_ref) % 10) * 50 AS jumlah,
        'kg' AS satuan,
        (current_date + (((row_number() OVER (ORDER BY p.koperasi_ref) % 30) + 5)::integer)) AS deadline,
        'aktif' AS status,
        (row_number() OVER (ORDER BY p.koperasi_ref) % 8) AS jumlah_respon,
        row_number() OVER (ORDER BY p.koperasi_ref) AS rn,
        abs(hashtext(p.koperasi_ref)) AS h
    FROM profil_koperasi p
    WHERE p.koordinat_dibulatkan IS NOT NULL
) sub
WHERE (h % 10) < 3
ON CONFLICT (kebutuhan_ref) DO NOTHING;

-- Transaksi KOMPAK sample
INSERT INTO transaksi_kompak (transaksi_ref, entitas_ref, koperasi_ref, nama_komoditas, jumlah, nilai, status, tanggal)
SELECT
    'TXK-' || upper(substr(md5(e.entitas_ref || p.koperasi_ref), 1, 12)),
    e.entitas_ref,
    p.koperasi_ref,
    pk.nama_komoditas,
    pk.jumlah,
    pk.jumlah * coalesce(pk.harga, 15000),
    CASE WHEN row_number() OVER () % 5 = 0 THEN 'diproses' ELSE 'selesai' END,
    current_date - ((row_number() OVER () % 60)::integer)
FROM entitas_komoditas e
JOIN penawaran_komoditas pk ON pk.entitas_ref = e.entitas_ref
JOIN profil_koperasi p ON p.koordinat_dibulatkan IS NOT NULL
WHERE e.entitas_ref = 'ENT-DEMO-PRODUCER-001'
   OR (abs(hashtext(e.entitas_ref || p.koperasi_ref)) % 40) = 0
LIMIT 120;

-- Demo offtaker & stok surplus
INSERT INTO offtaker (offtaker_ref, nama, perusahaan, telepon)
VALUES ('OFT-DEMO-001', 'PT Nusantara Food', 'Nusantara Food Trading', '021-5550123')
ON CONFLICT (offtaker_ref) DO NOTHING;

INSERT INTO stok_surplus_koperasi (surplus_ref, koperasi_ref, nama_komoditas, jumlah, satuan, harga, status)
VALUES ('SPL-DEMO-001', 'KOP-02AFA0134DB2', 'Gula Aren', 500, 'kg', 17000, 'aktif')
ON CONFLICT (surplus_ref) DO NOTHING;
