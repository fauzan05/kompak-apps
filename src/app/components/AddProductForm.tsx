import { useState } from 'react';
import { Button, ButtonGroup, InputField, TextareaField, SelectField } from './ui';
import { Check, MapPin, Navigation, Camera, Package, User, ChevronRight, ChevronLeft, Sprout } from 'lucide-react';

interface AddProductFormProps {
  onNavigate: (view: string) => void;
}

const steps = [
  { id: 1, label: 'Data Diri', icon: User },
  { id: 2, label: 'Data Produk', icon: Package },
  { id: 3, label: 'Pratinjau', icon: Check },
];

const commodityOptions = [
  { value: 'gula-aren', label: 'Gula Aren' },
  { value: 'gula-semut', label: 'Gula Semut' },
  { value: 'kopi-robusta', label: 'Kopi Robusta' },
  { value: 'kopi-arabika', label: 'Kopi Arabika' },
  { value: 'beras-organik', label: 'Beras Organik' },
  { value: 'madu-hutan', label: 'Madu Hutan' },
  { value: 'sayuran', label: 'Sayuran Segar' },
  { value: 'buah', label: 'Buah-buahan' },
  { value: 'ikan', label: 'Ikan' },
  { value: 'tempe-tahu', label: 'Tempe & Tahu' },
  { value: 'lainnya', label: 'Lainnya' },
];

const unitOptions = [
  { value: 'kg', label: 'kg (kilogram)' },
  { value: 'ton', label: 'ton' },
  { value: 'liter', label: 'liter' },
  { value: 'buah', label: 'buah/pcs' },
  { value: 'ikat', label: 'ikat' },
];

