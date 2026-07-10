import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui';
import {
  Sprout, Store, Users, MapPin, ShieldCheck, AlertCircle, Phone, ChevronLeft,
  Handshake, Zap, TrendingUp, Star, Clock, Package, MessageCircle, Calendar, Leaf
} from 'lucide-react';

interface EntityLike {
  type?: string;
  name?: string;
  lat?: number;
  lng?: number;
  city?: string;
  distance?: string;
  verified?: boolean;
  commodities?: string[];
}

interface EntityDetailProps {
  entity?: EntityLike | null;
  onNavigate: (view: string) => void;
}

// ── Commodity → product photography ─────────────────────────────────
const PHOTOS: Record<string, string> = {
  'gula aren': 'https://images.unsplash.com/photo-1658043186384-7add63d278fd?w=800&h=800&fit=crop&auto=format',
  kopi: 'https://images.unsplash.com/photo-1515694590185-73647ba02c10?w=800&h=800&fit=crop&auto=format',
  beras: 'https://images.unsplash.com/photo-1635562985686-4f8bb9c0d3bf?w=800&h=800&fit=crop&auto=format',
  sayur: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=800&fit=crop&auto=format',
  buah: 'https://images.unsplash.com/photo-1641573260130-74d81b179809?w=800&h=800&fit=crop&auto=format',
  madu: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&h=800&fit=crop&auto=format',
  ikan: 'https://images.unsplash.com/photo-1507991426709-5bbee2c6a189?w=800&h=800&fit=crop&auto=format',
  default: 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=800&h=800&fit=crop&auto=format',
};
const GALLERY = [
  'https://images.unsplash.com/photo-1722962883780-8806c3ab546b?w=600&h=600&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1485637701894-09ad422f6de6?w=600&h=600&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&h=600&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1651981350249-6173caeeb660?w=600&h=600&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1611214774777-3d997a9d0e35?w=600&h=600&fit=crop&auto=format',
];
const HERO_COVER = 'https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=1600&h=600&fit=crop&auto=format';

function photoFor(name: string): string {
  const n = name.toLowerCase();
  const key = Object.keys(PHOTOS).find((k) => k !== 'default' && n.includes(k));
  return PHOTOS[key || 'default'];
}

// ── Fallback sample data (used when entity has no rich fields) ───────
const producerData = {
  location: 'Desa Ciawi, Kab. Bogor, Jawa Barat',
  phone: '0812-3456-7890',
  rating: 4.8,
  ratingCount: 23,
  transactions: 47,
  about: 'Produsen gula aren generasi ketiga yang menjaga kualitas nira dari pohon aren pilihan. Diolah tradisional tanpa pengawet, dipanen setiap pagi.',
  commodities: [
    { name: 'Gula Aren Murni', qty: '150 kg tersedia', price: 'Rp 18.000/kg' },
    { name: 'Gula Semut Organik', qty: '80 kg tersedia', price: 'Rp 22.000/kg' },
  ],
  recentTx: [
    { party: 'KMP Mekar Bersama', date: '5 Jun 2026', qty: '200 kg' },
    { party: 'Kop. Desa Harapan', date: '15 Mei 2026', qty: '100 kg' },
    { party: 'KMP Harapan Baru', date: '2 Apr 2026', qty: '150 kg' },
  ],
  addedValue: [
    'Gula aren dapat diolah menjadi gula semut (granular) — nilai jual meningkat 25%',
    'Pengemasan vakum meningkatkan masa simpan dan daya tarik ke pembeli luar kota',
  ],
};
const coopData = {
  location: 'Kel. Mekarjaya, Kec. Bogor Selatan, Kota Bogor',
  phone: '0821-9876-5432',
  rating: 4.9,
  ratingCount: 68,
  transactions: 312,
  about: 'Koperasi Merah Putih yang menyerap komoditas unggulan desa dengan harga tangan pertama. Menyediakan armada pickup dan pembayaran transparan.',
  commodities: [
    { name: 'Gula Aren', qty: 'Butuh 500 kg', price: 'Penawaran terbuka' },
    { name: 'Kopi Robusta', qty: 'Butuh 200 kg', price: 'Penawaran terbuka' },
  ],
  recentTx: [
    { party: 'Pak Budi Santoso', date: '5 Jun 2026', qty: '200 kg Gula Aren' },
    { party: 'Kelompok Tani RT 05', date: '18 Mei 2026', qty: '150 kg Sayuran' },
    { party: 'Bu Aminah', date: '3 Apr 2026', qty: '100 kg Kopi' },
  ],
  addedValue: [] as string[],
};

