-- Foto produk yang diunggah produsen
ALTER TABLE penawaran_komoditas ADD COLUMN IF NOT EXISTS foto_url text;