const periodOptions = [
  { value: 'minggu', label: 'Per minggu' },
  { value: 'bulan', label: 'Per bulan' },
  { value: 'musim', label: 'Per musim panen' },
  { value: 'sekali', label: 'Stok tersedia sekali' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)', fontFamily: 'var(--font-body)' }}>
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: isCompleted ? 'var(--kompak-primary)' : isActive ? 'var(--kompak-accent)' : 'var(--kompak-card-bg)', border: `2px solid ${isCompleted ? 'var(--kompak-primary)' : isActive ? 'var(--kompak-accent)' : 'var(--kompak-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                {isCompleted ? <Check size={16} color="#fff" /> : <step.icon size={16} color={isActive ? '#fff' : 'var(--kompak-text-muted)'} />}
              </div>
              <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--kompak-accent)' : isCompleted ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)' }}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ width: '48px', height: '2px', background: isCompleted ? 'var(--kompak-primary)' : 'var(--kompak-border)', margin: '0 8px', marginBottom: '20px', transition: 'background 0.2s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1({ form, onChange }: { form: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', fontFamily: 'var(--font-body)' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>Data Diri</h2>
        <p style={{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginTop: 4 }}>Isi informasi dasar Anda agar koperasi dapat mengenali Anda.</p>
      </div>
      <InputField label="Nama Lengkap" placeholder="Contoh: Pak Budi Santoso" value={form.name} onChange={(v) => onChange('name', v)} />
      <InputField label="Nomor HP / WhatsApp" placeholder="08xx-xxxx-xxxx" value={form.phone} onChange={(v) => onChange('phone', v)} />
      <SelectField
        label="Jenis Entitas"
        options={[{ value: 'individu', label: 'Produsen Individu' }, { value: 'komunitas', label: 'Komunitas RT/RW/Kelurahan' }]}
        value={form.entityType}
        onChange={(v) => onChange('entityType', v)}
      />
      {/* Location picker */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--kompak-text-dark)', marginBottom: 'var(--space-md)' }}>Lokasi Produksi</div>
        <div style={{ background: 'var(--kompak-card-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--kompak-border)', overflow: 'hidden' }}>
          <div style={{ height: '160px', background: 'linear-gradient(160deg, #c8d8b0 0%, #b8cc98 60%, #98b068 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--kompak-accent)', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }} />
              <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '10px solid var(--kompak-accent)', margin: '0 auto', marginTop: '-2px' }} />
            </div>
            <button style={{ position: 'absolute', bottom: 'var(--space-md)', right: 'var(--space-md)', background: 'var(--kompak-surface-white)', border: 'none', borderRadius: 'var(--radius-md)', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: 'var(--shadow-card)' }}>
              <Navigation size={12} color="var(--kompak-primary)" />
              <span style={{ fontSize: '12px', color: 'var(--kompak-primary)', fontWeight: 600 }}>Gunakan GPS</span>
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-lg)' }}>
            <MapPin size={16} color="var(--kompak-accent)" />
            <span style={{ fontSize: '13px', color: 'var(--kompak-text-muted)' }}>{form.location || 'Ketuk peta untuk memilih lokasi produksi'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2({ form, onChange }: { form: Record<string, string>; onChange: (k: string, v: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', fontFamily: 'var(--font-body)' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>Data Produk</h2>
        <p style={{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginTop: 4 }}>Isi informasi produk Anda. Semakin lengkap, semakin cepat diverifikasi.</p>
      </div>
      <SelectField label="Jenis Komoditas" options={commodityOptions} value={form.commodity} onChange={(v) => onChange('commodity', v)} />
      <div style={{ display: 'flex', gap: 'var(--space-xl)' }}>
        <InputField label="Estimasi Jumlah" placeholder="Contoh: 150" value={form.quantity} onChange={(v) => onChange('quantity', v)} style={{ flex: 1 }} />
        <SelectField label="Satuan" options={unitOptions} value={form.unit} onChange={(v) => onChange('unit', v)} className="flex-1" style={{ flex: 1 }} />
      </div>
      <SelectField label="Frekuensi Produksi" options={periodOptions} value={form.period} onChange={(v) => onChange('period', v)} />
      <InputField
        label="Harga (opsional)"
        placeholder="Contoh: 18000"
        value={form.price}
        onChange={(v) => onChange('price', v)}
        prefix={<span style={{ fontSize: '13px', color: 'var(--kompak-text-muted)' }}>Rp</span>}
        suffix={<span style={{ fontSize: '13px', color: 'var(--kompak-text-muted)' }}>/kg</span>}
      />
      <TextareaField label="Keterangan Tambahan (opsional)" placeholder="Contoh: Gula aren murni tanpa campuran, siap jual langsung dari kebun..." value={form.description} rows={3} onChange={(v) => onChange('description', v)} />
      {/* Photo upload */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--kompak-text-dark)', marginBottom: 'var(--space-md)' }}>
          Foto Produk <span style={{ fontWeight: 400, color: 'var(--kompak-text-muted)' }}>(opsional)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-2xl)', border: '2px dashed var(--kompak-border-strong)', borderRadius: 'var(--radius-lg)', background: 'var(--kompak-card-bg)', cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--kompak-surface-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-card)' }}>
            <Camera size={24} color="var(--kompak-secondary)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }}>Unggah Foto Produk</div>
            <div style={{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 2 }}>Foto produk mempercepat proses verifikasi</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3({ form }: { form: Record<string, string> }) {
  const commodityLabel = commodityOptions.find((o) => o.value === form.commodity)?.label || form.commodity;
  const unitLabel = unitOptions.find((o) => o.value === form.unit)?.label || form.unit;
  const periodLabel = periodOptions.find((o) => o.value === form.period)?.label || form.period;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', fontFamily: 'var(--font-body)' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>Pratinjau Etalase</h2>
        <p style={{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginTop: 4 }}>Berikut tampilan produk Anda di peta komoditas setelah dipublikasikan.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-elevated)', border: '1px solid var(--kompak-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--kompak-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sprout size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>{form.name || 'Nama Anda'}</div>
            <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--kompak-pending-bg)', color: 'var(--kompak-pending)', fontSize: '11px', fontWeight: 600 }}>Menunggu Verifikasi</span>
          </div>
        </div>
        {[
          { label: 'Komoditas', value: commodityLabel || '-' },
          { label: 'Kapasitas', value: form.quantity ? `${form.quantity} ${unitLabel} ${periodLabel}` : '-' },
          { label: 'Harga', value: form.price ? `Rp ${form.price}/kg` : 'Belum ditentukan' },
          { label: 'Kontak', value: form.phone || '-' },
          { label: 'Lokasi', value: form.location || 'Desa Ciawi, Kab. Bogor' },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-lg)', borderBottom: '1px solid var(--kompak-border)', paddingBottom: 'var(--space-md)' }}>
            <span style={{ fontSize: '13px', color: 'var(--kompak-text-muted)', flexShrink: 0 }}>{row.label}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--kompak-text-dark)', textAlign: 'right' }}>{row.value}</span>
          </div>
        ))}
        {form.description && (
          <div>
            <div style={{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginBottom: 4 }}>Keterangan</div>
            <div style={{ fontSize: '13px', color: 'var(--kompak-text-dark)', lineHeight: 1.5 }}>{form.description}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-lg)', background: 'var(--kompak-verified-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(44,95,45,0.2)' }}>
        <Check size={16} color="var(--kompak-verified)" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: '13px', color: 'var(--kompak-verified)', lineHeight: 1.5 }}>
          Produk akan tayang di peta dengan status <strong>"Menunggu Verifikasi"</strong> dan akan berubah menjadi <strong>"Terverifikasi"</strong> setelah proses verifikasi selesai.
        </div>
      </div>
    </div>
  );
}

export function AddProductForm({ onNavigate }: AddProductFormProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ name: '', phone: '', entityType: 'individu', location: '', commodity: '', quantity: '', unit: 'kg', period: 'bulan', price: '', description: '' });

  const onChange = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  if (submitted) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xl)', padding: 'var(--space-2xl)', textAlign: 'center', background: 'var(--kompak-canvas)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--kompak-verified-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={40} color="var(--kompak-verified)" strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>Produk Berhasil Didaftarkan!</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--kompak-text-muted)', marginTop: 8, maxWidth: 320 }}>
            Produk Anda sudah tayang di peta komoditas dengan status <strong>Menunggu Verifikasi</strong>. Tim kami akan memverifikasi dalam 1×24 jam.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="neutral" onClick={() => onNavigate('map')}>Lihat di Peta</Button>
          <Button variant="primary" onClick={() => onNavigate('producer-dashboard')}>Ke Dashboard Saya</Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', background: 'var(--kompak-canvas)', fontFamily: 'var(--font-body)' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>Daftarkan Produk Anda</h1>
        <p style={{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginTop: 4 }}>Selesaikan dalam hitungan menit, langsung dari ponsel Anda.</p>
      </div>

      <StepIndicator currentStep={step} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', padding: 'var(--space-xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }}>
        {step === 1 && <Step1 form={form} onChange={onChange} />}
        {step === 2 && <Step2 form={form} onChange={onChange} />}
        {step === 3 && <Step3 form={form} />}
      </div>

      {/* Sticky bottom nav */}
      <div style={{ position: 'sticky', bottom: 0, background: 'var(--kompak-canvas)', paddingTop: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderTop: '1px solid var(--kompak-border)', marginLeft: 'calc(-1 * var(--space-2xl))', marginRight: 'calc(-1 * var(--space-2xl))', paddingLeft: 'var(--space-2xl)', paddingRight: 'var(--space-2xl)' }}>
        <ButtonGroup align={step > 1 ? 'justify' : 'end'}>
          {step > 1 && (
            <Button variant="neutral" iconStart={<ChevronLeft size={16} />} onClick={() => setStep((s) => s - 1)}>Kembali</Button>
          )}
          {step < 3
            ? <Button variant="primary" iconEnd={<ChevronRight size={16} />} onClick={() => setStep((s) => s + 1)}>Lanjut</Button>
            : <Button variant="primary" iconEnd={<Check size={16} />} onClick={() => setSubmitted(true)} style={{ background: 'var(--kompak-accent)' }}>Publikasikan Produk</Button>
          }
        </ButtonGroup>
      </div>
    </div>
  );
}
