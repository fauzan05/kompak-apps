-- RFQ offtaker ke produsen (selain koperasi)
ALTER TABLE rfq_offtaker ALTER COLUMN koperasi_ref DROP NOT NULL;

ALTER TABLE rfq_offtaker
  ADD COLUMN IF NOT EXISTS entitas_ref text REFERENCES entitas_komoditas (entitas_ref);

ALTER TABLE rfq_offtaker
  ADD COLUMN IF NOT EXISTS penawaran_ref text REFERENCES penawaran_komoditas (penawaran_ref);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rfq_offtaker_target_check'
  ) THEN
    ALTER TABLE rfq_offtaker
      ADD CONSTRAINT rfq_offtaker_target_check
      CHECK (koperasi_ref IS NOT NULL OR entitas_ref IS NOT NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_rfq_entitas ON rfq_offtaker (entitas_ref);
