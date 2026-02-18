'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import { authService } from '@/lib/auth';
import Link from 'next/link';
import { 
  Shield, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Lock,
  Save,
  X,
  Calendar,
  BarChart3,
  Download,
  ChevronDown,
  UserX,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Ban,
  UserCircle
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;  // ✅ NUEVO
  lastName?: string;   // ✅ NUEVO
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  createdAt?: string;
}

interface EditUserData {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName: string;   // ✅ NUEVO
  lastName: string;    // ✅ NUEVO
  phoneNumber: string;
  address: string;
  birthDate: string;
  newPassword: string;
}

export default function AdminPage() {
  const { user, checkAuth } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<EditUserData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Cliente',
    firstName: '',   // ✅ NUEVO
    lastName: '',    // ✅ NUEVO
    phoneNumber: '',
    address: '',
    birthDate: ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    clients: 0,
    active: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      const usersData = response.data;
      setUsers(usersData);
      
      setStats({
        total: usersData.length,
        admins: usersData.filter((u: User) => u.role === 'Admin').length,
        clients: usersData.filter((u: User) => u.role === 'Cliente').length,
        active: usersData.length
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.firstName && u.firstName.toLowerCase().includes(searchTerm.toLowerCase())) || // ✅ NUEVO
        (u.lastName && u.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||   // ✅ NUEVO
        u.id.toString().includes(searchTerm) ||
        (u.phoneNumber && u.phoneNumber.includes(searchTerm)) ||
        (u.address && u.address.toLowerCase().includes(searchTerm));
      
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleEditUser = (u: User) => {
    setEditingUser({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      firstName: u.firstName || '',   // ✅ NUEVO
      lastName: u.lastName || '',     // ✅ NUEVO
      phoneNumber: u.phoneNumber || '',
      address: u.address || '',
      birthDate: u.birthDate ? u.birthDate.split('T')[0] : '',
      newPassword: ''
    });
    setShowEditModal(true);
    setShowPassword(false);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    // ✅ BLOQUEAR: Admin no puede cambiar su propio rol
    if (editingUser.id === user?.id && editingUser.role !== user?.role) {
      alert('No puedes cambiar tu propio rol desde el panel de administración');
      return;
    }
    
    setActionLoading(true);
    try {
      const response = await api.put(`/users/${editingUser.id}`, {
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role,
        firstName: editingUser.firstName.trim() || null,  // ✅ NUEVO
        lastName: editingUser.lastName.trim() || null,    // ✅ NUEVO
        phoneNumber: editingUser.phoneNumber,
        address: editingUser.address,
        birthDate: editingUser.birthDate,
        password: editingUser.newPassword || undefined
      });

      // ✅ ACTUALIZACIÓN EN TIEMPO REAL: Si el admin editó su propio perfil
      if (editingUser.id === user?.id) {
        console.log('Admin editó su propio perfil, actualizando...');
        
        // Si el backend devuelve un nuevo token, usarlo
        if (response.data?.token) {
          console.log('Nuevo token recibido del backend');
          authService.updateToken(response.data.token, editingUser.username);
        } else {
          // Si no hay token nuevo, actualizar localStorage manualmente
          console.log('Actualizando localStorage manualmente');
          localStorage.setItem('username', editingUser.username);
          
          // Disparar eventos para forzar actualización
          window.dispatchEvent(new CustomEvent('auth-change', { 
            detail: { action: 'login', username: editingUser.username }
          }));
          window.dispatchEvent(new Event('storage'));
        }
        
        // Forzar recarga de datos del usuario
        await checkAuth();
      }

      alert('Usuario actualizado exitosamente');
      setShowEditModal(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al actualizar usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (u: User) => {
    // ✅ BLOQUEAR: Admin no puede eliminarse a sí mismo
    if (u.id === user?.id) {
      alert('No puedes eliminar tu propia cuenta de administrador');
      return;
    }
    
    setUserToDelete(u);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setActionLoading(true);
    try {
      await api.delete(`/users/${userToDelete.id}`);
      alert('Usuario eliminado exitosamente');
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      alert('Error al eliminar usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      // ✅ ENVIAR todos los campos incluyendo firstName y lastName
      await api.post('/users', {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        firstName: newUser.firstName.trim() || undefined,  // ✅ NUEVO
        lastName: newUser.lastName.trim() || undefined,    // ✅ NUEVO
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        birthDate: newUser.birthDate
      });
      
      alert('Usuario creado exitosamente');
      setNewUser({ 
        username: '', 
        email: '', 
        password: '', 
        role: 'Cliente',
        firstName: '',   // ✅ NUEVO
        lastName: '',    // ✅ NUEVO
        phoneNumber: '',
        address: '',
        birthDate: ''
      });
      setShowCreateModal(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Error al crear usuario');
    } finally {
      setActionLoading(false);
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
  const getFullName = (user: User) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.username;
  };

  return (
    <ProtectedRoute requiredRole="Admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Panel de Administración
                    </h1>
                    <p className="text-gray-600 mt-1">
                      Gestión completa del sistema y usuarios
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      Conectado como: <span className="font-semibold text-blue-600">{user?.username}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">Administrador</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/products">
                  <button className="flex items-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Productos
                  </button>
                </Link>
                <button
                  onClick={fetchUsers}
                  className="flex items-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">+12% este mes</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-sm border border-purple-100 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Administradores</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.admins}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {stats.total > 0 ? ((stats.admins / stats.total) * 100).toFixed(1) : 0}% del total
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Shield className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-sm border border-green-100 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Clientes</p>
                  <p className="text-3xl font-bold text-green-900">{stats.clients}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {stats.total > 0 ? ((stats.clients / stats.total) * 100).toFixed(1) : 0}% del total
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <UserCheck className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-sm border border-orange-100 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Activos</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.active}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">100% activos</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <BarChart3 className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Controles de búsqueda y filtro */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Gestión de Usuarios</h2>
                <p className="text-gray-600 text-sm">
                  Busca, filtra y administra todos los usuarios del sistema
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  Nuevo Usuario
                </button>
                
                <button className="flex items-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              </div>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por ID, nombre, apellido, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-500" />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="all">Todos los roles</option>
                  <option value="Admin">Administradores</option>
                  <option value="Cliente">Clientes</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    Mostrando <span className="font-bold">{filteredUsers.length}</span> de <span className="font-bold">{users.length}</span> usuarios
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <UserX className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron usuarios</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || roleFilter !== 'all' 
                      ? 'Intenta con otros términos de búsqueda o filtros' 
                      : 'No hay usuarios registrados en el sistema'}
                  </p>
                  {(searchTerm || roleFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setRoleFilter('all');
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Información</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contacto</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow">
                              <span className="text-sm font-bold text-white">
                                {(u.firstName?.charAt(0) || u.username.charAt(0)).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {getFullName(u)}
                                {u.id === user?.id && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Tú</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                @{u.username} • ID: #{u.id}
                              </div>
                              {u.firstName && u.lastName && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {u.firstName} {u.lastName}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-sm text-gray-900 mb-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="truncate max-w-[200px]">{u.email}</span>
                            </div>
                            {u.createdAt && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>Registrado: {new Date(u.createdAt).toLocaleDateString('es-ES')}</span>
                              </div>
                            )}
                            {u.birthDate && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <Calendar className="w-3 h-3" />
                                <span>Nacimiento: {new Date(u.birthDate).toLocaleDateString('es-ES')}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col text-sm">
                            {u.phoneNumber && (
                              <div className="flex items-center gap-2 text-gray-900 mb-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{u.phoneNumber}</span>
                              </div>
                            )}
                            {u.address && (
                              <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-[150px]">{decodeUtf8(u.address)}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${
                            u.role === 'Admin' 
                              ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200' 
                              : 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200'
                          }`}>
                            {u.role === 'Admin' ? (
                              <><Shield className="w-3.5 h-3.5" /> Administrador</>
                            ) : (
                              <><UserCheck className="w-3.5 h-3.5" /> Cliente</>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditUser(u)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                            
                            {/* ✅ BLOQUEAR ELIMINACIÓN PROPIA CUENTA */}
                            {u.id === user?.id ? (
                              <div 
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                title="No puedes eliminar tu propia cuenta"
                              >
                                <Ban className="w-4 h-4" />
                                <span>Eliminar</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleDeleteClick(u)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Usuario */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Edit className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingUser.id === user?.id ? 'Editar Mi Perfil' : 'Editar Usuario'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* ✅ ALERTA: Si está editando su propia cuenta */}
              {editingUser.id === user?.id && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Estás editando tu propia cuenta. Algunas opciones están deshabilitadas.
                  </p>
                </div>
              )}

              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser();
              }}>
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombres
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={editingUser.firstName}
                        onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Juan"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={editingUser.lastName}
                        onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de Usuario <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Rol - DESHABILITADO si es su propia cuenta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol del Usuario
                    </label>
                    {editingUser.id === user?.id ? (
                      <div className="p-3 bg-gray-100 rounded-xl text-gray-600 text-sm flex items-center gap-2 border-2 border-gray-200">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <span>Administrador</span>
                        <span className="text-xs text-gray-500 ml-auto">(No editable)</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingUser({...editingUser, role: 'Admin'})}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                            editingUser.role === 'Admin'
                              ? 'bg-purple-100 text-purple-700 border-purple-300'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <Shield className="w-4 h-4" />
                          Administrador
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingUser({...editingUser, role: 'Cliente'})}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                            editingUser.role === 'Cliente'
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                          Cliente
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={editingUser.phoneNumber}
                        onChange={(e) => setEditingUser({...editingUser, phoneNumber: e.target.value})}
                        placeholder="+51 999 888 777"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={editingUser.address}
                        onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                        placeholder="Av. Principal 123, Lima"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={editingUser.birthDate}
                        onChange={(e) => setEditingUser({...editingUser, birthDate: e.target.value})}
                        max={maxDateString}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Debe ser mayor de 18 años</p>
                  </div>

                  {/* Nueva Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña (opcional)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editingUser.newPassword}
                        onChange={(e) => setEditingUser({...editingUser, newPassword: e.target.value})}
                        placeholder="Dejar vacío para no cambiar"
                        className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10 placeholder-gray-400"
                      />
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Guardando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        Guardar Cambios
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Eliminar Usuario */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-red-100 rounded-full">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                ¿Eliminar Usuario?
              </h3>
              
              <p className="text-gray-600 text-center mb-6">
                Estás a punto de eliminar permanentemente al usuario{' '}
                <span className="font-semibold text-gray-900">{getFullName(userToDelete)}</span>.
                Esta acción no se puede deshacer.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Advertencia</p>
                    <p className="text-sm text-red-700 mt-1">
                      Todos los datos relacionados con este usuario serán eliminados permanentemente.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Eliminando...
                    </span>
                  ) : (
                    'Eliminar Permanentemente'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Crear Nuevo Usuario</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCreateUser}>
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombres
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Juan"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos
                    </label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de Usuario <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  {/* Rol */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol del Usuario
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNewUser({...newUser, role: 'Admin'})}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          newUser.role === 'Admin'
                            ? 'bg-purple-100 text-purple-700 border-purple-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        Administrador
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewUser({...newUser, role: 'Cliente'})}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          newUser.role === 'Cliente'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <UserCheck className="w-4 h-4" />
                        Cliente
                      </button>
                    </div>
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={newUser.phoneNumber}
                        onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                        placeholder="+51 999 888 777"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={newUser.address}
                        onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                        placeholder="Av. Principal 123, Lima"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Nacimiento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={newUser.birthDate}
                        onChange={(e) => setNewUser({...newUser, birthDate: e.target.value})}
                        max={maxDateString}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Debe ser mayor de 18 años</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Crear Usuario
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}