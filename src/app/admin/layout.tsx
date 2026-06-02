interface AdminLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: 'Admin | The Gentry\'s House',
  robots: 'noindex, nofollow',
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return children
}
