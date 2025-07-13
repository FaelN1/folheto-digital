'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DashboardProtectedRouteProps {
  children: React.ReactNode;
}

export default function DashboardProtectedRoute({ children }: DashboardProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const isGuestWithoutCompany = user.role === 'GUEST' && (!user.companyId || user.companyId === '');
      
      if (isGuestWithoutCompany) {
        router.push('/intern/pending-company');
        return;
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && user.role === 'GUEST' && (!user.companyId || user.companyId === '')) {
    return null;
  }

  return <>{children}</>;
}
