import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AccountClient from './AccountClient';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch full user details and their orders
  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    redirect('/login');
  }

  return <AccountClient user={user as any} />;
}
