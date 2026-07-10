import { useState } from 'react';
import { Button, Tabs } from './ui';
import { Sprout, Users, MapPin, Plus, Bell, Clock, ChevronRight, Package, Truck, CheckCircle, AlertCircle, Filter, Handshake } from 'lucide-react';

interface CoopDashboardProps {
  onNavigate: (view: string, data?: unknown) => void;
}

const activeNeeds = [
  { id: 'n1', commodity: 'Gula Aren', qty: '500 kg', deadline: '20 Jul 2026', responses: 4, status: 'aktif', daysLeft: 10 },
  { id: 'n2', commodity: 'Kopi Robusta', qty: '200 kg', deadline: '5 Agu 2026', responses: 2, status: 'aktif', daysLeft: 26 },
];

const producers = [
  { id: 'p1', name: 'Pak Budi Santoso', type: 'produsen', commodity: 'Gula Aren', qty: '150 kg tersedia', distance: '2.1 km', verified: true, matchScore: 94, price: 'Rp 18.000/kg' },
  { id: 'p2', name: 'Kelompok Tani RT 05', type: 'komunitas', commodity: 'Gula Aren', qty: '300 kg/bulan', distance: '5.2 km', verified: true, matchScore: 87, price: 'Rp 17.500/kg' },
  { id: 'p3', name: 'Bu Sari Wahyuni', type: 'produsen', commodity: 'Gula Aren', qty: '80 kg tersedia', distance: '6.8 km', verified: false, matchScore: 72, price: 'Rp 18.500/kg' },
];

const orders = [
  { id: 'o1', supplier: 'Pak Budi Santoso', commodity: 'Gula Aren', qty: '200 kg', status: 'dalam-perjalanan', date: '28 Jun 2026' },
  { id: 'o2', supplier: 'Kelompok Tani RT 05', commodity: 'Sayuran Segar', qty: '150 kg', status: 'dijadwalkan', date: '15 Jul 2026' },
  { id: 'o3', supplier: 'Bu Aminah', commodity: 'Kopi Robusta', qty: '100 kg', status: 'selesai', date: '10 Jun 2026' },
];

const orderStatusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  'dalam-perjalanan': { label: 'Dalam Perjalanan', color: 'var(--kompak-secondary)', bg: 'rgba(110,139,61,0.12)', icon: Truck },
  dijadwalkan: { label: 'Dijadwalkan', color: 'var(--kompak-accent)', bg: 'var(--kompak-pending-bg)', icon: Clock },
  selesai: { label: 'Selesai', color: 'var(--kompak-verified)', bg: 'var(--kompak-verified-bg)', icon: CheckCircle },
};

