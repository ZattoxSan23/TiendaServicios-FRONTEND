'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Edit,
  ArrowLeft,
  Shield,
  LogOut,
  Clock,
  X,
  Check,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  UserCircle
} from 'lucide-react';

interface EditFormData {
  username: string;
  email: string;
  firstName: string;  // ✅ NUEVO
  lastName: string;   // ✅ NUEVO
  phoneNumber: string;
  address: string;
  birthDate: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, logout, checkAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [memberSinceText, setMemberSinceText] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  
  const [formData, setFormData] = useState<EditFormData>({
    username: '',
    email: '',
    firstName: '',  // ✅ NUEVO
    lastName: '',   // ✅ NUEVO
    phoneNumber: '',
    address: '',
    birthDate: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',  // ✅ NUEVO
        lastName: user.lastName || '',    // ✅ NUEVO
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const updateMemberSince = () => {
      setMemberSinceText(getMemberSince(user?.createdAt));
    };
    
    updateMemberSince();
    const interval = setInterval(updateMemberSince, 60000);
    
    return () => clearInterval(interval);
  }, [user?.createdAt]);

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEditing]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

const formatBirthDate = (dateString: string | undefined) => {
  if (!dateString) return 'No especificado';

  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};


  const getMemberSince = (dateString: string | undefined) => {
    if (!dateString) return 'Recientemente';
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Hace unos segundos';
    if (diffMinutes < 60) return `${diffMinutes} minutos`;
    if (diffHours < 24) return `${diffHours} horas`;
    if (diffDays < 30) return `${diffDays} días`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} años`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setEditError('');
  };

  const validateInfoForm = () => {
    if (!formData.username.trim()) {
      setEditError('El nombre de usuario es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      setEditError('El correo electrónico es obligatorio');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEditError('El correo electrónico no es válido');
      return false;
    }
    return true;
  };

  const validatePasswordForm = () => {
    if (!formData.currentPassword) {
      setEditError('Debes ingresar tu contraseña actual');
      return false;
    }
    if (!formData.newPassword) {
      setEditError('Debes ingresar una nueva contraseña');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setEditError('La nueva contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setEditError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
      if (activeTab === 'info') {
        if (!validateInfoForm()) {
          setIsLoading(false);
          return;
        }

        // ✅ CORREGIDO: Enviar firstName y lastName al backend
        const response = await api.put('/users/profile', {
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,  // ✅ NUEVO
          lastName: formData.lastName,    // ✅ NUEVO
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          birthDate: formData.birthDate
        });

        const { token, user: updatedUser } = response.data;
        
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('username', updatedUser.username);
          document.cookie = `token=${token}; path=/; max-age=3600; samesite=lax`;
          
          window.dispatchEvent(new CustomEvent('auth-change', { 
            detail: { action: 'login', username: updatedUser.username }
          }));
          window.dispatchEvent(new Event('storage'));
        }

        setEditSuccess('Perfil actualizado correctamente');
        await checkAuth();
        
      } else {
        if (!validatePasswordForm()) {
          setIsLoading(false);
          return;
        }

        await api.put('/users/profile/password', {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });

        setEditSuccess('Contraseña actualizada correctamente');
      }

      setTimeout(() => {
        if (activeTab === 'password') {
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
        }
        setIsEditing(false);
        setEditSuccess('');
        setActiveTab('info');
      }, 800);
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 
                      err.response?.data?.message || 
                      'Error al actualizar el perfil';
      setEditError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditError('');
    setEditSuccess('');
    setActiveTab('info');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    
    // ✅ RESTAURAR VALORES ORIGINALES incluyendo firstName y lastName
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',  // ✅ NUEVO
        lastName: user.lastName || '',    // ✅ NUEVO
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const decodeUtf8 = (text: string | undefined): string => {
    if (!text) return '';
    try {
      if (!text.includes('Ã')) return text;
      const bytes = new Uint8Array([...text].map(c => c.charCodeAt(0)));
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(bytes);
    } catch {
      return text;
    }
  };

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // ✅ NUEVO: Función para mostrar nombre completo
  const getFullName = () => {
    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user?.username || 'Usuario';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Mi Perfil
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Actualiza tus datos personales
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link href="/shop">
                  <button className="flex items-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                  </button>
                </Link>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <Edit className="w-4 h-4" />
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* Modal de Edición */}
          {isEditing && (
            <>
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                onClick={handleCancel}
              />
              
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
                <div 
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto my-auto"
                  style={{ animation: 'modalEnter 0.3s ease-out' }}
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
                    <h3 className="text-xl font-bold text-gray-900">Editar Perfil</h3>
                    <button 
                      onClick={handleCancel}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-100">
                    <button
                      onClick={() => setActiveTab('info')}
                      className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
                        activeTab === 'info' 
                          ? 'text-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Información Personal
                      {activeTab === 'info' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
                        activeTab === 'password' 
                          ? 'text-blue-600' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Cambiar Contraseña
                      {activeTab === 'password' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                      )}
                    </button>
                  </div>
                  
                  {/* Contenido */}
                  <div className="p-6 space-y-4 bg-white max-h-[60vh] overflow-y-auto">
                    {editError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {editError}
                      </div>
                    )}
                    
                    {editSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        {editSuccess}
                      </div>
                    )}

                    {activeTab === 'info' ? (
                      <>
                        {/* ✅ NUEVO: Campo Nombres */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombres
                          </label>
                          <div className="relative">
                            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                              placeholder="Juan"
                            />
                          </div>
                        </div>

                        {/* ✅ NUEVO: Campo Apellidos */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Apellidos
                          </label>
                          <div className="relative">
                            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                              placeholder="Pérez"
                            />
                          </div>
                        </div>

                        {/* Username */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de Usuario <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                              placeholder="usuario123"
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                              placeholder="tu@ejemplo.com"
                            />
                          </div>
                        </div>

                        {/* Teléfono */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                              placeholder="+51 999 888 777"
                            />
                          </div>
                        </div>

                        {/* Dirección */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                              placeholder="Av. Principal 123, Lima"
                            />
                          </div>
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha de Nacimiento
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="date"
                              name="birthDate"
                              max={maxDateString}
                              value={formData.birthDate}
                              onChange={handleChange}
                              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">Debes ser mayor de 18 años</p>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Contraseña Actual */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña Actual <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Nueva Contraseña */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nueva Contraseña <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                              placeholder="Mínimo 6 caracteres"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirmar Nueva Contraseña */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Nueva Contraseña <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="pl-10 pr-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-900"
                              placeholder="Repite la nueva contraseña"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-100 flex gap-3 bg-white rounded-b-2xl">
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium bg-white"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Guardar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Perfil Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">
                          {user?.firstName?.charAt(0) || user?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        {/* ✅ NUEVO: Mostrar nombre completo si existe, sino username */}
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {getFullName()}
                        </h2>
                        {/* ✅ NUEVO: Mostrar username como subtítulo si hay nombre completo */}
                        {(user?.firstName || user?.lastName) && (
                          <p className="text-white/80 text-sm mb-1">
                            @{user?.username}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <div className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user?.role === 'Admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user?.role === 'Admin' ? 'Administrador' : 'Cliente'}
                          </div>
                          <span className="text-white/80 text-sm">
                            Miembro desde {memberSinceText}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Información Personal
                  </h3>
                  
                  <div className="space-y-6">
                    {/* ✅ NUEVO: Campo Nombres */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2.5 bg-indigo-100 rounded-lg">
                        <UserCircle className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Nombres</p>
                        <p className="font-medium text-gray-900">
                          {user?.firstName || 'No especificado'}
                        </p>
                      </div>
                    </div>

                    {/* ✅ NUEVO: Campo Apellidos */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2.5 bg-indigo-100 rounded-lg">
                        <UserCircle className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Apellidos</p>
                        <p className="font-medium text-gray-900">
                          {user?.lastName || 'No especificado'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2.5 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Nombre de Usuario</p>
                        <p className="font-medium text-gray-900">
                          {user?.username || 'No especificado'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2.5 bg-green-100 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Correo Electrónico</p>
                        <p className="font-medium text-gray-900">
                          {user?.email || 'No especificado'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2.5 bg-purple-100 rounded-lg">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                        <p className="font-medium text-gray-900">
                          {user?.phoneNumber || 'No especificado'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2.5 bg-orange-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Dirección</p>
                        <p className="font-medium text-gray-900">
                          {decodeUtf8(user?.address) || 'No especificado'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2.5 bg-pink-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Fecha de Nacimiento</p>
                        <p className="font-medium text-gray-900">
                          {formatBirthDate(user?.birthDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Estado de Cuenta</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">Tipo de Cuenta</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user?.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user?.role === 'Admin' ? 'Admin' : 'Cliente'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Miembro desde</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(user?.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Antigüedad
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {memberSinceText}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-6 text-lg">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    <span className="font-medium">Editar Perfil</span>
                  </button>
                  
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="font-semibold">Cuenta Verificada</h3>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Tu cuenta está activa y verificada. Todos tus datos están protegidos con encriptación de grado bancario.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Sesión segura</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              ¿Necesitas ayuda? <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Contacta con soporte</a>
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}