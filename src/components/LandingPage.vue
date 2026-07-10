<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-vue-next'
import Reveal from '@/components/Reveal.vue'

const emit = defineEmits<{ navigate: [view: string] }>()

const hoveredStat = ref<number | null>(null)

const stats = [
  { value: '12.480', label: 'Produsen Terdaftar', sub: 'individu & komunitas' },
  { value: '847', label: 'Koperasi Aktif', sub: 'di 34 provinsi' },
  { value: 'Rp 4,2M', label: 'Nilai Transaksi', sub: 'bulan berjalan' },
  { value: '63', label: 'Komoditas', sub: 'terpetakan secara real-time' },
]

const features = [
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
]

const personas = [
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
]

const testimonialMetrics = [
  { label: 'Waktu pencarian pasokan', before: '3 hari', after: '30 menit' },
  { label: 'Biaya operasional', before: 'Tinggi', after: 'Hemat 40%' },
]

const phases = [
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
]
</script>

<template>
  <div
    style="
      flex: 1;
      overflow-y: auto;
      font-family: var(--font-body);
      background: var(--kompak-canvas);
      scrollbar-width: none;
    "
  >
    <!-- ═══════════════════════════════════════════════
        HERO — full bleed, split canvas
    ═══════════════════════════════════════════════ -->
    <section
      class="hero-grid"
      style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        min-height: 92vh;
        background: var(--kompak-primary-dark);
        position: relative;
        overflow: hidden;
      "
    >
      <!-- Left — editorial text -->
      <div
        class="hero-text"
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 56px;
          position: relative;
          z-index: 2;
        "
      >
        <!-- Top wordmark -->
        <div style="display: flex; align-items: center; justify-content: space-between">
          <div style="display: flex; align-items: center; gap: 10px">
            <div
              style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--kompak-accent);
              "
            />
            <span
              style="
                font-family: var(--font-body);
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.9);
              "
            >
              KOMPAK Apps
            </span>
          </div>
          <span
            style="
              font-family: var(--font-body);
              font-size: 11px;
              color: rgba(255,255,255,0.35);
              letter-spacing: 0.06em;
            "
          >
            Kemenkop RI × PEBS FEB UI
          </span>
        </div>

        <!-- Main headline -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding-top: 40px; padding-bottom: 40px">
          <div
            style="
              font-family: var(--font-heading);
              font-size: clamp(48px, 5.5vw, 80px);
              font-weight: 700;
              line-height: 1.05;
              color: #FFFFFF;
              letter-spacing: -0.02em;
              margin-bottom: 32px;
            "
          >
            Satu Irama,<br />
            <span style="color: var(--kompak-accent)">Satu Data.</span>
          </div>

          <div
            style="
              font-family: var(--font-body);
              font-size: 16px;
              line-height: 1.7;
              color: rgba(255,255,255,0.6);
              max-width: 380px;
              margin-bottom: 40px;
            "
          >
            Platform geospasial dua arah yang menghubungkan
            produsen komoditas desa langsung dengan Koperasi
            Merah Putih — tanpa perantara, tanpa batas jarak.
          </div>

          <!-- CTA row -->
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap">
            <button
              style="
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 14px 28px;
                background: var(--kompak-accent);
                color: #fff;
                border: none;
                border-radius: 2px;
                font-family: var(--font-body);
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                letter-spacing: 0.02em;
                transition: opacity 0.2s;
              "
              @click="emit('navigate', 'map')"
              @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')"
              @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')"
            >
              Buka Peta Komoditas
              <ArrowRight :size="15" />
            </button>

            <button
              style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 14px 0;
                background: transparent;
                color: rgba(255,255,255,0.55);
                border: none;
                font-family: var(--font-body);
                font-size: 14px;
                cursor: pointer;
                border-bottom: 1px solid rgba(255,255,255,0.2);
                transition: color 0.2s, border-color 0.2s;
              "
              @click="emit('navigate', 'add-product')"
              @mouseenter="(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)';
              }"
              @mouseleave="(e) => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
              }"
            >
              Daftar sebagai Produsen
            </button>
          </div>
        </div>

        <!-- Bottom label -->
        <div
          style="
            font-family: var(--font-body);
            font-size: 11px;
            color: rgba(255,255,255,0.25);
            letter-spacing: 0.08em;
          "
        >
          Hackathon Digital Cooperatives Expo 2026 — Tema 2 · Pilar 3
        </div>
      </div>

      <!-- Right — full-bleed photograph -->
      <div class="hero-photo" style="position: relative; overflow: hidden">
        <div
          style="
            position: absolute;
            inset: 0;
            background: var(--kompak-primary-dark);
          "
        />
        <img
          src="https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=900&h=1100&fit=crop&auto=format"
          alt="Sawah bertingkat di desa Indonesia"
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.75;
            mix-blend-mode: luminosity;
          "
        />
        <!-- Gradient overlay left edge -->
        <div
          style="
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, var(--kompak-primary-dark) 0%, transparent 30%);
          "
        />
        <!-- Caption -->
        <div
          style="
            position: absolute;
            bottom: 48px;
            right: 40px;
            font-family: var(--font-body);
            font-size: 10px;
            color: rgba(255,255,255,0.3);
            letter-spacing: 0.06em;
            writing-mode: vertical-rl;
          "
        >
          Sawah Desa · Nusantara
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════
        IMPACT NUMBERS — typographic, no cards
    ═══════════════════════════════════════════════ -->
    <section style="background: var(--kompak-canvas); padding: 0 56px">
      <div style="height: 1px; background: var(--kompak-border)" />
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--kompak-border)">
        <Reveal
          v-for="(stat, i) in stats"
          :key="stat.label"
          :delay="i * 80"
        >
          <div
            style="
              padding: 48px 0 40px;
              padding-right: 32px;
              cursor: default;
              transition: background 0.2s;
            "
            :style="{
              borderRight: i < 3 ? '1px solid var(--kompak-border)' : 'none',
              paddingLeft: i > 0 ? '32px' : '0',
              background: hoveredStat === i ? 'rgba(44,95,45,0.04)' : 'transparent',
            }"
            @mouseenter="hoveredStat = i"
            @mouseleave="hoveredStat = null"
          >
            <div
              style="
                font-family: var(--font-heading);
                font-size: clamp(40px, 3.5vw, 56px);
                font-weight: 700;
                line-height: 1;
                letter-spacing: -0.03em;
                margin-bottom: 12px;
                transition: color 0.2s;
              "
              :style="{ color: hoveredStat === i ? 'var(--kompak-primary)' : 'var(--kompak-text-dark)' }"
            >
              {{ stat.value }}
            </div>
            <div style="font-family: var(--font-body); font-size: 13px; font-weight: 600; color: var(--kompak-text-dark); margin-bottom: 4px">
              {{ stat.label }}
            </div>
            <div style="font-family: var(--font-body); font-size: 12px; color: var(--kompak-text-muted)">
              {{ stat.sub }}
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════
        MANIFESTO — bold editorial statement
    ═══════════════════════════════════════════════ -->
    <section
      style="
        padding: 96px 56px;
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 64px;
        align-items: start;
      "
    >
      <Reveal>
        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px">
          <div style="width: 20px; height: 1px; background: var(--kompak-accent)" />
          <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--kompak-accent)">
            Tentang KOMPAK
          </span>
        </div>
        <p style="font-family: var(--font-body); font-size: 13px; color: var(--kompak-text-muted); line-height: 1.8; max-width: 220px">
          Dirancang untuk menghapus celah antara produsen desa dan ekosistem koperasi yang ada.
        </p>
      </Reveal>
      <Reveal :delay="120">
        <p
          style="
            font-family: var(--font-heading);
            font-size: clamp(28px, 3vw, 44px);
            font-weight: 700;
            line-height: 1.25;
            letter-spacing: -0.02em;
            color: var(--kompak-text-dark);
            max-width: 680px;
          "
        >
          Produsen desa sudah ada. Koperasi sudah ada.
          Yang hilang adalah
          <span style="color: var(--kompak-primary); font-style: italic">
            jembatan yang tepat
          </span>
          di antara keduanya.
        </p>
      </Reveal>
    </section>

    <!-- ═══════════════════════════════════════════════
        FEATURE FLOW — editorial numbered, not card grid
    ═══════════════════════════════════════════════ -->
    <section style="background: var(--kompak-primary-dark); padding: 96px 56px">
      <Reveal>
        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px">
          <div style="width: 20px; height: 1px; background: var(--kompak-accent)" />
          <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--kompak-accent)">
            Cara Kerja Platform
          </span>
        </div>
      </Reveal>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0; margin-top: 48px">
        <Reveal
          v-for="(item, i) in features"
          :key="item.num"
          :delay="i * 60"
        >
          <div
            style="
              border-top: 1px solid rgba(255,255,255,0.1);
              padding: 48px;
              display: grid;
              grid-template-rows: auto 1fr auto;
              gap: 24px;
              min-height: 420px;
              position: relative;
              overflow: hidden;
              transition: background 0.3s;
              cursor: default;
            "
            :style="{ borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }"
            @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')"
          >
            <!-- Number -->
            <div
              style="
                font-family: var(--font-heading);
                font-size: 13px;
                font-weight: 700;
                color: var(--kompak-accent);
                letter-spacing: 0.1em;
              "
            >
              {{ item.num }}
            </div>

            <!-- Content -->
            <div>
              <h3
                style="
                  font-family: var(--font-heading);
                  font-size: 24px;
                  font-weight: 700;
                  color: #fff;
                  line-height: 1.2;
                  margin-bottom: 16px;
                  letter-spacing: -0.01em;
                "
              >
                {{ item.title }}
              </h3>
              <p
                style="
                  font-family: var(--font-body);
                  font-size: 14px;
                  color: rgba(255,255,255,0.55);
                  line-height: 1.75;
                  max-width: 340px;
                "
              >
                {{ item.body }}
              </p>
            </div>

            <!-- Image -->
            <div
              style="
                height: 160px;
                border-radius: 2px;
                overflow: hidden;
                background: rgba(255,255,255,0.05);
              "
            >
              <img
                :src="item.img"
                :alt="item.title"
                style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6; transition: opacity 0.4s"
                @mouseenter="(e) => ((e.currentTarget as HTMLImageElement).style.opacity = '0.85')"
                @mouseleave="(e) => ((e.currentTarget as HTMLImageElement).style.opacity = '0.6')"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════
        PERSONA PATHS — horizontal editorial list
    ═══════════════════════════════════════════════ -->
    <section style="padding: 96px 56px">
      <Reveal>
        <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; flex-wrap: wrap; gap: 24px">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px">
              <div style="width: 20px; height: 1px; background: var(--kompak-accent)" />
              <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--kompak-accent)">
                Untuk Siapa
              </span>
            </div>
            <h2
              style="
                font-family: var(--font-heading);
                font-size: clamp(28px, 3vw, 42px);
                font-weight: 700;
                color: var(--kompak-text-dark);
                letter-spacing: -0.02em;
                line-height: 1.15;
              "
            >
              Ekosistem yang terhubung,<br />bukan silo yang terisolir.
            </h2>
          </div>
          <button
            style="
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: none;
              border: none;
              font-family: var(--font-body);
              font-size: 13px;
              font-weight: 600;
              color: var(--kompak-primary);
              cursor: pointer;
              padding: 0;
              text-decoration: underline;
              text-underline-offset: 4px;
            "
            @click="emit('navigate', 'map')"
          >
            Lihat peta <ArrowUpRight :size="14" />
          </button>
        </div>
      </Reveal>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr)">
        <Reveal
          v-for="(p, i) in personas"
          :key="p.role"
          :delay="i * 80"
        >
          <div
            style="
              padding: 48px;
              border-top: 1px solid var(--kompak-border);
              cursor: pointer;
              display: flex;
              flex-direction: column;
              gap: 20px;
              min-height: 280px;
              transition: background 0.2s;
            "
            :style="{ borderRight: i < 2 ? '1px solid var(--kompak-border)' : 'none' }"
            @click="emit('navigate', p.action)"
            @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--kompak-surface-white)')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')"
          >
            <!-- Accent line -->
            <div :style="{ width: '32px', height: '3px', background: p.accent, borderRadius: '2px' }" />

            <div style="flex: 1">
              <h3
                style="
                  font-family: var(--font-heading);
                  font-size: 20px;
                  font-weight: 700;
                  color: var(--kompak-text-dark);
                  margin-bottom: 12px;
                  letter-spacing: -0.01em;
                "
              >
                {{ p.role }}
              </h3>
              <p
                style="
                  font-family: var(--font-body);
                  font-size: 14px;
                  color: var(--kompak-text-muted);
                  line-height: 1.7;
                "
              >
                {{ p.desc }}
              </p>
            </div>

            <div
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: p.accent,
              }"
            >
              {{ p.cta }}
              <ArrowRight :size="13" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════
        TESTIMONIAL — single large editorial quote
    ═══════════════════════════════════════════════ -->
    <section
      style="
        background: var(--kompak-surface-white);
        padding: 96px 56px;
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 64px;
        align-items: center;
      "
    >
      <Reveal>
        <div>
          <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px">
            <div style="width: 20px; height: 1px; background: var(--kompak-accent)" />
            <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--kompak-accent)">
              Dari Lapangan
            </span>
          </div>
          <div
            style="
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: var(--kompak-primary);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 16px;
            "
          >
            <span style="font-family: var(--font-body); font-size: 16px; font-weight: 700; color: #fff">SR</span>
          </div>
          <div style="font-family: var(--font-body); font-size: 14px; font-weight: 600; color: var(--kompak-text-dark)">
            Ibu Sari Rahayu
          </div>
          <div style="font-family: var(--font-body); font-size: 12px; color: var(--kompak-text-muted); margin-top: 4px">
            Pengurus KMP Harapan Bersama<br />Kab. Bogor, Jawa Barat
          </div>
        </div>
      </Reveal>

      <Reveal :delay="100">
        <div
          style="
            font-family: var(--font-heading);
            font-size: clamp(22px, 2.5vw, 34px);
            font-weight: 700;
            line-height: 1.35;
            color: var(--kompak-text-dark);
            letter-spacing: -0.02em;
            position: relative;
          "
        >
          <span
            style="
              position: absolute;
              top: -20px;
              left: -8px;
              font-family: var(--font-heading);
              font-size: 80px;
              color: var(--kompak-accent);
              opacity: 0.18;
              line-height: 1;
              user-select: none;
            "
          >
            "
          </span>
          Pencarian pasokan yang tadinya butuh 3 hari dan
          puluhan telepon, sekarang cukup 30 menit lewat peta.
          Kami bisa fokus ke kualitas produk, bukan ke logistik pencarian.
        </div>
        <div style="height: 1px; background: var(--kompak-border); margin-top: 32px" />
        <div
          style="
            margin-top: 24px;
            display: flex;
            gap: 48px;
          "
        >
          <div
            v-for="item in testimonialMetrics"
            :key="item.label"
          >
            <div style="font-family: var(--font-body); font-size: 11px; color: var(--kompak-text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.08em">
              {{ item.label }}
            </div>
            <div style="display: flex; align-items: center; gap: 10px">
              <span style="font-family: var(--font-body); font-size: 13px; color: var(--kompak-text-muted); text-decoration: line-through">{{ item.before }}</span>
              <ArrowRight :size="12" color="var(--kompak-accent)" />
              <span style="font-family: var(--font-body); font-size: 14px; font-weight: 700; color: var(--kompak-primary)">{{ item.after }}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>

    <!-- ═══════════════════════════════════════════════
        PHASE ROADMAP — horizontal timeline
    ═══════════════════════════════════════════════ -->
    <section style="padding: 96px 56px; background: var(--kompak-canvas)">
      <Reveal>
        <div style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px">
          <div style="width: 20px; height: 1px; background: var(--kompak-accent)" />
          <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--kompak-accent)">
            Peta Jalan
          </span>
        </div>
        <h2
          style="
            font-family: var(--font-heading);
            font-size: clamp(28px, 2.8vw, 40px);
            font-weight: 700;
            color: var(--kompak-text-dark);
            letter-spacing: -0.02em;
            margin-bottom: 56px;
            max-width: 480px;
            line-height: 1.2;
          "
        >
          Dari desa percontohan<br />ke skala nasional.
        </h2>
      </Reveal>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--kompak-border)">
        <Reveal
          v-for="(phase, i) in phases"
          :key="phase.phase"
          :delay="i * 80"
        >
          <div
            style="padding: 40px 40px 40px 0"
            :style="{
              paddingLeft: i > 0 ? '40px' : '0',
              borderRight: i < 2 ? '1px solid var(--kompak-border)' : 'none',
            }"
          >
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px">
              <div
                :style="{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: phase.active ? phase.color : 'var(--kompak-border)',
                  border: phase.active ? 'none' : '2px solid var(--kompak-border)',
                  boxShadow: phase.active ? `0 0 0 3px ${phase.color}20` : 'none',
                }"
              />
              <span
                :style="{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: phase.active ? phase.color : 'var(--kompak-text-muted)',
                }"
              >
                {{ phase.phase }}
              </span>
              <span
                v-if="phase.active"
                :style="{
                  padding: '2px 8px',
                  background: `${phase.color}15`,
                  borderRadius: '2px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  fontWeight: 600,
                  color: phase.color,
                  letterSpacing: '0.05em',
                }"
              >
                Berjalan
              </span>
            </div>
            <h3
              :style="{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: 700,
                color: phase.active ? 'var(--kompak-text-dark)' : 'var(--kompak-text-muted)',
                marginBottom: '20px',
                letterSpacing: '-0.01em',
              }"
            >
              {{ phase.label }}
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px">
              <li
                v-for="phaseItem in phase.items"
                :key="phaseItem"
                :style="{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: phase.active ? 'var(--kompak-text-dark)' : 'var(--kompak-text-muted)',
                }"
              >
                <span
                  :style="{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: phase.active ? phase.color : 'var(--kompak-border)',
                    flexShrink: 0,
                    marginTop: '6px',
                  }"
                />
                {{ phaseItem }}
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════
        CTA FINAL — minimal, confident
    ═══════════════════════════════════════════════ -->
    <section
      style="
        background: var(--kompak-primary-dark);
        padding: 96px 56px;
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 64px;
      "
    >
      <Reveal>
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px">
            <MapPin :size="14" color="var(--kompak-accent)" />
            <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--kompak-accent)">
              Mulai Sekarang
            </span>
          </div>
          <h2
            style="
              font-family: var(--font-heading);
              font-size: clamp(32px, 3.5vw, 52px);
              font-weight: 700;
              color: #fff;
              line-height: 1.1;
              letter-spacing: -0.02em;
              max-width: 560px;
            "
          >
            Petakan potensi desa Anda hari ini.
          </h2>
        </div>
      </Reveal>

      <Reveal :delay="100">
        <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-end">
          <button
            style="
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 16px 32px;
              background: var(--kompak-accent);
              color: #fff;
              border: none;
              border-radius: 2px;
              font-family: var(--font-body);
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              white-space: nowrap;
              transition: opacity 0.2s;
            "
            @click="emit('navigate', 'map')"
            @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')"
          >
            Buka Peta Komoditas
            <ArrowRight :size="15" />
          </button>
          <button
            style="
              background: transparent;
              border: none;
              font-family: var(--font-body);
              font-size: 13px;
              color: rgba(255,255,255,0.4);
              cursor: pointer;
              padding: 4px 0;
              border-bottom: 1px solid rgba(255,255,255,0.15);
              transition: color 0.2s;
            "
            @click="emit('navigate', 'add-product')"
            @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')"
          >
            Daftar sebagai Produsen
          </button>
        </div>
      </Reveal>
    </section>

    <!-- ═══════════════════════════════════════════════
        FOOTER — minimal
    ═══════════════════════════════════════════════ -->
    <footer
      style="
        background: var(--kompak-primary-dark);
        border-top: 1px solid rgba(255,255,255,0.08);
        padding: 24px 56px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
      "
    >
      <div style="display: flex; align-items: center; gap: 8px">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: var(--kompak-accent)" />
        <span style="font-family: var(--font-body); font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.5)">
          KOMPAK Apps
        </span>
      </div>
      <span style="font-family: var(--font-body); font-size: 11px; color: rgba(255,255,255,0.25)">
        Hackathon Digital Cooperatives Expo 2026 · Tema 2 · Pilar 3 · Kemenkop RI × PEBS FEB UI
      </span>
    </footer>
  </div>
</template>

<style>
@media (max-width: 700px) {
  .hero-grid {
    grid-template-columns: 1fr !important;
  }
  .hero-photo {
    display: none !important;
  }
  .hero-text {
    padding: 32px 24px !important;
    min-height: 90vh;
  }
}

@media (max-width: 900px) {
  section {
    padding-left: 24px !important;
    padding-right: 24px !important;
  }
}

@media (max-width: 700px) {
  section[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
  section[style*="grid-template-columns: repeat(4"] {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  section[style*="grid-template-columns: repeat(3"] {
    grid-template-columns: 1fr !important;
  }
  section[style*="grid-template-columns: 1fr 2fr"] {
    grid-template-columns: 1fr !important;
  }
  section[style*="grid-template-columns: 1fr auto"] {
    grid-template-columns: 1fr !important;
  }
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
