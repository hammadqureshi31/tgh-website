interface DashboardLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: "Dashboard | The Gentry's House",
  robots: 'noindex, nofollow',
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  return children
}