export function CoopDashboard({ onNavigate }: CoopDashboardProps) {
  const [needsList, setNeedsList] = useState(activeNeeds);

  const kebutuhanTab = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <span style={{ fontSize: '13px', color: 'var(--kompak-text-muted)' }}>{needsList.length} pengumuman aktif</span>
        <Button variant="primary" size="small" iconStart={<Plus size={14} />}>Buat Pengumuman</Button>
      </div>

      {needsList.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)', padding: 'var(--space-2xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <Bell size={32} color="var(--kompak-text-muted)" />
          <div style={{ fontSize: '14px', color: 'var(--kompak-text-muted)' }}>Belum ada pengumuman aktif</div>
        </div>
      ) : needsList.map((need) => (
        <div key={need.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--kompak-border)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--kompak-card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Package size={20} color="var(--kompak-primary)" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--kompak-text-dark)' }}>{need.commodity}</div>
                <div style={{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 2 }}>Dibutuhkan: {need.qty}</div>
              </div>
            </div>
            <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--kompak-verified-bg)', color: 'var(--kompak-verified)', fontSize: '11px', fontWeight: 600 }}>Aktif</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xl)' }}>
            {[
              { label: 'Batas Waktu', value: need.deadline, icon: Clock, color: 'var(--kompak-accent)' },
              { label: 'Sisa Waktu', value: `${need.daysLeft} hari`, icon: null, color: 'var(--kompak-accent)' },
              { label: 'Respons Produsen', value: `${need.responses} produsen`, icon: Bell, color: 'var(--kompak-primary)' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: '11px', color: 'var(--kompak-text-muted)' }}>{item.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginTop: 4 }}>
                  {item.icon && <item.icon size={12} color={item.color} />}
                  <span style={{ fontSize: '13px', fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <Button variant="neutral" size="small" onClick={() => setNeedsList((prev) => prev.filter((n) => n.id !== need.id))} style={{ flex: 1 }}>Tutup Pengumuman</Button>
            <Button variant="primary" size="small" iconEnd={<ChevronRight size={14} />} style={{ flex: 1 }}>Lihat Respons</Button>
          </div>
        </div>
      ))}
    </div>
  );

  const pasokanTab = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flex: 1, background: 'var(--kompak-card-bg)', border: '1px solid var(--kompak-border)', borderRadius: 'var(--radius-full)', padding: '8px 16px', minWidth: '180px' }}>
          <Filter size={14} color="var(--kompak-text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--kompak-text-muted)' }}>Gula Aren · 10 km</span>
        </div>
        <Button variant="neutral" size="small" iconStart={<Filter size={14} />}>Filter</Button>
      </div>
      {producers.map((p) => {
        const isKomunitas = p.type === 'komunitas';
        const pinColor = isKomunitas ? 'var(--kompak-pin-community)' : 'var(--kompak-pin-producer)';
        return (
          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--kompak-border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <div style={{ width: 40, height: 40, borderRadius: isKomunitas ? '10px' : '50%', background: pinColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isKomunitas ? <Users size={20} color="#fff" /> : <Sprout size={20} color="#fff" />}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginTop: 4 }}>
                    <MapPin size={11} color="var(--kompak-text-muted)" />
                    <span style={{ fontSize: '12px', color: 'var(--kompak-text-muted)' }}>{p.distance}</span>
                    {p.verified ? <CheckCircle size={11} color="var(--kompak-verified)" /> : <AlertCircle size={11} color="var(--kompak-pending)" />}
                  </div>
                </div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(110,139,61,0.12)', fontSize: '12px', fontWeight: 600, color: 'var(--kompak-secondary)', flexShrink: 0 }}>
                {p.matchScore}% cocok
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
              {[{ label: 'Komoditas', value: p.commodity }, { label: 'Stok', value: p.qty }, { label: 'Harga', value: p.price }].map((item) => (
                <div key={item.label} style={{ flex: 1, minWidth: '90px', background: 'var(--kompak-card-bg)', borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--kompak-text-muted)' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--kompak-text-dark)', marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <Button variant="neutral" size="small" onClick={() => onNavigate('entity-detail', { type: p.type, name: p.name })} style={{ flex: 1 }}>Lihat Etalase</Button>
              <Button variant="primary" size="small" iconEnd={<Truck size={14} />} style={{ flex: 1 }}>Jadwalkan Pickup</Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const pesananTab = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {orders.map((order) => {
        const cfg = orderStatusConfig[order.status];
        return (
          <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', padding: 'var(--space-lg)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--kompak-border)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <cfg.icon size={20} color={cfg.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }}>{order.supplier}</div>
              <div style={{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 2 }}>{order.commodity} · {order.qty}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-xs)' }}>
              <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: cfg.bg, color: cfg.color, fontSize: '11px', fontWeight: 600 }}>{cfg.label}</span>
              <span style={{ fontSize: '11px', color: 'var(--kompak-text-light)' }}>{order.date}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', background: 'var(--kompak-canvas)', fontFamily: 'var(--font-body)' }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>Dashboard Koperasi</h1>
        <p style={{ fontSize: '14px', color: 'var(--kompak-text-muted)', marginTop: 'var(--space-xs)' }}>KMP Mekar Bersama · Kab. Bogor · Terverifikasi</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gap: 'var(--space-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
        {[
          { label: 'Kebutuhan Aktif', value: '2', icon: Bell, color: 'var(--kompak-accent)' },
          { label: 'Pesanan Berjalan', value: '1', icon: Truck, color: 'var(--kompak-secondary)' },
          { label: 'Produsen Tersedia', value: '12', icon: Sprout, color: 'var(--kompak-primary)' },
          { label: 'Transaksi Bulan Ini', value: '5', icon: Handshake, color: 'var(--kompak-primary)' },
        ].map((stat) => (
          <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={18} color={stat.color} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700, color: 'var(--kompak-text-dark)' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 2 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <Tabs
          tabs={[
            { id: 'kebutuhan', label: 'Kebutuhan Aktif', content: <div style={{ padding: 'var(--space-xl)' }}>{kebutuhanTab}</div> },
            { id: 'pasokan', label: 'Cari Pasokan', content: <div style={{ padding: 'var(--space-xl)' }}>{pasokanTab}</div> },
            { id: 'pesanan', label: 'Pelacakan Pesanan', content: <div style={{ padding: 'var(--space-xl)' }}>{pesananTab}</div> },
          ]}
          defaultTab="kebutuhan"
        />
      </div>
    </div>
  );
}
