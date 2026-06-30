import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AppLayoutShell from '@/components/layout/AppLayoutShell'

export default async function AppLayout({ children }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <AppLayoutShell user={session.user}>
      {children}
    </AppLayoutShell>
  )
}
