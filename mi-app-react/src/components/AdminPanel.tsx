import { useState, useEffect } from 'react';

interface Tour {
  id: number;
  nombre_es: string;
  nombre_en: string;
  nombre_pl: string;
  duracion_minutos: number;
  precio: number;
  capacidad_max_personas: number;
  imagenes: string[];
}

interface Reservation {
  id: number;
  usuario_id: number;
  tour_id: number;
  fecha_tour: string;
  hora_tour: string;
  cantidad_personas: number;
  total_pagar: number;
  estado_reserva: 'pendiente' | 'confirmada' | 'cancelada';
  creado_en: string;
  usuario_nombre?: string;
  usuario_email?: string;
  usuario_telefono?: string;
  tour_nombre_es?: string;
  tour_nombre_en?: string;
  tour_nombre_pl?: string;
}

interface Payment {
  id: number;
  reserva_id: number;
  pasarela: 'stripe' | 'paypal';
  transaccion_id: string;
  monto: number;
  moneda: string;
  estado_pago: string;
  pagado_en: string;
  usuario_nombre?: string;
  usuario_email?: string;
  tour_nombre_es?: string;
  fecha_tour?: string;
  hora_tour?: string;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  idioma_preferido: string;
  creado_en: string;
  contrasena: string;
}

interface AdminPanelProps {
  theme: string;
  onClose: () => void;
}

const API_URL = 'http://localhost/proyewct/admin_api.php';

