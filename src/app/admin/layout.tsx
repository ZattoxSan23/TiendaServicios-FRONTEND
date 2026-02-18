'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="Admin">
      <div className="min-h-screen bg-gray-50">
        {/* NO incluir Navbar aquí - ya está en el layout principal */}
        {children}
      </div>
    </ProtectedRoute>
  );
}