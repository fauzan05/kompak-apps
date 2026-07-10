export interface MapPin {
  id: string
  type: string
  name: string
  commodities: string[]
  verified: boolean
  lat: number
  lng: number
  distance: string
  stock: string
  city: string
}

export interface LandingStat {
  value: string
  label: string
  sub: string
}

export interface KomoditasItem {
  name: string
  count: string
  img: string
}

export interface ProducerCard {
  id: string
  type?: string
  name: string
  commodity: string
  location: string
  rating: number
  reviews: number
  distance: string
  badge: string
  img: string
  tags: string[]
}

export interface EntityDetailData {
  type: string
  id: string
  name: string
  location: string
  phone: string
  rating: number
  ratingCount: number
  transactions: number
  about: string
  verified: boolean
  lat: number
  lng: number
  city: string
  commodities: { name: string; qty: string; price: string; kebutuhanRef?: string | null }[]
  recentTx: { party: string; date: string; qty: string }[]
  addedValue: string[]
}

export interface ProducerDashboardData {
  greeting: string
  location: string
  metrics: { label: string; value: string }[]
  recommendations: {
    id: string
    kebutuhanRef?: string
    type: string
    name: string
    distance: string
    matchScore: number
    reason: string
    verified: boolean
    activeNeed: string
  }[]
  products: { name: string; qty: string; price: string; status: string }[]
  transactions: { koperasi: string; qty: string; date: string; value: string; status: string }[]
}

export interface CoopDashboardData {
  title: string
  location: string
  stats: { label: string; value: string }[]
  activeNeeds: {
    id: string
    commodity: string
    qty: string
    deadline: string
    responses: number
    daysLeft: number
  }[]
  producers: {
    id: string
    type: string
    name: string
    commodity: string
    qty: string
    distance: string
    distanceKm: number
    verified: boolean
    matchScore: number
    price: string
  }[]
  orders: { id: string; supplier: string; commodity: string; qty: string; status: string; date: string }[]
}

export interface CitySuggestion {
  name: string
  province: string
  lat: number
  lng: number
}

export interface OfferResponse {
  id: string
  producerName: string
  commodity: string
  qty: string
  price: string
  status: string
  statusLabel: string
  date: string
  note: string | null
}
