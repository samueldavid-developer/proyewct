import React, { useState, useEffect, useCallback } from 'react';

// Define the API URL
const API_URL = 'http://localhost/proyewct/admin_api.php';

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

interface CarruselImage {
  id: number | string;
  ruta_imagen: string;
}

interface AdminPanelProps {
  theme: string;
  onClose: () => void;
}

const AdminPanel = ({ theme, onClose }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'tours' | 'reservations' | 'payments' | 'users' | 'background' | 'carrusel'>('tours');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('admin_logged_in') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [carruselImages, setCarruselImages] = useState<CarruselImage[]>([]);
  const [carruselUploading, setCarruselUploading] = useState(false);

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
      if (data.success) {
        setIsLoggedIn(true);
        localStorage.setItem('admin_logged_in', 'true');
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
  };

  // Background State
  const [bgType, setBgType] = useState<'video' | 'image'>('video');
  const [bgUrl, setBgUrl] = useState('');
  const [uploadingBg, setUploadingBg] = useState(false);
  const [bgFormOpen, setBgFormOpen] = useState(false);

  const handleOpenEditBg = () => {
    setBgFormOpen(true);
  };

  const handleSaveBackground = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_settings',
          bg_url: bgUrl,
          bg_type: bgType
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('custom_bg_type', bgType);
        localStorage.setItem('custom_bg_url', bgUrl);
        setBgFormOpen(false);
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
        body: formData
      });

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

  // Modal de Ubicación
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

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
      if (activeTab === 'tours') {
        const res = await fetch(`${API_URL}?action=get_tours`);
        const data = await res.json();
        setTours(Array.isArray(data) ? data : []);
      } else if (activeTab === 'reservations') {
        const res = await fetch(`${API_URL}?action=get_reservations`);
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
      } else if (activeTab === 'payments') {
        const res = await fetch(`${API_URL}?action=get_payments`);
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } else if (activeTab === 'users') {
        const res = await fetch(`${API_URL}?action=get_users`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === 'carrusel') {
        const res = await fetch(`${API_URL}?action=get_carrusel`);
        const data = await res.json();
        setCarruselImages(Array.isArray(data) ? data : []);
      } else if (activeTab === 'background') {
        const res = await fetch(`${API_URL}?action=get_settings`);
        const data = await res.json();
        if (data.success && data.settings) {
          setBgUrl(data.settings.bg_url || '');
          setBgType(data.settings.bg_type || 'video');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      triggerNotification('Error al conectar con el servidor.', false);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

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
          body: formData
        });

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
      triggerNotification(error instanceof Error ? error.message : 'Error de conexión al subir la imagen.', false);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
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

    setCarruselUploading(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('image', file);

      const uploadRes = await fetch(`${API_URL}?action=upload_image`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Error al subir imagen.');
      }

      const saveRes = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_carrusel_image',
          ruta_imagen: uploadData.ruta_imagen
        })
      });
      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.error || 'Error al guardar imagen en el carrusel.');
      }

      triggerNotification('Imagen añadida al carrusel con éxito.');
      fetchData();
    } catch (error) {
      triggerNotification(error instanceof Error ? error.message : 'Error al subir la imagen.', false);
    } finally {
      setCarruselUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteCarrusel = async (id: number | string) => {
    if (!window.confirm('¿Eliminar esta imagen del carrusel?')) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_carrusel', id })
      });
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_tour', id })
      });
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_reservation_status', id, status })
      });
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', id })
      });
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
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
                    {/* ... arriba todo igual ... */}
                    <thead>
                      <tr className={`border-b text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-100 text-slate-500 bg-slate-50/50'}`}>
                        <th className="py-4 px-6">Reserva</th>
                        <th className="py-4 px-6">Cliente / Contacto</th>
                        <th className="py-4 px-6">Tour</th>
                        <th className="py-4 px-6">Fecha & Hora</th>
                        <th className="py-4 px-6">Personas</th>
                        <th className="py-4 px-6">Total</th>
                        <th className="py-4 px-6">Recogida</th> {/* <-- TU NUEVA COLUMNA */}
                        <th className="py-4 px-6">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {reservations.length === 0 ? (
                        <tr>
                          {/* CORREGIDO: Cambié colSpan de 7 a 8 porque ahora tienes 8 columnas */}
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
                              <div className="flex flex-col gap-1 max-w-[150px]">
                                <span className="truncate text-xs font-medium" title={r.punto_recogida}>
                                  {r.punto_recogida || 'No especificado'}
                                </span>
                                {r.punto_recogida && (
                                  <button
                                    onClick={() => {
                                      setSelectedLocation(r.punto_recogida || '');
                                      setLocationModalOpen(true);
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 text-left"
                                  >
                                    Ver ubicación
                                  </button>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <select
                                value={r.estado_reserva}
                                onChange={(e) => handleUpdateReservationStatus(r.id, e.target.value)}
                                className={`text-[10px] font-black uppercase tracking-widest rounded-lg px-3 py-2 focus:outline-none cursor-pointer border transition-all w-full ${r.estado_reserva === 'confirmada'
                                  ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-600 dark:bg-emerald-500/10'
                                  : r.estado_reserva === 'pendiente'
                                    ? 'bg-amber-500/15 border-amber-500/20 text-amber-600 dark:bg-amber-500/10'
                                    : 'bg-rose-500/15 border-rose-500/20 text-rose-500 dark:bg-rose-500/10'
                                  }`}
                              >
                                <option value="pendiente" className="bg-slate-900 text-white">Pendiente</option>
                                <option value="confirmada" className="bg-slate-900 text-white">Confirmada</option>
                                <option value="cancelada" className="bg-slate-900 text-white">Cancelada</option>
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
                        <th className="py-4 px-6">Contraseña</th>
                        <th className="py-4 px-6">Teléfono</th>
                        <th className="py-4 px-6 text-center">Idioma</th>
                        <th className="py-4 px-6">Fecha Registro</th>
                        <th className="py-4 px-6 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={8} className={`py-12 text-center text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>No hay usuarios guardados.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className={`hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors`}>
                            <td className="py-4 px-6 text-sm font-bold">{u.id}</td>
                            <td className="py-4 px-6 text-sm font-bold text-slate-850 dark:text-slate-100">{u.nombre}</td>
                            <td className="py-4 px-6 text-sm text-slate-450">{u.email}</td>
                            <td className="py-4 px-6 text-sm font-mono text-slate-450 select-none">••••••••</td>
                            <td className="py-4 px-6 text-sm font-semibold">{u.telefono || '—'}</td>
                            <td className="py-4 px-6 text-center">
                              <span className="text-[10px] font-black uppercase bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                                {u.idioma_preferido}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-xs text-slate-450">{u.creado_en}</td>
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
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Carrusel Web</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Gestiona las imágenes que rotan en la página pública.</p>
                </div>
                <label className="inline-flex items-center gap-3 cursor-pointer bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-rose-500/25 active:scale-95">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                  <span>{carruselUploading ? 'Subiendo Imagen...' : 'Añadir Imagen al Carrusel'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCarruselFileUpload}
                    className="hidden"
                    disabled={carruselUploading}
                  />
                </label>
              </div>

              <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                {carruselImages.length === 0 ? (
                  <div className={`col-span-full rounded-3xl border p-10 text-center ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    No hay imágenes en el carrusel.
                  </div>
                ) : (
                  carruselImages.map((item) => (
                    <div key={item.id} className={`rounded-3xl overflow-hidden border shadow-sm transition-colors ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
                      <div className="relative overflow-hidden">
                        <img src={item.ruta_imagen} alt={`Carrusel ${item.id}`} className="w-full h-56 object-cover" />
                        <button
                          onClick={() => handleDeleteCarrusel(item.id)}
                          className="absolute top-3 right-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-500/90 text-white hover:bg-rose-600 transition-all shadow-lg active:scale-90"
                          title="Eliminar imagen"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-4 text-xs text-slate-400 break-words">{item.ruta_imagen}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB BACKGROUND CONFIG */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Gestión de Fondo Web</h2>
                <button
                  onClick={handleOpenEditBg}
                  className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Configurar Fondo
                </button>
              </div>

              <div className={`p-8 rounded-3xl border text-center transition-colors ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200/70'}`}>
                <div className="max-w-md mx-auto">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20`}>
                    {bgType === 'video' ? (
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <h3 className={`text-lg font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Fondo Actual: {bgType === 'video' ? 'Vídeo Personalizado' : 'Imagen Estática'}
                  </h3>
                  <p className={`text-xs font-medium mb-6 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    {bgUrl ? `Ubicación: ${bgUrl}` : 'Usando fondos predeterminados del sistema'}
                  </p>

                  {bgUrl && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 aspect-video mb-6 relative group">
                      {bgType === 'video' ? (
                        <video src={bgUrl} muted autoPlay loop className="w-full h-full object-cover" />
                      ) : (
                        <img src={bgUrl} alt="Vista previa" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/20">Vista Previa Actual</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleOpenEditBg}
                      className="py-3 px-6 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white"
                    >
                      Editar Configuración
                    </button>
                    <button
                      onClick={() => {
                        setBgUrl('');
                        localStorage.removeItem('custom_bg_url');
                        triggerNotification('Se ha restablecido el fondo predeterminado.');
                      }}
                      className="py-3 px-6 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all border-slate-300 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Restablecer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL TOUR CRUD FORM */}
      {tourFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl border transition-colors max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/40 mb-6">
              <h3 className="text-xl font-black">{editingTourId ? 'Editar Tour' : 'Nuevo Tour'}</h3>
              <button
                onClick={() => setTourFormOpen(false)}
                className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Nombre (Español)</label>
                  <input
                    type="text"
                    required
                    value={tourNombreEs}
                    onChange={(e) => setTourNombreEs(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                      }`}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Nombre (Inglés)</label>
                  <input
                    type="text"
                    required
                    value={tourNombreEn}
                    onChange={(e) => setTourNombreEn(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                      }`}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Nombre (Polaco)</label>
                  <input
                    type="text"
                    required
                    value={tourNombrePl}
                    onChange={(e) => setTourNombrePl(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                      }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Duración (min)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={tourDuracion}
                    onChange={(e) => setTourDuracion(parseInt(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                      }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Precio (€)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    step="0.01"
                    value={tourPrecio}
                    onChange={(e) => setTourPrecio(parseFloat(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                      }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Capacidad</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={tourCapacidad}
                    onChange={(e) => setTourCapacidad(parseInt(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                      }`}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Imágenes del Slider</label>
                <div className={`p-4 mb-4 rounded-xl border border-dashed text-center transition-all ${theme === 'dark' ? 'bg-slate-950/40 border-slate-800 hover:border-rose-500' : 'bg-slate-50 border-slate-200 hover:border-rose-500'
                  }`}>
                  {uploadingImage ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-2">
                      <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-rose-500">Subiendo...</span>
                    </div>
                  ) : (
                    <label className="w-full flex flex-col items-center justify-center cursor-pointer py-2">
                      <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 text-center">Subir archivos desde tu PC</span>
                      <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="O escribe ruta manual..."
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTourImage(e)}
                    className={`flex-1 px-4 py-2 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                      }`}
                  />
                  <button type="button" onClick={() => handleAddTourImage()} className="bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider px-4 rounded-xl">Añadir</button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 bg-slate-100/50 dark:bg-slate-950/50 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  {tourImagenes.map((img, i) => (
                    <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded-lg border text-xs font-semibold ${theme === 'dark' ? 'bg-slate-900 border-slate-800/60' : 'bg-white border-slate-200/60'
                      }`}>
                      <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-950">
                        <img src={img} className="w-full h-full object-cover" alt="preview" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')} />
                      </div>
                      <span className="truncate flex-1 text-slate-500 dark:text-slate-400 font-mono text-[9px]">{img}</span>
                      <button type="button" onClick={() => handleRemoveTourImage(i)} className="text-rose-500 hover:text-rose-700 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setTourFormOpen(false)} className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-colors border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500'}`}>Cancelar</button>
                <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-xl shadow-sm">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL USER CRUD FORM */}
      {userFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/40 mb-6">
              <h3 className="text-xl font-black">{editingUserId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button onClick={() => setUserFormOpen(false)} className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none`}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Nombre Completo</label>
                <input type="text" required value={userNombre} onChange={(e) => setUserNombre(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'}`} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Email</label>
                <input type="email" required value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'}`} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Teléfono</label>
                <input type="tel" value={userTelefono} onChange={(e) => setUserTelefono(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'}`} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Contraseña</label>
                <input type="password" required={editingUserId === null} placeholder={editingUserId !== null ? "Dejar en blanco para no cambiar" : "Contraseña"} value={userContrasena} onChange={(e) => setUserContrasena(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'}`} />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5">Idioma Preferido</label>
                <select value={userIdioma} onChange={(e) => setUserIdioma(e.target.value)} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'}`}>
                  <option value="es" className="bg-slate-900 text-white">Español</option>
                  <option value="en" className="bg-slate-900 text-white">Inglés</option>
                  <option value="pl" className="bg-slate-900 text-white">Polaco</option>
                  <option value="it" className="bg-slate-900 text-white">Italiano</option>
                  <option value="pt" className="bg-slate-900 text-white">Portugués</option>
                  <option value="fr" className="bg-slate-900 text-white">Francés</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setUserFormOpen(false)} className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-colors border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500'}`}>Cancelar</button>
                <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-xl shadow-sm">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BACKGROUND CONFIG FORM */}
      {bgFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/40 mb-6">
              <h3 className="text-xl font-black">Configurar Fondo Web</h3>
              <button
                onClick={() => setBgFormOpen(false)}
                className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <h4 className="text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-2">
                ⚠️ Especificaciones de Calidad
              </h4>
              <ul className="text-[10px] space-y-1 text-amber-700/80 dark:text-amber-300/60 font-semibold list-disc ml-4">
                <li>Desktop solamente (No afecta a móviles).</li>
                <li>Vídeos: Máx. 1 minuto, formato MP4.</li>
                <li>Imágenes: Alta resolución (1920x1080).</li>
              </ul>
            </div>

            <form onSubmit={handleSaveBackground} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">1. Seleccionar Tipo</label>
                <div className="flex gap-3">
                  {['video', 'image'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBgType(type as 'video' | 'image')}
                      className={`flex-1 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${bgType === type
                        ? 'bg-indigo-500 border-indigo-500 text-white shadow-md'
                        : theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                    >
                      {type === 'video' ? '📽️ Vídeo' : '🖼️ Imagen'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">2. Subir Archivo</label>
                <div className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all ${theme === 'dark'
                  ? 'bg-slate-950/40 border-slate-800 hover:border-indigo-500'
                  : 'bg-slate-50 border-slate-200 hover:border-indigo-500'
                  }`}>
                  {uploadingBg ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-4">
                      <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black uppercase text-indigo-500">Subiendo...</span>
                    </div>
                  ) : (
                    <label className="w-full flex flex-col items-center justify-center cursor-pointer py-2">
                      <svg className="w-10 h-10 text-slate-400 mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Seleccionar {bgType === 'video' ? 'Vídeo' : 'Imagen'}</span>
                      <input
                        type="file"
                        accept={bgType === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleBgFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">3. Confirmar Ruta</label>
                <input
                  type="text"
                  placeholder="URL o ruta del archivo"
                  value={bgUrl}
                  onChange={(e) => setBgUrl(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-xs font-mono focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'
                    }`}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBgFormOpen(false)}
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors border ${theme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-950'
                    }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Aplicar Fondo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE UBICACIÓN COMPLETA */}
      {locationModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-8 shadow-2xl border animate-bounce-in transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Dirección de Recogida</h3>
            </div>

            <div className={`p-6 rounded-2xl mb-8 border text-center font-bold leading-relaxed ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-150 text-slate-650'
              }`}>
              {selectedLocation}
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLocation)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Abrir en Google Maps
              </a>
              <button
                onClick={() => setLocationModalOpen(false)}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-colors border ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-950'
                  }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminPanel;
