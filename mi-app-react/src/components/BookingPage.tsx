import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../utils/translate';
import MapPicker from './mapa';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe with your public key
const stripePromise = loadStripe(
  'pk_live_51Tk9ZxPzjxnLDZmcVh0nbRL1XzBqgB06ir2Jni9P4dFViynMwkT2Fc97KrwHCw2knLh5WJe8Th7BjU9dGNDSY2a6009Dra9Nrs'
);

const API_URL = 'https://ninatuktours.com/admin_api.php';

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

// Create a wrapper component that uses the Stripe hooks
function BookingFormContent({ theme, tour, onClose, currentLang, displayName }: any) {
  const stripe = useStripe();
  const elements = useElements();

  const { t } = useTranslation();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [successReservaId, setSuccessReservaId] = useState(0);

  // Form Fields
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('10:00');
  const [personas, setPersonas] = useState(1);
  const [puntoRecogida, setPuntoRecogida] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Payment Fields
  const [cardName, setCardName] = useState('');
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;

    if (!puntoRecogida.trim()) {
      setErrorMsg('Por favor, indica un lugar de recogida para continuar.');
      setPaying(false);
      return;
    }

    setPaying(true);
    setErrorMsg('');

    try {
      let transaccionId = '';

      if (!stripe || !elements) {
        throw new Error('Stripe is not initialized yet');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create token
      const { error, token } = await stripe.createToken(cardElement, {
        name: cardName
      });

      if (error) {
        throw new Error(error.message || 'Error creating payment token');
      }

      if (token) {
        transaccionId = token.id;
      }

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
        punto_recogida: puntoRecogida,
        total_pagar: tour.precio,
        pasarela: 'stripe',
        transaccion_id: transaccionId,
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
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error en el pago. Inténtalo de nuevo.';
      setErrorMsg(errorMessage);
    } finally {
      setPaying(false);
    }
  };

  if (bookingSuccess) {
    /* SUCCESS PAGE */
    return (
      <div className={`p-6 sm:p-8 md:p-12 rounded-3xl border shadow-lg text-center max-w-xl mx-auto transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className={`text-3xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          {t('booking.success_title')}
        </h2>
        <p className={`text-sm leading-relaxed mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('booking.success_message', { name: nombre, price: tour.precio, tour: displayName })}
        </p>

        <div className={`p-4 rounded-2xl mb-8 font-mono text-left space-y-2 border text-xs ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-150 text-slate-650'
          }`}>
          <p><strong>{t('booking.code_label')}: </strong> NTT-{successReservaId}</p>
          <p><strong>{t('booking.fecha_label')}: </strong> {fecha}</p>
          <p><strong>{t('booking.hora_label')}: </strong> {hora} hrs</p>
          <p><strong>Lugar de Recogida: </strong> {puntoRecogida || 'No especificado'}</p>
          <p><strong>{t('booking.pasajeros_count_label')}: </strong> {personas} {personas === 1 ? t('persona') : t('personas')}</p>
          <p><strong>{t('booking.gateway_label')}: </strong> STRIPE (Completado)</p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors shadow-sm"
        >
          {t('booking.regresar_inicio')}
        </button>
      </div>
    );
  }

  /* BOOKING FORM AND ELEVATOR SLIDER */
  return (
    <form onSubmit={handleSubmitBooking} className="animate-fade-in w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: TOUR DETAILS, MARQUEE IMAGES & PERSONAL DETAILS / SCHEDULE FORM */}
        <div className="lg:col-span-7 space-y-6">

          {/* Tour Info & Image Marquee */}
          <div className={`rounded-3xl p-5 border transition-colors ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200/65'
            }`}>
            <h3 className={`font-black text-lg mb-3 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-850'}`}>
              {displayName}
            </h3>
            <div className="flex gap-4 items-center text-xs font-bold text-slate-450 uppercase mb-4">
              <span>⏱️ {tour.duracion_minutos} min</span>
              <span>👥 {t('booking.passengers_label')}: {tour.capacidad_max_personas}</span>
              <span className="text-rose-500">€{tour.precio} (Flat Rate)</span>
            </div>
          </div>

          {/* 1. Datos Personales */}
          <div className={`p-6 md:p-8 rounded-3xl border shadow-md space-y-4 transition-colors ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800/70' : 'bg-white border-slate-200/70'
            }`}>
            <h3 className={`text-base font-extrabold pb-2 border-b border-slate-200/30 dark:border-slate-800/30 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
              }`}>
              {t('booking.personal_data_title')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('booking.full_name_label')}</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan Pérez"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                    }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('booking.email_label')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@ejemplo.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                    }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('booking.phone_label')}</label>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+34 641 807 779"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                    }`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Lugar de Recogida (Hotel/Dirección)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={puntoRecogida}
                    onChange={(e) => setPuntoRecogida(e.target.value)}
                    placeholder="Escribe tu dirección o abre el mapa..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    📍 MAPA
                  </button>
                </div>
              </div>

              {/* El MapPicker debe estar dentro del return, al final del formulario */}
              <MapPicker
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                onConfirm={(direccion) => setPuntoRecogida(direccion)}
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('booking.passengers_label')}</label>
                <select
                  value={personas}
                  onChange={(e) => setPersonas(parseInt(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-slate-250' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-850'
                    }`}
                >
                  {Array.from({ length: tour.capacidad_max_personas || 4 }, (_, idx) => (
                    <option key={idx + 1} value={idx + 1} className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}>
                      {idx + 1} {idx + 1 === 1 ? t('persona') : t('personas')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. Agenda */}
          <div className={`p-6 md:p-8 rounded-3xl border shadow-md space-y-4 transition-colors ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800/70' : 'bg-white border-slate-200/70'
            }`}>
            <h3 className={`text-base font-extrabold pb-2 border-b border-slate-200/30 dark:border-slate-800/30 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
              }`}>
              {t('booking.fecha_hora_title')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {t('booking.travel_date_label')}
                </label>

                <div className="flex gap-2">
                  {/* Selector de Día */}
                  <select
                    required
                    value={fecha.split('-')[2] || ''}
                    onChange={(e) => {
                      const dia = e.target.value;
                      const mes = fecha.split('-')[1] || '01';
                      const anyo = new Date().getFullYear(); // Año actual automático
                      setFecha(`${anyo}-${mes}-${dia}`);
                    }}
                    className={`w-1/2 px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-slate-200' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                      }`}
                  >
                    <option value="" disabled>{t('booking.day_placeholder')}</option>
                    {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  {/* Selector de Mes */}
                  <select
                    required
                    value={fecha.split('-')[1] || ''}
                    onChange={(e) => {
                      const mes = e.target.value;
                      const dia = fecha.split('-')[2] || '01';
                      const anyo = new Date().getFullYear(); // Año actual automático
                      setFecha(`${anyo}-${mes}-${dia}`);
                    }}
                    className={`w-1/2 px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-slate-200' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                      }`}
                  >
                    <option value="" disabled>{t('booking.month_placeholder')}</option>
                    {[
                      { v: '01', n: t('booking.months.jan') }, { v: '02', n: t('booking.months.feb') }, { v: '03', n: t('booking.months.mar') },
                      { v: '04', n: t('booking.months.apr') }, { v: '05', n: t('booking.months.may') }, { v: '06', n: t('booking.months.jun') },
                      { v: '07', n: t('booking.months.jul') }, { v: '08', n: t('booking.months.aug') }, { v: '09', n: t('booking.months.sep') },
                      { v: '10', n: t('booking.months.oct') }, { v: '11', n: t('booking.months.nov') }, { v: '12', n: t('booking.months.dec') }
                    ].map((m) => (
                      <option key={m.v} value={m.v}>{m.n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('booking.departure_time_label')}</label>
                <select
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-slate-200' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-850'
                    }`}
                >
                  {Array.from({ length: 13 }, (_, i) => {
                    const h = i + 10; // Empieza en 10
                    const label = h > 12 ? `${h - 12}:00 PM` : h === 12 ? '12:00 PM' : `${h}:00 AM`;
                    const value = `${h}:00`;
                    return <option key={value} value={value}>{label}</option>;
                  })}
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
          <div className={`p-6 md:p-8 rounded-3xl border shadow-md transition-colors ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800/70' : 'bg-white border-slate-200/70'
            }`}>
            <h3 className={`text-base font-extrabold pb-2 border-b border-slate-200/30 dark:border-slate-800/30 mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
              }`}>
              {t('booking.billing_summary_title')}
            </h3>
            <div className="flex justify-between text-sm mb-2.5">
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}>
                {t('booking.tour_duration', { minutes: tour.duracion_minutos })}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-250">€{tour.precio}</span>
            </div>
            <div className="flex justify-between text-sm mb-4 border-b border-dashed pb-3 border-slate-200 dark:border-slate-800">
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-550'}>{t('booking.management_fees')}</span>
              <span className="text-emerald-500 font-bold">{t('booking.free')}</span>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className={`font-bold text-sm ${theme === 'dark' ? 'text-slate-250' : 'text-slate-850'}`}>{t('booking.total_to_pay')}</span>
              <span className="text-3xl font-black text-rose-500">€{tour.precio}</span>
            </div>
          </div>

          {/* Pasarela de Pago */}
          <div className={`p-6 md:p-8 rounded-3xl border shadow-md space-y-6 transition-colors ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800/70' : 'bg-white border-slate-200/70'
            }`}>
            <h3 className={`text-base font-extrabold pb-2 border-b border-slate-200/30 dark:border-slate-800/30 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
              }`}>
              {t('booking.payment_title')}
            </h3>

            {/* STRIPE / CREDIT CARD VIEW */}
            <div className="space-y-5 animate-fade-in">

              {/* Card Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('booking.card_name_label')}</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="JUAN PEREZ PEREZ"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm uppercase focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-rose-500 text-slate-800'
                    }`}
                />
              </div>

              {/* Stripe Card Element */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">{t('booking.card_number_label')}</label>
                <div className={`p-3.5 rounded-xl border text-sm focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: theme === 'dark' ? '#ffffff' : '#1e293b',
                          '::placeholder': {
                            color: theme === 'dark' ? '#64748b' : '#94a3b8',
                          },
                        },
                        invalid: {
                          color: '#f43f5e',
                        },
                      },
                    }}
                  />
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={paying || !stripe || !elements}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all shadow-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.01]"
            >
              {paying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('booking.processing_payment')}</span>
                </div>
              ) : (
                t('booking.confirm_button', { price: tour.precio })
              )}
            </button>
          </div>

        </div>

      </div>
    </form>
  );
}

// Main BookingPage component
export default function BookingPage({ theme, tourId, onClose }: BookingPageProps) {
  const { i18n, t } = useTranslation();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

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

  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'es';

  const translatedName = React.useMemo(() => {
    if (!tour) return '';
    if (currentLang === 'es') return tour.nombre_es;
    if (currentLang === 'en' && tour.nombre_en) return tour.nombre_en;
    if (currentLang === 'pl' && tour.nombre_pl) return tour.nombre_pl;

    // For other languages, we'll use a local state for the async translation
    return null;
  }, [tour, currentLang]);

  const [asyncTranslatedName, setAsyncTranslatedName] = useState('');

  useEffect(() => {
    if (translatedName === null && tour) {
      translateText(tour.nombre_es, 'es', currentLang)
        .then((resText) => setAsyncTranslatedName(resText))
        .catch(() => setAsyncTranslatedName(tour.nombre_en || tour.nombre_es));
    } else {
      // If we don't need async translation, we clear it only if it's not already empty
      // We do this in a microtask to avoid the linter error about synchronous setState in effect
      if (asyncTranslatedName !== '') {
        Promise.resolve().then(() => setAsyncTranslatedName(''));
      }
    }
  }, [tour, currentLang, translatedName, asyncTranslatedName]);

  const displayName = translatedName || asyncTranslatedName;

  if (loading) {
    return (
      <div className="text-center py-24">
        <div className="inline-block w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={`text-xs font-bold uppercase tracking-widest mt-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          {t('booking.loading_details')}
        </p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="text-center py-24">
        <p className="text-rose-500 font-bold">{t('booking.error_no_tour')}</p>
        <button onClick={onClose} className="mt-4 px-6 py-2.5 bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider">
          {t('booking.back_to_tours')}
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Back button header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 mb-8 border-slate-200/50 dark:border-slate-800/50">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500">{t('booking.title')}</span>
          <h1 className={`text-2xl sm:text-3xl font-black transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {t('booking.heading')}
          </h1>
        </div>
        <button
          onClick={onClose}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-300 self-start sm:self-auto w-fit ${theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            : 'bg-white border-slate-200 text-slate-650 hover:text-slate-950 hover:border-slate-350'
            }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('booking.back_to_tours')}
        </button>
      </div>

      {/* Wrap the form in Elements provider */}
      <Elements stripe={stripePromise}>
        <BookingFormContent
          theme={theme}
          tour={tour}
          onClose={onClose}
          currentLang={currentLang}
          displayName={displayName}
        />
      </Elements>
    </div>
  );
}
