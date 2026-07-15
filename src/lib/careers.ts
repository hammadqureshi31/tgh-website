// Shared data for the careers landing page, application form, dashboard
// filters, and JobPosting structured data — single source of truth so the
// position/location lists never drift between them.

export interface CareerLocation {
  id: string
  name: string
  status: 'Now Hiring' | 'Opening Soon'
  address: string
  city: string
  region: string
  postalCode: string
  mapsUrl: string
}

export const CAREER_LOCATIONS: CareerLocation[] = [
  {
    id: 'lake-saint-louis',
    name: 'Lake Saint Louis',
    status: 'Opening Soon',    address: '11112 Veterans Memorial Pkwy',
    city: 'Lake Saint Louis',
    region: 'MO',
    postalCode: '63367',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=11112+Veterans+Memorial+Pkwy,+Lake+Saint+Louis,+MO+63367',
  },
  {
    id: 'manchester-ballwin',
    name: 'Manchester / Ballwin',
    status: 'Now Hiring',
    address: '26 Stonegate Center',
    city: 'Manchester',
    region: 'MO',
    postalCode: '63088',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=26+Stonegate+Center,+Manchester,+MO+63088',
  },
]

export const CAREER_POSITIONS = ['Junior Barber', 'Senior Barber', 'Shop Manager'] as const
export type CareerPosition = (typeof CAREER_POSITIONS)[number]

export const CAREER_POSITION_DESCRIPTIONS: Record<CareerPosition, string> = {
  'Junior Barber':
    'Build your craft under the guidance of senior stylists while serving a premium clientele.',
  'Senior Barber':
    'Lead client relationships and mentor junior barbers with full creative ownership of your chair.',
  'Shop Manager':
    'Oversee daily operations, team performance, and the client experience for the shop.',
}

export interface OpenRole {
  title: CareerPosition
  locationId: string
}

// Cross product of every position at every location — drives both the
// "Open Positions" cards and the JobPosting JSON-LD.
export const OPEN_ROLES: OpenRole[] = CAREER_LOCATIONS.flatMap((location) =>
  CAREER_POSITIONS.map((title) => ({ title, locationId: location.id })),
)

export function getLocationById(id: string): CareerLocation | undefined {
  return CAREER_LOCATIONS.find((loc) => loc.id === id)
}
