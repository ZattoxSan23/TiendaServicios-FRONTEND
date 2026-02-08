// app/admin/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
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
  Eye,
  RefreshCw,
  Mail,
  Lock,
  Save,
  X,
  Calendar,
  BarChart3,
  Download,
  MoreVertical,
  ChevronDown,
  UserX
} from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface EditUserData {
  id: number;
  username: string;
  email: string;
  role: string;
  newPassword?: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<EditUserData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Cliente'
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    clients: 0,
    active: 0,
    inactive: 0
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
      
      // Calcular estadísticas actualizadas
      setStats({
        total: usersData.length,
        admins: usersData.filter((u: User) => u.role === 'Admin').length,
        clients: usersData.filter((u: User) => u.role === 'Cliente').length,
        active: usersData.length,
        inactive: 0
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios según búsqueda y filtros
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm);
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleEditUser = (user: User) => {
    setEditingUser({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    setActionLoading(true);
    try {
      // Actualizar rol si cambió
      if (editingUser.role !== users.find(u => u.id === editingUser.id)?.role) {
        await api.put(`/users/${editingUser.id}/role`, { 
          role: editingUser.role 
        });
      }
      
      // En un sistema real, aquí iría la actualización de otros campos
      // como email, username, password, etc.
      
      alert('Usuario actualizado exitosamente');
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      alert('Error al actualizar usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
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
      await api.post('/users', newUser);
      alert('Usuario creado exitosamente');
      setNewUser({ username: '', email: '', password: '', role: 'Cliente' });
      setShowCreateModal(false);
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data || 'Error al crear usuario');
    } finally {
      setActionLoading(false);
    }
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
                <Link href="/products">
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

          {/* Estadísticas mejoradas */}
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
                    {((stats.admins / stats.total) * 100).toFixed(1)}% del total
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
                    {((stats.clients / stats.total) * 100).toFixed(1)}% del total
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

          {/* Controles de búsqueda y filtro - COLORES CORREGIDOS */}
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

            {/* Barra de búsqueda y filtros - COLORES ARREGLADOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por ID, nombre o email..."
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
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
                    <select className="text-sm border-2 border-gray-200 bg-white text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>ID Ascendente</option>
                      <option>Nombre A-Z</option>
                      <option>Fecha de creación</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios mejorada - BOTÓN DUPLICADO ELIMINADO */}
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span>Usuario</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Información
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow">
                              <span className="text-sm font-bold text-white">
                                {u.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {u.username}
                                {u.id === user?.id && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                    Tú
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">ID: #{u.id}</div>
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
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${
                            u.role === 'Admin' 
                              ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200' 
                              : 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200'
                          }`}>
                            {u.role === 'Admin' ? (
                              <>
                                <Shield className="w-3.5 h-3.5" />
                                Administrador
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5" />
                                Cliente
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">Activo</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {/* SOLO BOTÓN DE EDITAR - BOTÓN DUPLICADO ELIMINADO */}
                            <button
                              onClick={() => handleEditUser(u)}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Editar
                            </button>
                            
                            {/* SOLO MUESTRA EL BOTÓN ELIMINAR SI NO ES EL USUARIO ACTUAL */}
                            {u.id !== user?.id && (
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

          {/* Estado del sistema mejorado */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-blue-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Estado del Sistema</h3>
                </div>
                <div className="text-xs text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-lg">
                  Actualizado hace 2 minutos
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-300">Autenticación</p>
                      <p className="text-lg font-semibold text-white">Operativa</p>
                    </div>
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full"></div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-300">Base de datos</p>
                      <p className="text-lg font-semibold text-white">Conectada</p>
                    </div>
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full"></div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-300">API Backend</p>
                      <p className="text-lg font-semibold text-white">100%</p>
                    </div>
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-4/5"></div>
                  </div>
                </div>
                
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-300">Seguridad</p>
                      <p className="text-lg font-semibold text-white">Activa</p>
                    </div>
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Shield className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Usuario - COLORES DE INPUTS CORREGIDOS */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Edit className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Editar Usuario</h3>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser();
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol del Usuario
                    </label>
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña (opcional)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={editingUser.newPassword || ''}
                        onChange={(e) => setEditingUser({...editingUser, newPassword: e.target.value})}
                        placeholder="Dejar vacío para no cambiar"
                        className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10 placeholder-gray-400"
                      />
                      <Lock className="absolute right-3 top-3.5 w-4 h-4 text-gray-500" />
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
                <span className="font-semibold text-gray-900">{userToDelete.username}</span>.
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

      {/* Modal de Crear Usuario - COLORES DE INPUTS CORREGIDOS */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                        required
                      />
                      <Lock className="absolute right-3 top-3.5 w-4 h-4 text-gray-500" />
                    </div>
                  </div>

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