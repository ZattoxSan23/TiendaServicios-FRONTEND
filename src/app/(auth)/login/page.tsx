'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { authService } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData);
      router.refresh(); // Refrescar para actualizar estado de autenticación
      router.push('/');
    } catch (err) {
      setError('Credenciales inválidas');
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Iniciar Sesión
          </h2>
          
          {error && (
            <Alert type="error" message={error} className="mb-4" />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre de usuario"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
            />

            <Input
              label="Contraseña"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}