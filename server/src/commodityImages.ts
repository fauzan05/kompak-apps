type ImageSize = 'thumb' | 'card'

const SIZE_PARAMS: Record<ImageSize, string> = {
  thumb: 'w=200&h=200&fit=crop&auto=format',
  card: 'w=400&h=280&fit=crop&auto=format',
}

/** Unsplash photo IDs — verified used elsewhere in KOMPAK UI */
const PHOTOS = {
  gula: 'photo-1658043186384-7add63d278fd',
  kopi: 'photo-1447933601403-0c6688de566e',
  beras: 'photo-1586201375761-83865001e31c',
  madu: 'photo-1587049352851-8d4e89133924',
  sayur: 'photo-1540420773420-3366772f4999',
  buah: 'photo-1619566636858-adf3ef46400b',
  ikan: 'photo-1507991426709-5bbee2c6a189',
  kakao: 'photo-1515694590185-73647ba02c10',
  rempah: 'photo-1596040033229-a9821ebd058d',
  default: 'photo-1557844352-761f2565b576',
} as const

const RULES: { keywords: string[]; photo: keyof typeof PHOTOS }[] = [
  { keywords: ['gula', 'aren', 'semut'], photo: 'gula' },
  { keywords: ['kopi', 'coffee'], photo: 'kopi' },
  { keywords: ['beras', 'padi'], photo: 'beras' },
  { keywords: ['madu'], photo: 'madu' },
  { keywords: ['sayur', 'sayuran'], photo: 'sayur' },
  { keywords: ['buah'], photo: 'buah' },
  { keywords: ['ikan'], photo: 'ikan' },
  { keywords: ['kakao', 'coklat', 'cocoa'], photo: 'kakao' },
  { keywords: ['rempah', 'cengkeh', 'pala', 'kayu manis'], photo: 'rempah' },
]

function withSize(photoId: string, size: ImageSize): string {
  return `https://images.unsplash.com/${photoId}?${SIZE_PARAMS[size]}`
}

export function commodityImage(name: string, size: ImageSize = 'thumb'): string {
  const n = (name || '').toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => n.includes(kw))) {
      return withSize(PHOTOS[rule.photo], size)
    }
  }
  return withSize(PHOTOS.default, size)
}
