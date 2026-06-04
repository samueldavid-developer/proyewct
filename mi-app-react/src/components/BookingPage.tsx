import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../utils/translate';

interface Tour {
  id: number;
  nombre_es: string;
  nombre_en: string;
  nombre_pl: string;
  precio: number;
  duracion_minutos: number;
  capacidad_max_personas: number;
  imagenes?: string[];
}

interface BookingPageProps {
  theme: string;
  tourId: number;
  onClose: () => void;
}

const API_URL = 'http://localhost/proyewct/admin_api.php';

export default function BookingPage({ theme, tourId, onClose }: BookingPageProps) {
  const { i18n } = useTranslation();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [successReservaId, setSuccessReservaId] = useState(0);

  // Form Fields
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('10:00');
  const [personas, setPersonas] = useState(1);

  // Payment Fields
  const [gateway, setGateway] = useState<'stripe' | 'paypal'>('stripe');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [translatedName, setTranslatedName] = useState('');

  useEffect(() => {
    // Fetch tour information
    fetch(`${API_URL}?action=get_tours`)
      .then((res) => res.json())
      .then((data: Tour[]) => {
        const found = data.find((t) => Number(t.id) === Number(tourId));
        if (found) {
          setTour(found);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [tourId]);

  const images = tour?.imagenes && tour.imagenes.length > 0 ? tour.imagenes : [];

  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'es';

  useEffect(() => {
    if (!tour) return;
    if (currentLang === 'es') {
      setTranslatedName(tour.nombre_es);
      return;
    }
    if (currentLang === 'en' && tour.nombre_en) {
      setTranslatedName(tour.nombre_en);
      return;
    }
    if (currentLang === 'pl' && tour.nombre_pl) {
      setTranslatedName(tour.nombre_pl);
      return;
    }

    translateText(tour.nombre_es, 'es', currentLang)
      .then((resText) => setTranslatedName(resText))
      .catch(() => setTranslatedName(tour.nombre_en || tour.nombre_es));
  }, [tour, currentLang]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/[^0-9]/g, '');
    if (clean.length > 2) {
      clean = clean.slice(0, 2) + '/' + clean.slice(2, 4);
    }
    setCardExpiry(clean.slice(0, 5));
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;
    setPaying(true);
    setErrorMsg('');

    try {
      const mockTxId = gateway === 'stripe' 
        ? 'ch_' + Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase()
        : 'PAYID-' + Math.random().toString(36).substring(2, 15).toUpperCase();

      const payload = {
        action: 'create_booking',
        nombre,
        email,
        telefono,
        idioma_preferido: currentLang,
        tour_id: tour.id,
        fecha_tour: fecha,
        hora_tour: hora,
        cantidad_personas: personas,
        total_pagar: tour.precio,
        pasarela: gateway,
        transaccion_id: mockTxId,
        estado_pago: 'completado'
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar la reserva');
      }

      setSuccessReservaId(data.reserva_id);
      setBookingSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Ocurrió un error en el pago. Inténtalo de nuevo.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24">
        <div className="inline-block w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={`text-xs font-bold uppercase tracking-widest mt-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          Cargando detalles del tour...
        </p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="text-center py-24">
        <p className="text-rose-500 font-bold">Error: El tour seleccionado no existe en el sistema.</p>
        <button onClick={onClose} className="mt-4 px-6 py-2.5 bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider">
          Volver a Tours
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Back button header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-8 border-slate-200/50 dark:border-slate-800/50">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Reserva de Tour</span>
          <h1 className={`text-2xl sm:text-3xl font-black transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Confirmar y Reservar
          </h1>
        </div>
        <button
          onClick={onClose}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-300 self-start sm:self-auto w-fit ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              : 'bg-white border-slate-200 text-slate-650 hover:text-slate-950 hover:border-slate-350'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Tours
        </button>
      </div>

      {bookingSuccess ? (
        /* SUCCESS PAGE */
        <div className={`p-6 sm:p-8 md:p-12 rounded-3xl border shadow-lg text-center max-w-xl mx-auto transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className={`text-3xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            ¡Pago y Reserva Confirmados!
          </h2>
          <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Gracias, <strong>{nombre}</strong>. Hemos registrado con éxito tu pago de <strong>€{tour.precio}</strong> para el <strong>{translatedName}</strong>.
          </p>

          <div className={`p-4 rounded-2xl mb-8 font-mono text-left space-y-2 border text-xs ${
            theme === 'dark' ? 'bg-slate-950/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-150 text-slate-650'
          }`}>
            <p><strong>Código de Reserva:</strong> NTT-{successReservaId}</p>
            <p><strong>Fecha del Tour:</strong> {fecha}</p>
            <p><strong>Hora de Salida:</strong> {hora} hrs</p>
            <p><strong>Cantidad de Pasajeros:</strong> {personas} {personas === 1 ? 'persona' : 'personas'}</p>
            <p><strong>Pasarela de Pago:</strong> {gateway.toUpperCase()} (Completado)</p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-sm"
          >
            Regresar al Inicio
          </button>
        </div>
      ) : (
        /* BOOKING FORM AND ELEVATOR SLIDER */
        <form onSubmit={handleSubmitBooking} className="animate-fade-in w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: TOUR DETAILS, MARQUEE IMAGES & PERSONAL DETAILS / SCHEDULE FORM */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Tour Info & Image Marquee */}
              <div className={`rounded-3xl p-5 border transition-colors ${
                theme === 'dark' ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200/65'
              }`}>
                <h3 className={`font-black text-lg mb-3 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-850'}`}>
                  {translatedName}
                </h3>
                <div className="flex gap-4 items-center text-xs font-bold text-slate-450 uppercase mb-4">
                  <span>⏱️ {tour.duracion_minutos} min</span>
                  <span>👥 Máx. {tour.capacidad_max_personas} pers</span>
                  <span className="text-rose-500">€{tour.precio} (Flat Rate)</span>
                </div>

                {/* Elevator Container - Infinite Passive Vertical Marquee */}
                {images.length > 0 ? (
                  images.length > 1 ? (
                    <div className="relative h-64 md:h-[320px] rounded-2xl overflow-hidden border border-slate-200/20 bg-slate-950 flex flex-col">
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="flex flex-col animate-vertical-scroll">
                          {[...images, ...images].map((img, i) => (
                            <div key={i} className="w-full h-56 flex-shrink-0 pb-4 px-2">
                              <img
                                src={img}
                                alt={`Tour visual ${i + 1}`}
                                className="w-full h-full object-cover rounded-xl select-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-64 md:h-[320px] rounded-2xl overflow-hidden border border-slate-200/20 bg-slate-950">
                      <img
                        src={images[0]}
                        alt="Tour image"
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                  )
                ) : (
                  <div className="w-full h-64 md:h-[320px] rounded-2xl overflow-hidden border border-slate-200/20 bg-slate-950 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 1. Datos Personales */}
              <div className={`p-6 md:p-8 rounded-3xl border shadow-md space-y-4 transition-colors ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-800/70' : 'bg-white border-slate-200/70'
              }`}>
                <h3 className={`text-base font-extrabold pb-2 border-b border-slate-200/30 dark:border-slate-800/30 ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  1. Tus Datos Personales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Juan Pérez"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="juan@ejemplo.com"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Teléfono</label>
                    <input
                      type="tel"
                      required
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="+34 600 000 000"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Número de Pasajeros</label>
                    <select
                      value={personas}
                      onChange={(e) => setPersonas(parseInt(e.target.value))}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-slate-250' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-850'
                      }`}
                    >
                      {Array.from({ length: tour.capacidad_max_personas || 4 }, (_, idx) => (
                        <option key={idx + 1} value={idx + 1} className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}>
                          {idx + 1} {idx + 1 === 1 ? 'persona' : 'personas'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Agenda */}
              <div className={`p-6 md:p-8 rounded-3xl border shadow-md space-y-4 transition-colors ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-800/70' : 'bg-white border-slate-200/70'
              }`}>
                <h3 className={`text-base font-extrabold pb-2 border-b border-slate-200/30 dark:border-slate-800/30 ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  2. Fecha y Hora de Salida
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Fecha del Viaje</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-slate-250' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Hora de Salida</label>
                    <select
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-slate-200' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-850'
                      }`}
                    >
                      <option value="09:00" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-850'}>09:00 hrs</option>
                      <option value="10:30" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-850'}>10:30 hrs</option>
                      <option value="12:00" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-850'}>12:00 hrs</option>
                      <option value="13:30" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-850'}>13:30 hrs</option>
                      <option value="15:00" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-855'}>15:00 hrs</option>
                      <option value="16:30" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-850'}>16:30 hrs</option>
                      <option value="18:00" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-850'}>18:00 hrs</option>
                      <option value="19:30" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-850'}>19:30 hrs</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ALL BILLING DETAILS & GATEWAYS */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Form errors */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-center font-bold text-xs animate-fade-in">
                  {errorMsg}
                </div>
              )}

              {/* Price detail block / Facturación */}
              <div className={`p-6 md:p-8 rounded-3xl border shadow-md transition-colors ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-800/70' : 'bg-white border-slate-200/70'
              }`}>
                <h3 className={`text-base font-extrabold pb-2 border-b border-slate-200/30 dark:border-slate-800/30 mb-4 ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  Resumen de Facturación
                </h3>
                <div className="flex justify-between text-sm mb-2.5">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}>
                    Tour ({tour.duracion_minutos} minutos)
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-250">€{tour.precio}</span>
                </div>
                <div className="flex justify-between text-sm mb-4 border-b border-dashed pb-3 border-slate-200 dark:border-slate-800">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}>Gastos de gestión</span>
                  <span className="text-emerald-500 font-bold">GRATIS</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-250' : 'text-slate-850'}`}>Total a Pagar</span>
                  <span className="text-3xl font-black text-rose-500">€{tour.precio}</span>
                </div>
              </div>

              {/* Pasarela de Pago */}
              <div className={`p-6 md:p-8 rounded-3xl border shadow-md space-y-6 transition-colors ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-800/70' : 'bg-white border-slate-200/70'
              }`}>
                <h3 className={`text-base font-extrabold pb-2 border-b border-slate-200/30 dark:border-slate-800/30 ${
                  theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  3. Pasarela de Pago
                </h3>

                {/* Gateway Tab selector */}
                <div className="flex gap-2 p-1 rounded-xl bg-slate-200/30 dark:bg-slate-950/40 select-none">
                  <button
                    type="button"
                    onClick={() => setGateway('stripe')}
                    className={`flex-1 py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      gateway === 'stripe'
                        ? 'bg-indigo-500 text-white shadow-sm'
                        : theme === 'dark'
                          ? 'text-slate-450 hover:text-white'
                          : 'text-slate-500 hover:text-slate-950'
                    }`}
                  >
                    💳 Tarjeta (Stripe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGateway('paypal')}
                    className={`flex-1 py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      gateway === 'paypal'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : theme === 'dark'
                          ? 'text-slate-450 hover:text-white'
                          : 'text-slate-500 hover:text-slate-950'
                    }`}
                  >
                    🔵 PayPal
                  </button>
                </div>

                {gateway === 'stripe' ? (
                  /* STRIPE / CREDIT CARD VIEW WITH PREMIUM GLASS CARD PREVIEW */
                  <div className="space-y-5 animate-fade-in">
                    
                    {/* Visual Card Preview */}
                    <div className="relative w-full h-40 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-indigo-600 text-white p-5 shadow-md overflow-hidden flex flex-col justify-between select-none">
                      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">Stripe Secure</span>
                        <div className="flex gap-1">
                          <span className="w-4 h-4 rounded-full bg-red-500/80 -mr-2"></span>
                          <span className="w-4 h-4 rounded-full bg-yellow-500/80"></span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] text-white/60 tracking-wider">Número de Tarjeta</p>
                        <p className="text-sm font-mono tracking-widest font-black truncate">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[8px] text-white/60 uppercase tracking-widest">Titular</p>
                          <p className="text-[11px] font-black tracking-wide truncate max-w-[150px] uppercase">
                            {cardName || 'Nombre Titular'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] text-white/60 uppercase tracking-widest text-right">Vence</p>
                          <p className="text-[11px] font-black tracking-wide text-right">
                            {cardExpiry || 'MM/AA'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nombre en la Tarjeta</label>
                        <input
                          type="text"
                          required={gateway === 'stripe'}
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="JUAN PEREZ PEREZ"
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm uppercase focus:outline-none transition-colors ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Número de Tarjeta</label>
                        <input
                          type="text"
                          required={gateway === 'stripe'}
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4000 1234 5678 9010"
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none transition-colors ${
                            theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Vencimiento</label>
                          <input
                            type="text"
                            required={gateway === 'stripe'}
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="12/28"
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                              theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">CVC / CVV</label>
                          <input
                            type="text"
                            required={gateway === 'stripe'}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                            placeholder="123"
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                              theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* PAYPAL INTERFACE MOCK */
                  <div className="p-6 rounded-2xl text-center space-y-3 animate-fade-in border border-dashed border-blue-500/20 bg-blue-500/5">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.076 2.133a1 1 0 00-.77.377L2.302 7.7a1 1 0 00.17 1.4l5.19 3.931a1 1 0 001.38-.17l4.004-5.192a1 1 0 00-.17-1.4l-5.19-3.931a1 1 0 00-.61-.205zm9.848 9.734a1 1 0 00-.77.377l-4.004 5.19a1 1 0 00.17 1.4l5.19 3.931a1 1 0 001.38-.17l4.004-5.192a1 1 0 00-.17-1.4l-5.19-3.931a1 1 0 00-.61-.205z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-850'}`}>
                        Paga rápido y seguro con tu cuenta de PayPal
                      </p>
                      <p className="text-[10px] text-slate-450 mt-1">
                        Al confirmar, se abrirá un flujo de transacción simulado de PayPal Checkout.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={paying}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.01]"
                >
                  {paying ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Procesando Pago Seguro...</span>
                    </div>
                  ) : (
                    `Confirmar Reserva y Pagar €${tour.precio}`
                  )}
                </button>
              </div>

            </div>

          </div>
        </form>
      )}
    </div>
  );
}
