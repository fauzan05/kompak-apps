import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

/* ── Scroll-reveal hook ─────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Hairline divider ───────────────────────────────────────────── */
function Rule({ style }: { style?: React.CSSProperties }) {
  return <div style={{ height: '1px', background: 'var(--kompak-border)', ...style }} />;
}

/* ── Nav label chip ─────────────────────────────────────────────── */
function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
      <div style={{ width: '20px', height: '1px', background: 'var(--kompak-accent)' }} />
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--kompak-accent)' }}>
        {children}
      </span>
    </div>
  );
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        fontFamily: 'var(--font-body)',
        background: 'var(--kompak-canvas)',
        scrollbarWidth: 'none',
      }}
    >
      {/* ═══════════════════════════════════════════════
          HERO — full bleed, split canvas
      ═══════════════════════════════════════════════ */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '92vh',
          background: 'var(--kompak-primary-dark)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Left — editorial text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px 56px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Top wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--kompak-accent)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                KOMPAK Apps
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.06em',
              }}
            >
              Kemenkop RI × PEBS FEB UI
            </span>
          </div>

          {/* Main headline */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '40px', paddingBottom: '40px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(48px, 5.5vw, 80px)',
                fontWeight: 700,
                lineHeight: 1.05,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '32px',
              }}
            >
              Satu Irama,<br />
              <span style={{ color: 'var(--kompak-accent)' }}>Satu Data.</span>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '380px',
                marginBottom: '40px',
              }}
            >
              Platform geospasial dua arah yang menghubungkan
              produsen komoditas desa langsung dengan Koperasi
              Merah Putih — tanpa perantara, tanpa batas jarak.
            </div>

            {/* CTA row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('map')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  background: 'var(--kompak-accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                Buka Peta Komoditas
                <ArrowRight size={15} />
              </button>

              <button
                onClick={() => onNavigate('add-product')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '14px 0',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.55)',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                }}
              >
                Daftar sebagai Produsen
              </button>
            </div>
          </div>

          {/* Bottom label */}
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.08em',
            }}
          >
            Hackathon Digital Cooperatives Expo 2026 — Tema 2 · Pilar 3
          </div>
        </div>

        {/* Right — full-bleed photograph */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--kompak-primary-dark)',
            }}
          />
          <img
            src="https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=900&h=1100&fit=crop&auto=format"
            alt="Sawah bertingkat di desa Indonesia"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.75,
              mixBlendMode: 'luminosity',
            }}
          />
          {/* Gradient overlay left edge */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, var(--kompak-primary-dark) 0%, transparent 30%)',
            }}
          />
          {/* Caption */}
          <div
            style={{
              position: 'absolute',
              bottom: '48px',
              right: '40px',
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.06em',
              writingMode: 'vertical-rl',
            }}
          >
            Sawah Desa · Nusantara
          </div>
        </div>

        {/* Mobile overlay fallback */}
        <style>{`
          @media (max-width: 700px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-photo { display: none !important; }
            .hero-text { padding: 32px 24px !important; min-height: 90vh; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════════════
          IMPACT NUMBERS — typographic, no cards
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--kompak-canvas)', padding: '0 56px' }}>
        <Rule />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--kompak-border)' }}>
          {[
            { value: '12.480', label: 'Produsen Terdaftar', sub: 'individu & komunitas' },
            { value: '847', label: 'Koperasi Aktif', sub: 'di 34 provinsi' },
            { value: 'Rp 4,2M', label: 'Nilai Transaksi', sub: 'bulan berjalan' },
            { value: '63', label: 'Komoditas', sub: 'terpetakan secara real-time' },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div
                style={{
                  padding: '48px 0 40px',
                  paddingRight: '32px',
                  borderRight: i < 3 ? '1px solid var(--kompak-border)' : 'none',
                  paddingLeft: i > 0 ? '32px' : '0',
                  cursor: 'default',
                  transition: 'background 0.2s',
                  background: hoveredStat === i ? 'rgba(44,95,45,0.04)' : 'transparent',
                }}
                onMouseEnter={() => setHoveredStat(i)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(40px, 3.5vw, 56px)',
                    fontWeight: 700,
                    color: hoveredStat === i ? 'var(--kompak-primary)' : 'var(--kompak-text-dark)',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    marginBottom: '12px',
                    transition: 'color 0.2s',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--kompak-text-dark)', marginBottom: '4px' }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--kompak-text-muted)' }}>
                  {stat.sub}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MANIFESTO — bold editorial statement
      ═══════════════════════════════════════════════ */}
      <section
        style={{
          padding: '96px 56px',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '64px',
          alignItems: 'start',
        }}
      >
        <Reveal>
          <EyebrowLabel>Tentang KOMPAK</EyebrowLabel>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--kompak-text-muted)', lineHeight: 1.8, maxWidth: '220px' }}>
            Dirancang untuk menghapus celah antara produsen desa dan ekosistem koperasi yang ada.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 3vw, 44px)',
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              color: 'var(--kompak-text-dark)',
              maxWidth: '680px',
            }}
          >
            Produsen desa sudah ada. Koperasi sudah ada.
            Yang hilang adalah{' '}
            <span
              style={{
                color: 'var(--kompak-primary)',
                fontStyle: 'italic',
              }}
            >
              jembatan yang tepat
            </span>{' '}
            di antara keduanya.
          </p>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURE FLOW — editorial numbered, not card grid
      ═══════════════════════════════════════════════ */}
      <section style={{ background: 'var(--kompak-primary-dark)', padding: '96px 56px' }}>
        <Reveal>
          <EyebrowLabel>Cara Kerja Platform</EyebrowLabel>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginTop: '48px' }}>
          {[
            {
              num: '01',
              title: 'Peta Komoditas Dua Arah',
              body: 'Produsen dan koperasi saling terlihat di peta interaktif berbasis lokasi. Tidak ada lagi pencarian manual, tidak ada lagi tengkulak sebagai perantara.',
              img: 'https://images.unsplash.com/photo-1559628233-eb1b1a45564b?w=700&h=500&fit=crop&auto=format',
            },
            {
              num: '02',
              title: 'Pendaftaran Mandiri dalam Menit',
              body: 'Produsen daftarkan produk dari ponsel — jenis komoditas, estimasi kapasitas, foto. Sistem langsung menayangkan ke peta dengan status verifikasi transparan.',
              img: 'https://images.unsplash.com/photo-1572402123736-c79526db405a?w=700&h=500&fit=crop&auto=format',
            },
            {
              num: '03',
              title: 'Rekomendasi Proaktif',
              body: 'Algoritme pencocokan berbasis jarak, histori transaksi, dan kebutuhan aktif koperasi secara otomatis menyarankan pasangan terbaik ke kedua pihak.',
              img: 'https://images.unsplash.com/photo-1628870773515-121c2b0c584f?w=700&h=500&fit=crop&auto=format',
            },
            {
              num: '04',
              title: 'Pelacakan & Distribusi',
              body: 'Dari penawaran hingga pickup armada Koperasi Merah Putih, seluruh alur transaksi terlacak dalam satu platform — real-time dan tanpa kertas.',
              img: 'https://images.unsplash.com/photo-1560761098-21f5722ecb14?w=700&h=500&fit=crop&auto=format',
            },
          ].map((item, i) => (
            <Reveal key={item.num} delay={i * 60}>
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  padding: '48px',
                  display: 'grid',
                  gridTemplateRows: 'auto 1fr auto',
                  gap: '24px',
                  minHeight: '420px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'background 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                {/* Number */}
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--kompak-accent)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {item.num}
                </div>

                {/* Content */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1.2,
                      marginBottom: '16px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.75,
                      maxWidth: '340px',
                    }}
                  >
                    {item.body}
                  </p>
                </div>

                {/* Image */}
                <div
                  style={{
                    height: '160px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, transition: 'opacity 0.4s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = '0.85')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = '0.6')}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PERSONA PATHS — horizontal editorial list
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '96px 56px' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <EyebrowLabel>Untuk Siapa</EyebrowLabel>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 3vw, 42px)',
                  fontWeight: 700,
                  color: 'var(--kompak-text-dark)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                Ekosistem yang terhubung,<br />bukan silo yang terisolir.
              </h2>
            </div>
            <button
              onClick={() => onNavigate('map')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--kompak-primary)',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              }}
            >
              Lihat peta <ArrowUpRight size={14} />
            </button>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            {
              role: 'Produsen Individu',
              desc: 'Pak Budi tidak perlu menunggu tengkulak. Daftarkan gula arennya hari ini, koperasi terdekat menghubungi besok.',
              action: 'add-product',
              cta: 'Daftar sebagai Produsen',
              accent: 'var(--kompak-secondary)',
            },
            {
              role: 'Komunitas RT/RW',
              desc: 'Potensi produksi kelompok yang selama ini tidak tercatat kini bisa tampil di peta sebagai satu entitas.',
              action: 'add-product',
              cta: 'Daftar Komunitas',
              accent: 'var(--kompak-primary)',
            },
            {
              role: 'Pengurus Koperasi',
              desc: 'Cari pasokan terdekat sesuai kebutuhan aktif. Jadwalkan pickup armada langsung dari dashboard.',
              action: 'coop-dashboard',
              cta: 'Masuk sebagai Koperasi',
              accent: 'var(--kompak-accent)',
            },
          ].map((p, i) => (
            <Reveal key={p.role} delay={i * 80}>
              <div
                onClick={() => onNavigate(p.action)}
                style={{
                  padding: '48px',
                  borderRight: i < 2 ? '1px solid var(--kompak-border)' : 'none',
                  borderTop: '1px solid var(--kompak-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  minHeight: '280px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--kompak-surface-white)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                {/* Accent line */}
                <div style={{ width: '32px', height: '3px', background: p.accent, borderRadius: '2px' }} />

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: 'var(--kompak-text-dark)',
                      marginBottom: '12px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {p.role}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: 'var(--kompak-text-muted)',
                      lineHeight: 1.7,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: p.accent,
                  }}
                >
                  {p.cta}
                  <ArrowRight size={13} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIAL — single large editorial quote
      ═══════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--kompak-surface-white)',
          padding: '96px 56px',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        <Reveal>
          <div>
            <EyebrowLabel>Dari Lapangan</EyebrowLabel>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--kompak-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 700, color: '#fff' }}>SR</span>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }}>
              Ibu Sari Rahayu
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: '4px' }}>
              Pengurus KMP Harapan Bersama<br />Kab. Bogor, Jawa Barat
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(22px, 2.5vw, 34px)',
              fontWeight: 700,
              lineHeight: 1.35,
              color: 'var(--kompak-text-dark)',
              letterSpacing: '-0.02em',
              position: 'relative',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-8px',
                fontFamily: 'var(--font-heading)',
                fontSize: '80px',
                color: 'var(--kompak-accent)',
                opacity: 0.18,
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              "
            </span>
            Pencarian pasokan yang tadinya butuh 3 hari dan
            puluhan telepon, sekarang cukup 30 menit lewat peta.
            Kami bisa fokus ke kualitas produk, bukan ke logistik pencarian.
          </div>
          <Rule style={{ marginTop: '32px' }} />
          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              gap: '48px',
            }}
          >
            {[
              { label: 'Waktu pencarian pasokan', before: '3 hari', after: '30 menit' },
              { label: 'Biaya operasional', before: 'Tinggi', after: 'Hemat 40%' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--kompak-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {item.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--kompak-text-muted)', textDecoration: 'line-through' }}>{item.before}</span>
                  <ArrowRight size={12} color="var(--kompak-accent)" />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700, color: 'var(--kompak-primary)' }}>{item.after}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════
          PHASE ROADMAP — horizontal timeline
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: '96px 56px', background: 'var(--kompak-canvas)' }}>
        <Reveal>
          <EyebrowLabel>Peta Jalan</EyebrowLabel>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(28px, 2.8vw, 40px)',
              fontWeight: 700,
              color: 'var(--kompak-text-dark)',
              letterSpacing: '-0.02em',
              marginBottom: '56px',
              maxWidth: '480px',
              lineHeight: 1.2,
            }}
          >
            Dari desa percontohan<br />ke skala nasional.
          </h2>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--kompak-border)' }}>
          {[
            {
              phase: 'Fase 1',
              label: 'MVP · Validasi',
              color: 'var(--kompak-primary)',
              active: true,
              items: ['Peta komoditas dasar', 'Pendaftaran produk mandiri', 'Etalase digital', 'Pencarian pasokan manual'],
            },
            {
              phase: 'Fase 2',
              label: 'Ekspansi',
              color: 'var(--kompak-secondary)',
              active: false,
              items: ['Rekomendasi AI (rule-based)', 'Pengumuman kebutuhan', 'Tracking pesanan', 'Rekomendasi nilai tambah'],
            },
            {
              phase: 'Fase 3',
              label: 'Skala Nasional',
              color: 'var(--kompak-accent)',
              active: false,
              items: ['Smart Village Analytics', 'Surplus ke offtaker', 'Model ML lanjutan', 'Integrasi nasional'],
            },
          ].map((phase, i) => (
            <Reveal key={phase.phase} delay={i * 80}>
              <div
                style={{
                  padding: '40px 40px 40px 0',
                  paddingLeft: i > 0 ? '40px' : '0',
                  borderRight: i < 2 ? '1px solid var(--kompak-border)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: phase.active ? phase.color : 'var(--kompak-border)',
                      border: phase.active ? 'none' : '2px solid var(--kompak-border)',
                      boxShadow: phase.active ? `0 0 0 3px ${phase.color}20` : 'none',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: phase.active ? phase.color : 'var(--kompak-text-muted)',
                    }}
                  >
                    {phase.phase}
                  </span>
                  {phase.active && (
                    <span
                      style={{
                        padding: '2px 8px',
                        background: `${phase.color}15`,
                        borderRadius: '2px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: phase.color,
                        letterSpacing: '0.05em',
                      }}
                    >
                      Berjalan
                    </span>
                  )}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: phase.active ? 'var(--kompak-text-dark)' : 'var(--kompak-text-muted)',
                    marginBottom: '20px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {phase.label}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: phase.active ? 'var(--kompak-text-dark)' : 'var(--kompak-text-muted)',
                      }}
                    >
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: phase.active ? phase.color : 'var(--kompak-border)', flexShrink: 0, marginTop: '6px' }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA FINAL — minimal, confident
      ═══════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--kompak-primary-dark)',
          padding: '96px 56px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: '64px',
        }}
      >
        <Reveal>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <MapPin size={14} color="var(--kompak-accent)" />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--kompak-accent)' }}>
                Mulai Sekarang
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 3.5vw, 52px)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '560px',
              }}
            >
              Petakan potensi desa Anda hari ini.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
            <button
              onClick={() => onNavigate('map')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 32px',
                background: 'var(--kompak-accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '2px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              Buka Peta Komoditas
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('add-product')}
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: '4px 0',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
            >
              Daftar sebagai Produsen
            </button>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER — minimal
      ═══════════════════════════════════════════════ */}
      <footer
        style={{
          background: 'var(--kompak-primary-dark)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '24px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--kompak-accent)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
            KOMPAK Apps
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.25)' }}>
          Hackathon Digital Cooperatives Expo 2026 · Tema 2 · Pilar 3 · Kemenkop RI × PEBS FEB UI
        </span>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
        }
        @media (max-width: 700px) {
          section[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          section[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          section[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          section[style*="grid-template-columns: 1fr 2fr"] { grid-template-columns: 1fr !important; }
          section[style*="grid-template-columns: 1fr auto"] { grid-template-columns: 1fr !important; }
        }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
    </div>
  );
}
