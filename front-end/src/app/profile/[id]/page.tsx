import { mockUsers } from '@/lib/mock-data'
import ProfileClient from './ProfileClient'

// Generate static params for all mock users
export function generateStaticParams() {
  return mockUsers.map((user) => ({
    id: user.id,
  }))
}

interface ProfilePageProps {
  params: { id: string }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return <ProfileClient userId={params.id} />
}