function MiniMapFix() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700, color: 'var(--kompak-text-dark)', letterSpacing: '-0.01em', marginBottom: 'var(--space-lg)' }}>
      {children}
    </h2>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--kompak-border)', padding: 'var(--space-2xl)', ...style }}>
      {children}
    </div>
  );
}

export function EntityDetail({ entity, onNavigate }: EntityDetailProps) {
  const isKoperasi = entity?.type === 'koperasi';
  const isKomunitas = entity?.type === 'komunitas';
  const base = isKoperasi ? coopData : producerData;
  const Icon = isKoperasi ? Store : isKomunitas ? Users : Sprout;
  const pinColor = isKoperasi ? 'var(--kompak-pin-coop)' : isKomunitas ? 'var(--kompak-pin-community)' : 'var(--kompak-pin-producer)';
  const typeLabel = isKoperasi ? 'Koperasi' : isKomunitas ? 'Komunitas / Kelompok' : 'Produsen Individu';

  const name = entity?.name || (isKoperasi ? 'KMP Mekar Bersama' : 'Pak Budi Santoso');
  const lat = entity?.lat ?? -6.60;
  const lng = entity?.lng ?? 106.80;
  const location = entity?.city ? `${entity.city}, Indonesia` : base.location;
  const distance = entity?.distance || '2.1 km';
  const verified = entity?.verified ?? true;

  // Build product list — prefer entity commodities, enrich with price/qty
  const products = (entity?.commodities && entity.commodities.length
    ? entity.commodities.map((c) => ({
        name: c,
        qty: isKoperasi ? `Butuh ${100 + (c.length % 4) * 100} kg` : `${50 + (c.length % 5) * 40} kg tersedia`,
        price: isKoperasi ? 'Penawaran terbuka' : `Rp ${(12 + (c.length % 8))}.000/kg`,
      }))
    : base.commodities);

  const stats = [
    { label: 'Transaksi', value: `${base.transactions}+` },
    { label: 'Rating', value: `${base.rating}` },
    { label: 'Ulasan', value: `${base.ratingCount}` },
  ];

  const markerIcon = L.divIcon({
    className: 'kompak-marker',
    iconSize: [28, 36], iconAnchor: [14, 36],
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
      <div style="width:26px;height:26px;border-radius:${isKoperasi ? '8px' : '50%'};background:${isKoperasi ? '#0F595E' : isKomunitas ? '#8CAE3E' : '#C48A2A'};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);"></div>
      <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:8px solid ${isKoperasi ? '#0F595E' : isKomunitas ? '#8CAE3E' : '#C48A2A'};margin-top:-1px;"></div>
    </div>`,
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--kompak-canvas)', fontFamily: 'var(--font-body)' }}>
      {/* ── HERO ────────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
        <img src={HERO_COVER} alt={`Kebun ${name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,68,72,0.45) 0%, rgba(11,68,72,0.55) 40%, rgba(11,68,72,0.92) 100%)' }} />

        <button
          onClick={() => onNavigate('map')}
          style={{ position: 'absolute', top: 'var(--space-xl)', left: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 'var(--radius-full)', padding: '8px 14px', cursor: 'pointer' }}
        >
          <ChevronLeft size={15} color="#fff" />
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>Kembali ke Peta</span>
        </button>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--space-2xl)', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <div style={{ width: 84, height: 84, borderRadius: isKoperasi ? '18px' : '50%', background: pinColor, border: '3px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--shadow-elevated)' }}>
              <Icon size={40} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-md)' }}>
                {typeLabel}
              </span>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '34px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                  <MapPin size={13} /> {location} · {distance}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
                  <Star size={13} fill="#fff" color="#fff" /> {base.rating} ({base.ratingCount})
                </span>
                {verified
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '13px', color: '#fff', fontWeight: 600 }}><ShieldCheck size={14} /> Terverifikasi</span>
                  : <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '13px', color: 'var(--kompak-accent)', fontWeight: 600 }}><AlertCircle size={14} /> Menunggu Verifikasi</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY ACTION BAR ───────────────────────────── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--kompak-surface-white)', boxShadow: 'var(--shadow-card)', borderBottom: '1px solid var(--kompak-border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'var(--space-lg) var(--space-2xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2xl)', flex: 1, overflowX: 'auto' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 700, color: 'var(--kompak-text-dark)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--kompak-text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <Button variant="neutral" size="small" iconStart={<Phone size={15} />}>Hubungi</Button>
          <Button variant="primary" size="small" iconStart={<Handshake size={15} />} style={{ background: 'var(--kompak-accent)' }}>Ajukan Penawaran</Button>
        </div>
      </div>

      {/* ── BODY GRID ───────────────────────────────────── */}
      <div className="detail-grid" style={{ maxWidth: '1100px', margin: '0 auto', padding: 'var(--space-2xl)', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-2xl)', alignItems: 'start' }}>
        {/* MAIN COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          {/* Products */}
          <div>
            <SectionTitle>{isKoperasi ? 'Komoditas yang Dibutuhkan' : 'Produk Tersedia'}</SectionTitle>
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xl)' }}>
              {products.map((p, i) => (
                <div key={i} style={{ background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', border: '1px solid var(--kompak-border)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--kompak-card-bg)' }}>
                    <img src={photoFor(p.name)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 'var(--space-md)', left: 'var(--space-md)', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', borderRadius: 'var(--radius-full)', padding: '3px 10px', fontSize: '12px', fontWeight: 600, color: 'var(--kompak-primary)' }}>{p.price}</span>
                  </div>
                  <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', flex: 1 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--kompak-text-dark)' }}>{p.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 4 }}>
                        <Package size={12} /> {p.qty}
                      </div>
                    </div>
                    <Button variant="neutral" size="small" style={{ width: '100%' }}>{isKoperasi ? 'Tawarkan Pasokan' : 'Ajukan Penawaran'}</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div>
            <SectionTitle>Galeri Kebun & Panen</SectionTitle>
            <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)' }}>
              {GALLERY.map((src, i) => (
                <div key={i} style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--kompak-card-bg)' }}>
                  <img src={src} alt={`Dokumentasi panen ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={(e: any) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e: any) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <Leaf size={18} color="var(--kompak-secondary)" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>Tentang</h2>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--kompak-text-muted)' }}>{base.about}</p>
          </Card>

          {/* Added value */}
          {!isKoperasi && base.addedValue.length > 0 && (
            <Card style={{ border: '1px solid rgba(196,138,42,0.3)', background: 'var(--kompak-pending-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <Zap size={18} color="var(--kompak-pending)" />
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>Rekomendasi Nilai Tambah</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {base.addedValue.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-lg)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(196,138,42,0.2)' }}>
                    <TrendingUp size={15} color="var(--kompak-pending)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: '13px', color: 'var(--kompak-text-dark)', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Transactions */}
          <Card>
            <SectionTitle>Riwayat Transaksi</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {base.recentTx.map((tx, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', padding: 'var(--space-md) 0', borderBottom: i < base.recentTx.length - 1 ? '1px solid var(--kompak-border)' : 'none' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--kompak-verified-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Handshake size={18} color="var(--kompak-verified)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }}>{tx.party}</div>
                    <div style={{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 1 }}>{tx.qty}</div>
                  </div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--kompak-text-light)' }}>
                    <Clock size={12} /> {tx.date}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', position: 'sticky', top: '88px' }}>
          {/* Location + map */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '200px', background: 'var(--kompak-card-bg)' }}>
              <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} dragging={false} zoomControl={false} doubleClickZoom={false} style={{ width: '100%', height: '100%' }}>
                <MiniMapFix />
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                <Marker position={[lat, lng]} icon={markerIcon} />
              </MapContainer>
            </div>
            <div style={{ padding: 'var(--space-xl)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--kompak-text-dark)', marginBottom: 'var(--space-md)' }}>Lokasi</h2>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                <MapPin size={15} color="var(--kompak-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '13px', color: 'var(--kompak-text-dark)', lineHeight: 1.5 }}>{location}</span>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card style={{ padding: 'var(--space-xl)' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--kompak-text-dark)', marginBottom: 'var(--space-lg)' }}>Kontak</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', fontSize: '13px', color: 'var(--kompak-text-dark)' }}>
                <Phone size={15} color="var(--kompak-primary)" /> {base.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', fontSize: '13px', color: 'var(--kompak-text-dark)' }}>
                <Calendar size={15} color="var(--kompak-primary)" /> Aktif · Senin–Sabtu
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <Button variant="primary" iconStart={<Handshake size={15} />} style={{ width: '100%', background: 'var(--kompak-accent)' }}>Ajukan Penawaran</Button>
              <Button variant="neutral" iconStart={<MessageCircle size={15} />} style={{ width: '100%' }}>Kirim Pesan</Button>
            </div>
          </Card>

          {/* Rating */}
          <Card style={{ padding: 'var(--space-xl)', display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '40px', fontWeight: 700, color: 'var(--kompak-text-dark)', lineHeight: 1 }}>{base.rating}</div>
            <div>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={15} color="var(--kompak-accent)" fill={s <= Math.round(base.rating) ? 'var(--kompak-accent)' : 'none'} />
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 4 }}>dari {base.ratingCount} ulasan</div>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
          .detail-grid > div:last-child { position: static !important; }
        }
        @media (max-width: 560px) {
          .product-grid { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