export default function AdminPanel({ theme, onClose }: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('admin_logged') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'tours' | 'reservations' | 'payments' | 'users'>('tours');
  const [tours, setTours] = useState<Tour[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tour Form State
  const [tourFormOpen, setTourFormOpen] = useState(false);
  const [editingTourId, setEditingTourId] = useState<number | null>(null);
  const [tourNombreEs, setTourNombreEs] = useState('');
  const [tourNombreEn, setTourNombreEn] = useState('');
  const [tourNombrePl, setTourNombrePl] = useState('');
  const [tourDuracion, setTourDuracion] = useState(60);
  const [tourPrecio, setTourPrecio] = useState(89);
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
  const [userIdioma, setUserIdioma] = useState('es');
  const [userContrasena, setUserContrasena] = useState('');

  // Stats
  const [stats, setStats] = useState({
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0
  });

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Fetch tours
      const toursRes = await fetch(`${API_URL}?action=get_tours`);
      if (!toursRes.ok) throw new Error('Error al obtener tours');
      const toursData = await toursRes.json();
      setTours(toursData);

      // Fetch reservations
      const resRes = await fetch(`${API_URL}?action=get_reservations`);
      if (!resRes.ok) throw new Error('Error al obtener reservas');
      const resData = await resRes.json();
      setReservations(resData);

      // Fetch payments
      const payRes = await fetch(`${API_URL}?action=get_payments`);
      if (!payRes.ok) throw new Error('Error al obtener pagos');
      const payData = await payRes.json();
      setPayments(payData);

      // Fetch users
      const usersRes = await fetch(`${API_URL}?action=get_users`);
      if (!usersRes.ok) throw new Error('Error al obtener usuarios');
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Calculate stats
      const totalRev = payData
        .filter((p: Payment) => p.estado_pago.toLowerCase().includes('completado') || p.estado_pago.toLowerCase().includes('succeeded') || p.estado_pago.toLowerCase() === 'paid')
        .reduce((sum: number, p: Payment) => sum + Number(p.monto), 0);

      setStats({
        totalTours: toursData.length,
        totalBookings: resData.length,
        totalRevenue: totalRev,
        totalUsers: usersData.length
      });

    } catch (err: any) {
      console.error(err);
      setErrorMsg('No se pudieron conectar los datos con el servidor PHP en localhost.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const triggerNotification = (msg: string, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 5000);
    }
  };

  // TOURS CRUD actions
  const handleOpenCreateTour = () => {
    setEditingTourId(null);
    setTourNombreEs('');
    setTourNombreEn('');
    setTourNombrePl('');
    setTourDuracion(60);
    setTourPrecio(89);
    setTourCapacidad(4);
    setTourImagenes([]);
    setNewImageInput('');
    setTourFormOpen(true);
  };

  const handleOpenEditTour = (tour: Tour) => {
    setEditingTourId(tour.id);
    setTourNombreEs(tour.nombre_es);
    setTourNombreEn(tour.nombre_en);
    setTourNombrePl(tour.nombre_pl);
    setTourDuracion(tour.duracion_minutos);
    setTourPrecio(tour.precio);
    setTourCapacidad(tour.capacidad_max_personas);
    setTourImagenes(tour.imagenes || []);
    setNewImageInput('');
    setTourFormOpen(true);
  };

  const handleAddTourImage = () => {
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
    const file = files[0];

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await fetch(`${API_URL}?action=upload_image`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al subir la imagen');
      }

      setTourImagenes((prev) => [...prev, data.ruta_imagen]);
      triggerNotification('¡Imagen subida con éxito!');
    } catch (err: any) {
      triggerNotification(err.message || 'Error de conexión al subir la imagen.', false);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        action: 'save_tour',
        id: editingTourId,
        nombre_es: tourNombreEs,
        nombre_en: tourNombreEn,
        nombre_pl: tourNombrePl,
        duracion_minutos: tourDuracion,
        precio: tourPrecio,
        capacidad_max_personas: tourCapacidad,
        imagenes: tourImagenes
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error al guardar el tour');

      triggerNotification(editingTourId ? '¡Tour actualizado con éxito!' : '¡Nuevo tour registrado con éxito!');
      setTourFormOpen(false);
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message, false);
    }
  };

  const handleDeleteTour = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este tour? Se eliminarán también sus referencias de imágenes.')) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_tour', id })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error al eliminar el tour');

      triggerNotification('Tour eliminado correctamente.');
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message, false);
    }
  };

  // USERS CRUD actions
  const handleOpenCreateUser = () => {
    setEditingUserId(null);
    setUserNombre('');
    setUserEmail('');
    setUserTelefono('');
    setUserIdioma('es');
    setUserContrasena('');
    setUserFormOpen(true);
  };

  const handleOpenEditUser = (u: User) => {
    setEditingUserId(u.id);
    setUserNombre(u.nombre);
    setUserEmail(u.email);
    setUserTelefono(u.telefono || '');
    setUserIdioma(u.idioma_preferido || 'es');
    setUserContrasena(''); // No cargar el hash en el input por seguridad y para control de actualización
    setUserFormOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        action: 'save_user',
        id: editingUserId,
        nombre: userNombre,
        email: userEmail,
        telefono: userTelefono,
        idioma_preferido: userIdioma,
        contrasena: userContrasena
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error al guardar el usuario');

      triggerNotification(editingUserId ? '¡Usuario actualizado con éxito!' : '¡Nuevo usuario registrado con éxito!');
      setUserFormOpen(false);
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message, false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_user', id })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error al eliminar el usuario');

      triggerNotification('Usuario eliminado correctamente.');
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message, false);
    }
  };

  // RESERVATION update status action
  const handleUpdateReservationStatus = async (id: number, status: 'pendiente' | 'confirmada' | 'cancelada') => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_reservation_status',
          id,
          estado_reserva: status
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error al actualizar estado');

      triggerNotification('Estado de reserva actualizado correctamente.');
      fetchData();
    } catch (err: any) {
      triggerNotification(err.message, false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          contrasena: loginPassword
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      sessionStorage.setItem('admin_logged', 'true');
      sessionStorage.setItem('admin_user', JSON.stringify(data.user));
      setIsLoggedIn(true);
      triggerNotification(`¡Bienvenido, ${data.user.nombre}!`);
    } catch (err: any) {
      setLoginError(err.message || 'Error de conexión al servidor.');
      triggerNotification(err.message || 'Error al iniciar sesión.', false);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged');
    sessionStorage.removeItem('admin_user');
    setIsLoggedIn(false);
    triggerNotification('Sesión cerrada correctamente.');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className={`max-w-md w-full p-8 rounded-3xl border shadow-xl transition-all duration-500 ${
          theme === 'dark' 
            ? 'bg-slate-900 border-slate-800 text-white' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="text-center mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-rose-500">Acceso de Administración</span>
            <h2 className="mt-2 text-3xl font-black">Nina Tuk Tours</h2>
            <p className={`mt-2 text-xs transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Introduce tu correo y contraseña registrados para acceder.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            {loginError && (
              <div className="p-3 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 text-center animate-pulse">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Correo Electrónico</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ejemplo@email.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Contraseña</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-xs font-black uppercase tracking-wider text-white bg-rose-500 hover:bg-rose-600 focus:outline-none transition-colors disabled:opacity-50"
            >
              {loginLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Helper panel */}
          <div className={`mt-6 p-4 rounded-xl border border-dashed text-xs ${
            theme === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <p className="font-bold mb-1">💡 Credenciales de prueba:</p>
            <p><strong>Email:</strong> alice@example.com</p>
            <p><strong>Password:</strong> alice_pass</p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={onClose}
              className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-450 hover:text-slate-950'
              }`}
            >
              Volver a la web principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Alert Notifications */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="fixed bottom-6 right-6 bg-rose-500 text-white px-5 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex items-center justify-between border-b pb-5 mb-8 border-slate-200/50 dark:border-slate-800/50">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Panel de Control</span>
          <h1 className={`text-3xl font-black transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Nina Tuk Tours Admin
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider rounded-xl border transition-all duration-300 bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
          <button
            onClick={onClose}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider rounded-xl border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-650 hover:text-slate-950 hover:border-slate-350'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la Web
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`p-5 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200/60'}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tours Registrados</p>
          <p className={`text-2xl font-black mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stats.totalTours}</p>
        </div>
        <div className={`p-5 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200/60'}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Reservaciones</p>
          <p className={`text-2xl font-black mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stats.totalBookings}</p>
        </div>
        <div className={`p-5 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200/60'}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Ingresos Totales</p>
          <p className="text-2xl font-black mt-1 text-emerald-500">€{stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className={`p-5 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200/60'}`}>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Clientes Totales</p>
          <p className={`text-2xl font-black mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stats.totalUsers}</p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex gap-2 p-1.5 rounded-xl mb-8 select-none max-w-lg transition-colors bg-slate-250/20 dark:bg-slate-900/40">
        {(['tours', 'reservations', 'payments', 'users'] as const).map((tab) => {
          const labels = {
            tours: 'Tours',
            reservations: 'Reservas',
            payments: 'Pagos',
            users: 'Usuarios'
          };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-rose-500 text-white shadow-sm'
                  : theme === 'dark'
                    ? 'text-slate-450 hover:text-white'
                    : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Main Board Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={`text-xs font-bold uppercase tracking-widest mt-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Cargando información...</p>
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear Nuevo Tour
                </button>
              </div>

              <div className={`overflow-hidden rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-200/70'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'border-slate-800 text-slate-400 bg-slate-950/40' : 'border-slate-100 text-slate-500 bg-slate-50/50'}`}>
                        <th className="py-4 px-6">ID</th>
                        <th className="py-4 px-6">Nombre (ES / EN / PL)</th>
                        <th className="py-4 px-6">Duración</th>
                        <th className="py-4 px-6">Precio</th>
                        <th className="py-4 px-6">Capacidad</th>
                        <th className="py-4 px-6">Imágenes</th>
                        <th className="py-4 px-6 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {tours.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={`py-12 text-center text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>No hay tours guardados en la base de datos.</td>
                        </tr>
                      ) : (
                        tours.map((t) => (
                          <tr key={t.id} className={`hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors`}>
                            <td className="py-4 px-6 text-sm font-semibold">{t.id}</td>
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{t.nombre_es}</p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.nombre_en}</p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{t.nombre_pl}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm font-semibold">{t.duracion_minutos} min</td>
                            <td className="py-4 px-6 text-sm font-black text-rose-500">€{t.precio}</td>
                            <td className="py-4 px-6 text-sm font-semibold">{t.capacidad_max_personas} pers.</td>
                            <td className="py-4 px-6">
                              <div className="flex gap-1.5 overflow-hidden">
                                {t.imagenes && t.imagenes.length > 0 ? (
                                  t.imagenes.slice(0, 3).map((img, i) => (
                                    <img
                                      key={i}
                                      src={img}
                                      alt="preview"
                                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                      }}
                                    />
                                  ))
                                ) : (
                                  <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>Sin imágenes</span>
                                )}
                                {t.imagenes && t.imagenes.length > 3 && (
                                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-500`}>
                                    +{t.imagenes.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditTour(t)}
                                  className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors"
                                  title="Editar Tour"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteTour(t.id)}
                                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                                  title="Eliminar Tour"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
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
              <h2 className={`text-xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Historial de Reservaciones</h2>

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
                        <th className="py-4 px-6">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan={7} className={`py-12 text-center text-sm font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>No hay reservas registradas.</td>
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
                              <select
                                value={r.estado_reserva}
                                onChange={(e) => handleUpdateReservationStatus(r.id, e.target.value as any)}
                                className={`text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer border transition-all ${
                                  r.estado_reserva === 'confirmada'
                                    ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-500 dark:bg-emerald-500/10'
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
                              <span className={`text-xs font-black uppercase tracking-wider px-2 py-1 rounded ${
                                p.pasarela === 'stripe' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-blue-500/10 text-blue-500'
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
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
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                                  title="Eliminar Usuario"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
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
        </div>
      )}

      {/* MODAL TOUR CRUD FORM */}
      {tourFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl border transition-colors max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/40 mb-6">
              <h3 className="text-xl font-black">{editingTourId ? 'Editar Tour' : 'Nuevo Tour'}</h3>
              <button
                onClick={() => setTourFormOpen(false)}
                className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
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
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
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
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Duración (minutos)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={tourDuracion}
                    onChange={(e) => setTourDuracion(parseInt(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
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
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Capacidad Máx.</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={tourCapacidad}
                    onChange={(e) => setTourCapacidad(parseInt(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                    }`}
                  />
                </div>
              </div>

              {/* IMAGES SUB-CRUD INSIDE TOUR FORM */}
              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Imágenes para el Slider del Tour</label>
                
                {/* File upload section */}
                <div className={`p-4 mb-4 rounded-xl border border-dashed text-center transition-all ${
                  theme === 'dark' 
                    ? 'bg-slate-950/40 border-slate-800 hover:border-rose-500' 
                    : 'bg-slate-50 border-slate-200 hover:border-rose-500'
                }`}>
                  {uploadingImage ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-2">
                      <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-rose-500">Subiendo imagen...</span>
                    </div>
                  ) : (
                    <label className="w-full flex flex-col items-center justify-center cursor-pointer py-2">
                      <svg className="w-8 h-8 text-slate-400 mb-2 group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Subir nueva imagen desde tu equipo</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">(Formatos: JPG, PNG, WEBP, SVG)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                {/* Manual text input fallback */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="O escribe ruta manual: ej. media/madrid_austrias_1.jpg"
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    className={`flex-1 px-4 py-2 rounded-xl border text-sm focus:outline-none transition-colors ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddTourImage}
                    className="bg-indigo-500 hover:bg-indigo-650 text-white font-bold text-xs uppercase tracking-wider px-4 rounded-xl transition-colors"
                  >
                    Añadir
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto p-1 bg-slate-100/50 dark:bg-slate-950/50 rounded-xl">
                  {tourImagenes.length === 0 ? (
                    <p className={`text-center py-4 text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>No se han añadido imágenes aún.</p>
                  ) : (
                    tourImagenes.map((img, i) => (
                      <div key={i} className={`flex items-center justify-between py-1.5 px-3 rounded-lg border text-xs font-semibold ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-800/60' : 'bg-white border-slate-200/60'
                      }`}>
                        <span className="truncate max-w-[80%]">{img}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTourImage(i)}
                          className="text-rose-500 hover:text-rose-700 transition-colors p-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTourFormOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-950'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL USER CRUD FORM */}
      {userFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border transition-colors ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-800/40 mb-6">
              <h3 className="text-xl font-black">{editingUserId ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button
                onClick={() => setUserFormOpen(false)}
                className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={userNombre}
                  onChange={(e) => setUserNombre(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Teléfono</label>
                <input
                  type="tel"
                  value={userTelefono}
                  onChange={(e) => setUserTelefono(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Contraseña</label>
                <input
                  type="password"
                  required={editingUserId === null}
                  placeholder={editingUserId !== null ? "Dejar en blanco para no cambiar" : "Contraseña"}
                  value={userContrasena}
                  onChange={(e) => setUserContrasena(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                  }`}
                />
                {editingUserId !== null && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    Deja este campo en blanco para conservar la contraseña actual sin cambios.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Idioma Preferido</label>
                <select
                  value={userIdioma}
                  onChange={(e) => setUserIdioma(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-slate-200' : 'bg-slate-50 border-slate-200 focus:border-rose-500'
                  }`}
                >
                  <option value="es" className="bg-slate-900 text-white">Español</option>
                  <option value="en" className="bg-slate-900 text-white">Inglés</option>
                  <option value="pl" className="bg-slate-900 text-white">Polaco</option>
                  <option value="it" className="bg-slate-900 text-white">Italiano</option>
                  <option value="pt" className="bg-slate-900 text-white">Portugués</option>
                  <option value="fr" className="bg-slate-900 text-white">Francés</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUserFormOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-950'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
