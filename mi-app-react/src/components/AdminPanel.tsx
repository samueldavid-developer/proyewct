import React, { useState, useEffect, useCallback } from 'react';

// Define the API URL
const API_URL = 'https://ninatuktours.com/admin_api.php';

interface Tour {
  id: number;
  nombre_es: string;
  nombre_en: string;
  nombre_pl: string;
  precio: number;
  duracion_minutos: number;
  capacidad_max_personas: number;
  imagenes: string[];
}

interface Reservation {
  id: number;
  tour_id: number;
  tour_nombre_es: string;
  usuario_nombre: string;
  usuario_email: string;
  usuario_telefono: string;
  fecha_tour: string;
  hora_tour: string;
  punto_recogida: string;
  cantidad_personas: number;
  total_pagar: number;
  estado_reserva: 'pendiente' | 'confirmada' | 'cancelada';
  creado_en: string;

}

interface Payment {
  id: number;
  reserva_id: number;
  usuario_nombre: string;
  tour_nombre_es: string;
  monto: number;
  moneda: string;
  pasarela: string;
  transaccion_id: string;
  estado_pago: string;
  pagado_en: string;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  idioma_preferido: string;
  creado_en: string;
}

interface CarruselItem {
  id: number | string;
  ruta_imagen: string;
}

interface AdminPanelProps {
  theme: string;
  onClose: () => void;
}

// Helper functions for JWT
const getToken = (): string | null => localStorage.getItem('admin_token');
const setToken = (token: string) => localStorage.setItem('admin_token', token);
const removeToken = () => localStorage.removeItem('admin_token');

const getAuthHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const AdminPanel = ({ theme, onClose }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'tours' | 'reservations' | 'payments' | 'users' | 'background' | 'carrusel'>('tours');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!getToken();
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [carruselItems, setCarruselItems] = useState<CarruselItem[]>([]);
  // Helper function to detect video files
  const isVideo = (url: string): boolean => {
    const videoExtensions = /\.(mp4|webm|mov|m4v|ogg)$/i;
    return videoExtensions.test(url);
  };
  const [carruselUploading, setCarruselUploading] = useState(false);
  const [openMapReservationId, setOpenMapReservationId] = useState<number | null>(null);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    removeToken();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          contrasena: loginPass
        })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setIsLoggedIn(true);
        setToken(data.token);
        triggerNotification('¡Bienvenido al Panel de Control!');
      } else {
        triggerNotification(data.error || 'Credenciales incorrectas.', false);
      }
    } catch {
      triggerNotification('Error de conexión al servidor.', false);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Background State
  const [bgType, setBgType] = useState<'video' | 'image'>('video');
  const [bgUrl, setBgUrl] = useState('');
  const [uploadingBg, setUploadingBg] = useState(false);

  const handleSaveBackground = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          action: 'save_settings',
          bg_url: bgUrl,
          bg_type: bgType
        })
      });

      if (res.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('custom_bg_type', bgType);
        localStorage.setItem('custom_bg_url', bgUrl);
        triggerNotification('¡Fondo actualizado con éxito! Recarga la web principal para verlo.');
      } else {
        throw new Error(data.error || 'Error al guardar configuración');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error de conexión.';
      triggerNotification(errorMsg, false);
    }
  };

  const handleBgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Simple client-side validation for video length
    if (bgType === 'video' && file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 61) {
          triggerNotification('El video no puede durar más de 1 minuto.', false);
          return;
        }
        startBgUpload(file);
      }
      video.src = URL.createObjectURL(file);
    } else {
      startBgUpload(file);
    }
  };

  const startBgUpload = async (file: File) => {
    setUploadingBg(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`${API_URL}?action=upload_image`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      if (res.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al subir el archivo');
      }

      setBgUrl(data.ruta_imagen);
      triggerNotification('¡Archivo subido con éxito!');
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : 'Error al subir el archivo.', false);
    } finally {
      setUploadingBg(false);
    }
  };

  const [tours, setTours] = useState<Tour[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [notification, setNotification] = useState<{ msg: string, success: boolean } | null>(null);

  const triggerNotification = (msg: string, success: boolean = true) => {
    setNotification({ msg, success });
    setTimeout(() => setNotification(null), 4000);
  };

  // Tour Form State
  const [tourFormOpen, setTourFormOpen] = useState(false);
  const [editingTourId, setEditingTourId] = useState<number | null>(null);
  const [tourNombreEs, setTourNombreEs] = useState('');
  const [tourNombreEn, setTourNombreEn] = useState('');
  const [tourNombrePl, setTourNombrePl] = useState('');
  const [tourPrecio, setTourPrecio] = useState(0);
  const [tourDuracion, setTourDuracion] = useState(0);
  const [tourCapacidad, setTourCapacidad] = useState(4);
  const [tourImagenes, setTourImagenes] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // User Form State
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userNombre, setUserNombre] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userTelefono, setUserTelefono] = useState('');
  const [userContrasena, setUserContrasena] = useState('');
  const [userIdioma, setUserIdioma] = useState('es');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Define endpoints and which require auth
      const endpoints = [
        { tab: 'tours', action: 'get_tours', public: true },
        { tab: 'reservations', action: 'get_reservations', public: false },
        { tab: 'payments', action: 'get_payments', public: false },
        { tab: 'users', action: 'get_users', public: false },
        { tab: 'carrusel', action: 'get_carrusel', public: true },
        { tab: 'background', action: 'get_settings', public: true },
      ];

      const endpoint = endpoints.find(e => e.tab === activeTab);
      if (endpoint) {
        const headers = endpoint.public ? {} : getAuthHeaders();
        const res = await fetch(`${API_URL}?action=${endpoint.action}`, { headers });

        if (!endpoint.public && res.status === 401) {
          handleLogout();
          triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
          return;
        }

        const data = await res.json();
        if (activeTab === 'tours') {
          setTours(Array.isArray(data) ? data : []);
        } else if (activeTab === 'reservations') {
          setReservations(Array.isArray(data) ? data : []);
        } else if (activeTab === 'payments') {
          setPayments(Array.isArray(data) ? data : []);
        } else if (activeTab === 'users') {
          setUsers(Array.isArray(data) ? data : []);
        } else if (activeTab === 'carrusel') {
          setCarruselItems(Array.isArray(data) ? data : []);
        } else if (activeTab === 'background') {
          if (data.success && data.settings) {
            setBgUrl(data.settings.bg_url || '');
            setBgType(data.settings.bg_type || 'video');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      triggerNotification('Error al conectar con el servidor.', false);
    } finally {
      setLoading(false);
    }
  }, [activeTab, handleLogout]);

  useEffect(() => {
    if (isLoggedIn) {
      // Usamos una función asíncrona interna para evitar el error de linter sobre setState en efectos
      const load = async () => {
        await fetchData();
      };
      load();
    }
  }, [activeTab, isLoggedIn, fetchData]);

  const handleOpenCreateTour = () => {
    setEditingTourId(null);
    setTourNombreEs('');
    setTourNombreEn('');
    setTourNombrePl('');
    setTourPrecio(0);
    setTourDuracion(60);
    setTourCapacidad(4);
    setTourImagenes([]);
    setTourFormOpen(true);
  };

  const handleOpenEditTour = (tour: Tour) => {
    setEditingTourId(tour.id);
    setTourNombreEs(tour.nombre_es);
    setTourNombreEn(tour.nombre_en);
    setTourNombrePl(tour.nombre_pl);
    setTourPrecio(tour.precio);
    setTourDuracion(tour.duracion_minutos);
    setTourCapacidad(tour.capacidad_max_personas);
    setTourImagenes(tour.imagenes || []);
    setTourFormOpen(true);
  };

  const handleAddTourImage = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (newImageInput.trim()) {
      setTourImagenes([...tourImagenes, newImageInput.trim()]);
      setNewImageInput('');
    }
  };

  const handleRemoveTourImage = (idx: number) => {
    setTourImagenes(tourImagenes.filter((_, i) => i !== idx));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_URL}?action=upload_image`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });

        if (res.status === 401) {
          throw new Error('Unauthorized');
        }

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Error al subir la imagen');
        }
        return data.ruta_imagen;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setTourImagenes((prev) => [...prev, ...uploadedUrls]);
      triggerNotification(`¡${uploadedUrls.length} imagen(es) subida(s) con éxito!`);
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
      } else {
        triggerNotification(error instanceof Error ? error.message : 'Error de conexión al subir la imagen.', false);
      }
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      action: 'save_tour',
      id: editingTourId,
      nombre_es: tourNombreEs,
      nombre_en: tourNombreEn,
      nombre_pl: tourNombrePl,
      precio: tourPrecio,
      duracion_minutos: tourDuracion,
      capacidad_max_personas: tourCapacidad,
      imagenes: JSON.stringify(tourImagenes)
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        triggerNotification(editingTourId ? 'Tour actualizado.' : 'Tour creado.');
        setTourFormOpen(false);
        fetchData();
      } else {
        triggerNotification(data.error || 'Error al guardar el tour.', false);
      }
    } catch {
      triggerNotification('Error de conexión.', false);
    }
  };

  const handleCarruselFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isVideoFile = file.type.startsWith('video/');

    // Validation for video duration
    if (isVideoFile) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 61) {
          triggerNotification('El video no puede durar más de 1 minuto.', false);
          return;
        }
        startCarruselUpload(file);
      };
      video.src = URL.createObjectURL(file);
    } else {
      startCarruselUpload(file);
    }
  };

  const startCarruselUpload = async (file: File) => {
    setCarruselUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await fetch(`${API_URL}?action=upload_image`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      });

      if (uploadRes.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Error al subir archivo.');
      }

      const saveRes = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          action: 'save_carrusel_image',
          ruta_imagen: uploadData.ruta_imagen
        })
      });

      if (saveRes.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.error || 'Error al guardar en el carrusel.');
      }

      triggerNotification('Archivo añadido al carrusel con éxito.');
      fetchData();
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : 'Error al subir el archivo.', false);
    } finally {
      setCarruselUploading(false);
    }
  };

  const handleDeleteCarrusel = async (id: number | string) => {
    if (!window.confirm('¿Eliminar esta imagen del carrusel?')) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ action: 'delete_carrusel', id })
      });

      if (res.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        triggerNotification('Imagen eliminada del carrusel.');
        fetchData();
      } else {
        throw new Error(data.error || 'No se pudo eliminar.');
      }
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : 'Error al eliminar la imagen.', false);
    }
  };

  const handleDeleteTour = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este tour?')) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ action: 'delete_tour', id })
      });

      if (res.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        triggerNotification('Tour eliminado.');
        fetchData();
      }
    } catch {
      triggerNotification('Error al eliminar.', false);
    }
  };

  const handleUpdateReservationStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ action: 'update_reservation_status', id, status })
      });

      if (res.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        triggerNotification('Estado de reserva actualizado.');
        fetchData();
      }
    } catch {
      triggerNotification('Error al actualizar estado.', false);
    }
  };

  const handleOpenCreateUser = () => {
    setEditingUserId(null);
    setUserNombre('');
    setUserEmail('');
    setUserTelefono('');
    setUserContrasena('');
    setUserIdioma('es');
    setUserFormOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUserId(user.id);
    setUserNombre(user.nombre);
    setUserEmail(user.email);
    setUserTelefono(user.telefono || '');
    setUserContrasena(''); // Password empty when editing
    setUserIdioma(user.idioma_preferido || 'es');
    setUserFormOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      action: 'save_user',
      id: editingUserId,
      nombre: userNombre,
      email: userEmail,
      telefono: userTelefono,
      contrasena: userContrasena || undefined,
      idioma_preferido: userIdioma
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        triggerNotification(editingUserId ? 'Usuario actualizado.' : 'Usuario creado.');
        setUserFormOpen(false);
        fetchData();
      } else {
        triggerNotification(data.error || 'Error al guardar el usuario.', false);
      }
    } catch {
      triggerNotification('Error de conexión.', false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ action: 'delete_user', id })
      });

      if (res.status === 401) {
        handleLogout();
        triggerNotification('Sesión expirada, por favor vuelve a iniciar sesión.', false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        triggerNotification('Usuario eliminado.');
        fetchData();
      }
    } catch {
      triggerNotification('Error al eliminar.', false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in-up relative z-30">
        <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Admin Login</h2>
            <p className="text-slate-500 text-sm font-medium mt-2">Introduce tus credenciales de acceso</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Email de acceso</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className={`w-full px-5 py-3.5 rounded-2xl border text-sm focus:outline-none transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-900'
                  }`}
                placeholder="admin@ninatuk.com"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Contraseña</label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className={`w-full px-5 py-3.5 rounded-2xl border text-sm focus:outline-none transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-900'
                  }`}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-3 ${isLoggingIn ? 'opacity-70 cursor-wait' : 'active:scale-95'
                }`}
            >
              {isLoggingIn ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              )}
              {isLoggingIn ? 'Verificando...' : 'Entrar al Panel'}
            </button>
          </form>

          {notification && !isLoggedIn && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-center animate-shake">
              <span className="text-xs font-black uppercase tracking-wider">{notification.msg}</span>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
            <button
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-widest text-slate-450 hover:text-rose-500 transition-colors"
            >
              Volver a la Web Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up relative z-30">
      {/* Alert Notifications */}
      {notification && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce-in ${notification.success ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-rose-500 border-rose-400 text-white'
          }`}>
          <div className="bg-white/20 p-1 rounded-full">
            {notification.success ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </div>
          <span className="text-sm font-black uppercase tracking-wider">{notification.msg}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Panel de Control</span>
          <h1 className={`text-4xl font-black mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Administración</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-rose-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-rose-500 hover:text-white'
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Cerrar Sesión
          </button>
          <button
            onClick={onClose}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm'
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver a la Web
          </button>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 p-1.5 rounded-xl mb-8 select-none max-w-2xl transition-colors bg-slate-250/20 dark:bg-slate-900/40">
        {(['tours', 'reservations', 'payments', 'users', 'carrusel', 'background'] as const).map((tab) => {
          const labels = {
            tours: 'Tours',
            reservations: 'Reservas',
            payments: 'Pagos',
            users: 'Usuarios',
            carrusel: 'Carrusel Web',
            background: 'Fondo Web'
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-500 hover:text-rose-500'
                }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-450 animate-pulse">Cargando datos...</p>
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* TAB TOURS */}
          {activeTab === 'tours' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Gestión de Tours</h2>
                <button
                  onClick={handleOpenCreateTour}
                  className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Crear Nuevo Tour
                </button>
              </div>

              <div className={`overflow-hidden rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200/70'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-100 text-slate-500 bg-slate-50/50'}`}>
                        <th className="py-4 px-6">Tour</th>
                        <th className="py-4 px-6 text-center">Duración</th>
                        <th className="py-4 px-6 text-center">Capacidad</th>

                        <th className="py-4 px-6 text-right">Precio</th>
                        <th className="py-4 px-6 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {tours.length === 0 ? (
                        <tr>
                          <td colSpan={5} className={`py-12 text-center text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>No hay tours registrados.</td>
                        </tr>
                      ) : (
                        tours.map((t) => (
                          <tr key={t.id} className={`hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors`}>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
                                  {t.imagenes && t.imagenes[0] ? (
                                    <img src={t.imagenes[0]} className="w-full h-full object-cover" alt={t.nombre_es} />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-[10px]">NO IMG</div>
                                  )}
                                </div>
                                <span className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{t.nombre_es}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center text-xs font-semibold">{t.duracion_minutos} min</td>
                            <td className="py-4 px-6 text-center text-xs font-semibold">{t.capacidad_max_personas} pers.</td>
                            <td className="py-4 px-6 text-right font-black text-rose-500">€{t.precio}</td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditTour(t)}
                                  className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors"
                                  title="Editar Tour"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteTour(t.id)}
                                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                                  title="Eliminar Tour"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Listado de Reservas</h2>
              <div className={`overflow-hidden rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200/70'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-100 text-slate-500 bg-slate-50/50'}`}>
                        <th className="py-4 px-6">Reserva</th>
                        <th className="py-4 px-6">Cliente / Contacto</th>
                        <th className="py-4 px-6">Tour</th>
                        <th className="py-4 px-6">Fecha & Hora</th>
                        <th className="py-4 px-6">Personas</th>
                        <th className="py-4 px-6">Total</th>
                        <th className="py-4 px-6">Recogida</th>
                        <th className="py-4 px-6">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan={8} className={`py-12 text-center text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>No hay reservas registradas.</td>
                        </tr>
                      ) : (
                        reservations.map((r) => (
                          <tr key={r.id} className={`hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors`}>
                            <td className="py-4 px-6 text-sm font-bold">#{r.id}</td>
                            <td className="py-4 px-6">
                              <div className="space-y-0.5">
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{r.usuario_nombre || 'Usuario Desconocido'}</p>
                                <p className="text-xs text-slate-450">{r.usuario_email}</p>
                                <p className="text-xs text-slate-450">{r.usuario_telefono}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm font-bold">{r.tour_nombre_es || 'Tour Desconocido'}</td>
                            <td className="py-4 px-6">
                              <div className="text-sm font-semibold">
                                <p>{r.fecha_tour}</p>
                                <p className="text-xs font-normal text-slate-450">{r.hora_tour.slice(0, 5)} hrs</p>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm font-bold text-center md:text-left">{r.cantidad_personas}</td>
                            <td className="py-4 px-6 text-sm font-black text-rose-500">€{r.total_pagar}</td>
                            <td className="py-4 px-6">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500 dark:text-slate-300 max-w-[150px] truncate">
                                    {r.punto_recogida || 'No especificado'}
                                  </span>
                                  {r.punto_recogida && (
                                    <>
                                      <button
                                        onClick={() => setOpenMapReservationId(openMapReservationId === r.id ? null : r.id)}
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                                        title="Ver mapa"
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                      </button>
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.punto_recogida)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                                        title="Abrir en Google Maps"
                                      >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                      </a>
                                    </>
                                  )}
                                </div>
                                {openMapReservationId === r.id && r.punto_recogida && (
                                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <iframe
                                      width="100%"
                                      height="250"
                                      frameBorder="0"
                                      style={{ border: 0 }}
                                      src={`https://maps.google.com/maps?q=${encodeURIComponent(r.punto_recogida)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <select
                                value={r.estado_reserva}
                                onChange={(e) => handleUpdateReservationStatus(r.id, e.target.value)}
                                className="text-xs font-semibold border rounded-lg px-2 py-1"
                              >
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="cancelada">Cancelada</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Transacciones y Pagos</h2>

              <div className={`overflow-hidden rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200/70'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-100 text-slate-500 bg-slate-50/50'}`}>
                        <th className="py-4 px-6">ID Pago</th>
                        <th className="py-4 px-6">Pasarela</th>
                        <th className="py-4 px-6">ID Transacción</th>
                        <th className="py-4 px-6">Reserva / Cliente</th>
                        <th className="py-4 px-6">Monto</th>
                        <th className="py-4 px-6">Estado Pago</th>
                        <th className="py-4 px-6">Fecha Pago</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={`py-12 text-center text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>No hay registros de transacciones.</td>
                        </tr>
                      ) : (
                        payments.map((p) => (
                          <tr key={p.id} className={`hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors`}>
                            <td className="py-4 px-6 text-sm font-bold">#{p.id}</td>
                            <td className="py-4 px-6">
                              <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded ${p.pasarela === 'stripe' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-blue-500/10 text-blue-500'
                                }`}>
                                {p.pasarela}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm font-mono text-slate-450">{p.transaccion_id}</td>
                            <td className="py-4 px-6">
                              <div className="space-y-0.5">
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>Reserva #{p.reserva_id}</p>
                                <p className="text-xs text-slate-450">{p.usuario_nombre}</p>
                                <p className="text-xs text-slate-450">{p.tour_nombre_es}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm font-black text-emerald-500">
                              {p.monto} {p.moneda}
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {p.estado_pago}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-xs font-semibold text-slate-450">{p.pagado_en}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB USERS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Clientes y Usuarios</h2>
                <button
                  onClick={handleOpenCreateUser}
                  className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Crear Usuario
                </button>
              </div>

              <div className={`overflow-hidden rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200/70'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-100 text-slate-500 bg-slate-50/50'}`}>
                        <th className="py-4 px-6">ID</th>
                        <th className="py-4 px-6">Nombre Completo</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Teléfono</th>
                        <th className="py-4 px-6 text-center">Idioma</th>
                        <th className="py-4 px-6">Fecha Registro</th>
                        <th className="py-4 px-6 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={`py-12 text-center text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>No hay usuarios registrados.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className={`hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors`}>
                            <td className="py-4 px-6 text-sm font-bold">#{u.id}</td>
                            <td className="py-4 px-6">
                              <p className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{u.nombre}</p>
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>
                            <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{u.telefono || 'N/A'}</td>
                            <td className="py-4 px-6 text-center text-xs font-semibold uppercase">{u.idioma_preferido}</td>
                            <td className="py-4 px-6 text-xs font-semibold text-slate-450">{u.creado_en}</td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditUser(u)}
                                  className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors"
                                  title="Editar Usuario"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                                  title="Eliminar Usuario"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 0 00-1-1h-4a1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB CARRUSEL */}
          {activeTab === 'carrusel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Gestión del Carrusel</h2>
                <label className={`flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${carruselUploading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}>
                  {carruselUploading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  )}
                  {carruselUploading ? 'Subiendo...' : 'Subir Archivo'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleCarruselFileUpload}
                    disabled={carruselUploading}
                  />
                </label>
              </div>

              <div className={`overflow-hidden rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200/70'}`}>
                {carruselItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>No hay archivos en el carrusel.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {carruselItems.map((item) => (
                      <div key={item.id} className="relative group rounded-2xl overflow-hidden border aspect-video">
                        {isVideo(item.ruta_imagen) ? (
                          <video
                            src={item.ruta_imagen}
                            muted
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={item.ruta_imagen}
                            alt="Carrusel"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <button
                          onClick={() => handleDeleteCarrusel(item.id)}
                          className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB BACKGROUND */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              <h2 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Fondo de la Web</h2>

              <div className={`overflow-hidden rounded-2xl border p-6 ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200/70'}`}>
                <form onSubmit={handleSaveBackground} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-3">Tipo de Fondo</label>
                    <div className="flex gap-4">
                      <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${bgType === 'video' ? 'border-rose-500 bg-rose-500/10 text-rose-500' : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                        <input type="radio" name="bgType" value="video" checked={bgType === 'video'} onChange={() => setBgType('video')} className="sr-only" />
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold">Video</span>
                      </label>
                      <label className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${bgType === 'image' ? 'border-rose-500 bg-rose-500/10 text-rose-500' : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
                        <input type="radio" name="bgType" value="image" checked={bgType === 'image'} onChange={() => setBgType('image')} className="sr-only" />
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold">Imagen</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-3">URL del Fondo</label>
                    <input
                      type="text"
                      value={bgUrl}
                      onChange={(e) => setBgUrl(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-3">O subir un archivo</label>
                    <label className="flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-rose-500 hover:bg-rose-500/5">
                      {uploadingBg ? (
                        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm font-semibold">Haz clic para subir</span>
                        </>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept={bgType === 'image' ? 'image/*' : 'video/*'}
                        onChange={handleBgFileUpload}
                        disabled={uploadingBg}
                      />
                    </label>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-500/25"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tour Form Modal */}
      {tourFormOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-2xl mx-4 p-8 rounded-3xl border shadow-2xl transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {editingTourId ? 'Editar Tour' : 'Crear Tour'}
              </h2>
              <button onClick={() => setTourFormOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Nombre (ES)</label>
                  <input
                    type="text"
                    required
                    value={tourNombreEs}
                    onChange={(e) => setTourNombreEs(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Nombre (EN)</label>
                  <input
                    type="text"
                    required
                    value={tourNombreEn}
                    onChange={(e) => setTourNombreEn(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Nombre (PL)</label>
                  <input
                    type="text"
                    required
                    value={tourNombrePl}
                    onChange={(e) => setTourNombrePl(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Precio (€)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={tourPrecio}
                    onChange={(e) => setTourPrecio(parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Duración (min)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={tourDuracion}
                    onChange={(e) => setTourDuracion(parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Capacidad Máx</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={tourCapacidad}
                    onChange={(e) => setTourCapacidad(parseInt(e.target.value) || 4)}
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-3">Imágenes</label>
                <div className="space-y-3">
                  {tourImagenes.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {tourImagenes.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border">
                          <img src={img} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveTourImage(idx)}
                            className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="O pega una URL..."
                      value={newImageInput}
                      onChange={(e) => setNewImageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTourImage()}
                      className={`flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                    <button
                      type="button"
                      onClick={handleAddTourImage}
                      className="px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors"
                    >
                      Añadir
                    </button>
                  </div>

                  <label className="flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-rose-500">
                    {uploadingImage ? (
                      <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span className="text-sm font-semibold">Subir archivos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setTourFormOpen(false)}
                  className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-500/25"
                >
                  {editingTourId ? 'Guardar Cambios' : 'Crear Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {userFormOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-lg mx-4 p-8 rounded-3xl border shadow-2xl transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {editingUserId ? 'Editar Usuario' : 'Crear Usuario'}
              </h2>
              <button onClick={() => setUserFormOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={userNombre}
                  onChange={(e) => setUserNombre(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={userTelefono}
                  onChange={(e) => setUserTelefono(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">Idioma Preferido</label>
                <select
                  value={userIdioma}
                  onChange={(e) => setUserIdioma(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pl">Polski</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-2">
                  {editingUserId ? 'Nueva Contraseña (dejar en blanco para mantener)' : 'Contraseña'}
                </label>
                <input
                  type="password"
                  value={userContrasena}
                  onChange={(e) => setUserContrasena(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-all ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setUserFormOpen(false)}
                  className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-500/25"
                >
                  {editingUserId ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
