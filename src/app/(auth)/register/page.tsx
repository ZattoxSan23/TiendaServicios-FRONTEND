'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { authService } from '@/lib/auth';
import { User, Mail, Lock, Smartphone, MapPin, Calendar, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    birthDate: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const validateStep1 = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const registerData: any = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      if (formData.phoneNumber) registerData.phoneNumber = formData.phoneNumber;
      if (formData.address) registerData.address = formData.address;
      if (formData.birthDate) registerData.birthDate = formData.birthDate;

      await authService.register(registerData);
      setSuccess('¡Registro exitoso! Redirigiendo al login...');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      
      let errorMsg = 'Error en el registro';
      
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (typeof err.response?.data === 'string') {
        errorMsg = err.response.data;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      console.error('Error de registro:', err);
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

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // ✅ CLASES REUTILIZABLES PARA INPUTS
  const inputClasses = "pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-gray-900 placeholder:text-gray-500";
  
  const inputWithPaddingRight = "pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-gray-900 placeholder:text-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Crear Cuenta
          </h1>
          <p className="mt-2 text-gray-600">
            Únete a nuestra plataforma de ecommerce
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">
                Paso {step} de 2
              </span>
              <span className="text-xs font-medium text-blue-600">
                {step === 1 ? 'Información de acceso' : 'Datos personales'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
          </div>

          {error && (
            <Alert type="error" message={error} className="mb-6 animate-shake" />
          )}
          
          {success && (
            <Alert type="success" message={success} className="mb-6" />
          )}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-5">
            
            {step === 1 ? (
              <div className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-1 gap-5">
                  {/* Username */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de usuario <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="usuario123"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="tu@ejemplo.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        minLength={6}
                        value={formData.password}
                        onChange={handleChange}
                        className={inputWithPaddingRight}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={inputWithPaddingRight}
                        placeholder="Repite tu contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continuar
                  <svg className="ml-2 h-5 w-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>
            ) : (
              <div className="space-y-5 animate-fadeIn">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                  <p className="text-sm text-blue-700">
                    <strong>Información opcional</strong> - Estos campos mejoran tu experiencia de compra
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div className="relative md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="+51 999 888 777"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="relative md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección de envío
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Av. Principal 123, Lima"
                      />
                    </div>
                  </div>

                  {/* BirthDate */}
                  <div className="relative md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de nacimiento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                      <input
                        type="date"
                        name="birthDate"
                        max={maxDateString}
                        value={formData.birthDate}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Debes ser mayor de 18 años</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {/* ✅ BOTÓN ATRÁS CORREGIDO */}
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Atrás
                  </button>
                  
                  <Button
                    type="submit"
                    loading={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registrando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Completar registro
                        <CheckCircle className="ml-2 h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link 
                href="/login" 
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors underline decoration-2 underline-offset-2 hover:decoration-blue-800"
              >
                Inicia sesión aquí
              </Link>
            </p>
            
            <p className="mt-4 text-center text-xs text-gray-500">
              Al registrarte, aceptas nuestros{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">Términos de servicio</Link>
              {' '}y{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">Política de privacidad</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}