import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Define your translations
const resources = {
  es: {
    translation: {
      eslogan: "Madrid se Descubre Mejor cuando Alguien sabe contarla",
      carrusel_titulo: "Tus experiencias con nosotros",
      boton_reservar: "Reservar ahora",
      seleccionar_idioma: "Idioma",
      personas: "personas",
      
      // Features
      features_titulo: "¿Por qué elegirnos?",
      features_subtitulo: "Ofrecemos la mejor experiencia para recorrer la capital española de forma cómoda y responsable.",
      feat_eco_titulo: "100% Ecológico",
      feat_eco_desc: "Nuestros vehículos son eléctricos, silenciosos y cero emisiones, respetando el medio ambiente.",
      feat_guides_titulo: "Guías Certificados",
      feat_guides_desc: "Expertos locales te contarán las mejores historias, secretos y curiosidades de Madrid.",
      feat_custom_titulo: "Rutas Personalizadas",
      feat_custom_desc: "Adaptamos las paradas y el tiempo a tus intereses para que disfrutes a tu propio ritmo.",

      // Testimonials
      test_titulo: "Opiniones de nuestros viajeros",
      test_subtitulo: "Descubre las experiencias de quienes ya han recorrido Madrid con nosotros.",
      test_1_autor: "Sophie Martin",
      test_1_pais: "Francia",
      test_1_coment: "¡Fue una experiencia increíble! Vimos todo el centro histórico de Madrid en un par de horas sin cansarnos. Nuestro guía fue muy divertido.",
      test_2_autor: "John Doe",
      test_2_pais: "Reino Unido",
      test_2_coment: "El Tuk Tour es súper cómodo y muy silencioso. Recomiendo hacer el tour al atardecer, las luces de la ciudad son hermosas.",
      test_3_autor: "Katarzyna Kowalska",
      test_3_pais: "Polonia",
      test_3_coment: "Excelente servicio en varios idiomas. Reservar fue muy sencillo y pudimos hacer paradas para tomar fotos hermosas. ¡10 de 10!",

      // FAQ
      faq_titulo: "Preguntas Frecuentes",
      faq_subtitulo: "Resolvemos tus dudas principales sobre nuestros tours.",
      faq_q1: "¿Cuántas personas caben en un Tuk Tour?",
      faq_a1: "Nuestros vehículos eléctricos tienen capacidad para hasta 4 personas de forma muy cómoda. Si tu grupo es más grande, podemos usar múltiples vehículos en caravana.",
      faq_q2: "¿Cuál es el punto de encuentro y finalización?",
      faq_a2: "Por defecto, iniciamos y terminamos en puntos céntricos cerca de los monumentos principales. También ofrecemos servicio de recogida en hoteles del centro bajo petición previa.",
      faq_q3: "¿Qué sucede si llueve durante el tour?",
      faq_a3: "Nuestros Tuk Tours están equipados con capotas transparentes para lluvia y viento que te mantendrán completamente seco sin perder nada de visibilidad.",
      faq_q4: "¿Es apto para niños y personas mayores?",
      faq_a4: "Sí, es una actividad ideal y muy segura, aunque por normativas de seguridad a bordo solo se permiten niños de 4 años en adelante. Es una excelente opción para evitar largas caminatas y disfrutar cómodamente.",

      // Footer
      footer_contacto: "Contacto",
      footer_email: "nina.tuks.es@gmail.com",
      footer_tlf: "+34 641 807 779",
      footer_direccion: "Paseo de Extremadura 44",
      footer_derechos: "Todos los derechos reservados. Nina Tuk Tours.",

      // BookingPage
      booking: {
        title: "Reserva de Tour",
        heading: "Confirmar y Reservar",
        loading_details: "Cargando detalles del tour...",
        back_to_tours: "Volver a Tours",
        error_no_tour: "Error: El tour seleccionado no existe en el sistema.",
        success_title: "¡Pago y Reserva Confirmados!",
        success_message: "Gracias, {{name}}. Hemos registrado con éxito tu pago de €{{price}} para el {{tour}}.",
        code_label: "Código de Reserva",
        fecha_label: "Fecha del Tour",
        hora_label: "Hora de Salida",
        pasajeros_count_label: "Cantidad de Pasajeros",
        gateway_label: "Pasarela de Pago",
        regresar_inicio: "Regresar al Inicio",
        personal_data_title: "1. Tus Datos Personales",
        fecha_hora_title: "2. Fecha y Hora de Salida",
        payment_title: "3. Pasarela de Pago",
        confirm_button: "Confirmar Reserva y Pagar €{{price}}",
        processing_payment: "Procesando Pago Seguro...",
        full_name_label: "Nombre Completo",
        email_label: "Correo Electrónico",
        phone_label: "Teléfono",
        passengers_label: "Número de Pasajeros",
        travel_date_label: "Fecha del Viaje",
        departure_time_label: "Hora de Salida",
        billing_summary_title: "Resumen de Facturación",
        tour_duration: "Tour ({{minutes}} minutos)",
        management_fees: "Gastos de gestión",
        free: "GRATIS",
        total_to_pay: "Total a Pagar",
        card_name_label: "Nombre en la Tarjeta",
        card_number_label: "Número de Tarjeta",
        expiry_label: "Vencimiento",
        cvv_label: "CVC / CVV",
        paypal_info: "Paga rápido y seguro con tu cuenta de PayPal",
        paypal_subinfo: "Al confirmar, se abrirá un flujo de transacción simulado de PayPal Checkout.",
        day_placeholder: "Día",
        month_placeholder: "Mes",
        months: {
          jan: "Enero", feb: "Febrero", mar: "Marzo", apr: "Abril",
          may: "Mayo", jun: "Junio", jul: "Julio", aug: "Agosto",
          sep: "Septiembre", oct: "Octubre", nov: "Noviembre", dec: "Diciembre"
        }
      },

      // Política de Cancelación
      cancellation: {
        title: "Política de Cancelaciones y Devoluciones",
        last_update: "Última actualización: 10 de junio de 2026",
        intro: "En Nina Tuk Tours, queremos ofrecerte la mejor experiencia en tu viaje. Entendemos que los planes pueden cambiar, por lo que disponemos de la siguiente política para gestionar las cancelaciones de manera justa:",
        section1_title: "1. Plazos para Cancelaciones",
        section1_item1: "Más de 48 horas:",
        section1_item1_desc: "Reembolso del 100% del importe abonado.",
        section1_item2: "Entre 48 y 24 horas:",
        section1_item2_desc: "Reembolso del 50% (gastos de gestión y bloqueo de plaza).",
        section1_item3: "Menos de 24 horas o No-Show:",
        section1_item3_desc: "No se realizará ningún tipo de devolución. La plaza se reserva exclusivamente para usted.",
        section2_title: "2. ¿Cómo solicitar una devolución?",
        section2_intro: "Para garantizar la seguridad de tus fondos y procesar la devolución correctamente, el proceso no es automático. Debe coordinarse con administración:",
        section2_whatsapp: "WhatsApp Oficial",
        section2_email: "Correo Electrónico",
        section2_item1: "Facilite su Nombre completo y el Código/ID de la reserva.",
        section2_item2: "Nuestro equipo confirmará el plazo y aprobará la devolución manual.",
        section3_title: "3. Tiempos de reembolso",
        section3_desc: "Una vez aprobada a través de Stripe, el dinero se enviará de vuelta a la misma tarjeta utilizada. Dependiendo de su entidad bancaria internacional, el saldo puede tardar entre 5 y 10 días laborables en verse reflejado en su cuenta.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Compromiso de Transparencia"
      },

      // Términos y Condiciones
      terms: {
        title: "Términos y Condiciones de Uso",
        last_update: "Última actualización: 10 de junio de 2026",
        intro: "Al reservar un tour con Nina Tuk Tours, aceptas los términos y condiciones que se detallan a continuación.",
        section1_title: "1. Aceptación de los Términos",
        section1_content: "Al reservar un tour con Nina Tuk Tours, el cliente acepta íntegramente los presentes términos y condiciones.",
        section2_title: "2. Prestación del Servicio",
        section2_content: "Nina Tuk Tours se compromete a ofrecer el recorrido turístico acordado en la fecha y hora seleccionadas. La empresa se reserva el derecho de modificar el itinerario por motivos de fuerza mayor (condiciones climáticas extremas, cortes de tráfico, indicaciones policiales o de seguridad).",
        section3_title: "3. Comportamiento del Pasajero",
        section3_content: "Por razones de seguridad, los pasajeros deben permanecer sentados durante el trayecto y seguir las instrucciones del conductor. Nos reservamos el derecho de interrumpir el servicio sin derecho a reembolso si el comportamiento del cliente pone en riesgo la seguridad del vehículo, del conductor o de terceros.",
        section4_title: "4. Responsabilidad",
        section4_content: "Nina Tuk Tours no se hace responsable por la pérdida, robo o daño de objetos personales dejados en el vehículo durante o después del recorrido.",
        section5_title: "5. Precios y Pagos",
        section5_content: "Todos los precios incluyen los impuestos aplicables. Los pagos se procesan de forma segura a través de nuestra pasarela de pagos.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Todos los derechos reservados"
      },

      // Política de Privacidad
      privacy: {
        title: "Política de Privacidad y Protección de Datos",
        last_update: "Última actualización: 10 de junio de 2026",
        intro: "Tu privacidad es importante para nosotros. En Nina Tuk Tours, nos comprometemos a proteger tus datos personales de manera segura y responsable.",
        section1_title: "1. Recopilación de Datos",
        section1_content: "Para gestionar tu reserva, recopilamos información personal básica: nombre, dirección de correo electrónico y número de teléfono.",
        section2_title: "2. Uso de la Información",
        section2_item1: "Confirmar y gestionar tu reserva.",
        section2_item2: "Comunicarnos contigo sobre cambios o detalles del punto de recogida.",
        section2_item3: "Cumplir con obligaciones legales y fiscales.",
        section3_title: "3. Compartir Datos con Terceros",
        section3_content: "Nina Tuk Tours NO vende, alquila ni cede tus datos personales a terceros con fines comerciales. Tus datos de pago son procesados directamente por proveedores de pago seguros certificados (Stripe), y nosotros no almacenamos los números de tus tarjetas de crédito o débito.",
        section4_title: "4. Seguridad",
        section4_content: "Implementamos medidas técnicas de seguridad (como encriptación SSL) para proteger tu información contra el acceso no autorizado.",
        section5_title: "5. Tus Derechos",
        section5_content: "Tienes derecho a acceder, rectificar o solicitar la eliminación de tus datos personales de nuestra base de datos. Para ejercer estos derechos, puedes contactarnos a través de los canales oficiales proporcionados en nuestra página web.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Compromiso con la privacidad"
      }
    }
  },
  en: {
    translation: {
      eslogan: "Madrid is best discovered when someone knows how to tell its story",
      carrusel_titulo: "Your experiences with us",
      boton_reservar: "Book now",
      seleccionar_idioma: "Language",
      personas: "people",
      persona: "person",

      // Features
      features_titulo: "Why Choose Us?",
      features_subtitulo: "We offer the best experience to discover the Spanish capital in a comfortable and responsible way.",
      feat_eco_titulo: "100% Eco-friendly",
      feat_eco_desc: "Our vehicles are fully electric, quiet, and zero-emission, fully respecting the environment.",
      feat_guides_titulo: "Certified Guides",
      feat_guides_desc: "Local experts who will share the best stories, secrets, and historical facts of Madrid.",
      feat_custom_titulo: "Customizable Routes",
      feat_custom_desc: "We adapt the stops and schedule to your interests so you can enjoy at your own pace.",

      // Testimonials
      test_titulo: "What our travelers say",
      test_subtitulo: "Discover the experiences of those who have already toured Madrid with us.",
      test_1_autor: "Sophie Martin",
      test_1_pais: "France",
      test_1_coment: "It was an amazing experience! We saw all of Madrid's historic center in a couple of hours without getting tired. Our guide was very fun.",
      test_2_autor: "John Doe",
      test_2_pais: "United Kingdom",
      test_2_coment: "The Tuk Tour is super comfortable and very quiet. I highly recommend taking the sunset tour, the city lights are beautiful.",
      test_3_autor: "Katarzyna Kowalska",
      test_3_pais: "Poland",
      test_3_coment: "Excellent service in multiple languages. Booking was very simple and we were able to make stops for beautiful photos. 10 out of 10!",

      // FAQ
      faq_titulo: "Frequently Asked Questions",
      faq_subtitulo: "We answer your main questions about our tours.",
      faq_q1: "How many people fit in a Tuk Tour?",
      faq_a1: "Our electric vehicles can comfortably seat up to 4 people. If your group is larger, we can coordinate multiple vehicles to ride together in a caravan.",
      faq_q2: "Where does the tour start and end?",
      faq_a2: "By default, we start and end at central points close to main monuments. We also offer hotel pick-up service in the city center upon request.",
      faq_q3: "What happens if it rains during the tour?",
      faq_a3: "Our Tuk Tours are equipped with clear rain covers and wind shields that will keep you dry while maintaining 100% visibility.",
      faq_q4: "Is it suitable for children and seniors?",
      faq_a4: "Yes, it is an ideal and safe activity, although due to onboard safety regulations only children aged 4 and older are allowed. It is an excellent option to avoid long walks and enjoy comfortably.",

      // Footer
      footer_contacto: "Contact",
      footer_email: "nina.tuks.es@gmail.com",
      footer_tlf: "+34 641 807 779",
      footer_direccion: "Calle Mayor 1, Madrid, Spain",
      footer_derechos: "All rights reserved. Nina Tuk Tours.",

      // BookingPage
      booking: {
        title: "Tour Booking",
        heading: "Confirm and Book",
        loading_details: "Loading tour details...",
        back_to_tours: "Back to Tours",
        error_no_tour: "Error: The selected tour does not exist.",
        success_title: "Payment and Booking Confirmed!",
        success_message: "Thanks, {{name}}. We have recorded your payment of €{{price}} for {{tour}}.",
        code_label: "Booking Code",
        fecha_label: "Tour Date",
        hora_label: "Departure Time",
        pasajeros_count_label: "Number of Passengers",
        gateway_label: "Payment Gateway",
        regresar_inicio: "Return Home",
        personal_data_title: "1. Your Personal Details",
        fecha_hora_title: "2. Date and Departure Time",
        payment_title: "3. Payment Gateway",
        confirm_button: "Confirm Booking and Pay €{{price}}",
        processing_payment: "Processing Secure Payment...",
        full_name_label: "Full Name",
        email_label: "Email Address",
        phone_label: "Phone Number",
        passengers_label: "Number of Passengers",
        travel_date_label: "Travel Date",
        departure_time_label: "Departure Time",
        billing_summary_title: "Billing Summary",
        tour_duration: "Tour ({{minutes}} minutes)",
        management_fees: "Management fees",
        free: "FREE",
        total_to_pay: "Total to Pay",
        card_name_label: "Name on Card",
        card_number_label: "Card Number",
        expiry_label: "Expiry Date",
        cvv_label: "CVC / CVV",
        paypal_info: "Pay fast and secure with your PayPal account",
        paypal_subinfo: "Upon confirmation, a simulated PayPal Checkout flow will open.",
        day_placeholder: "Day",
        month_placeholder: "Month",
        months: {
          jan: "January", feb: "February", mar: "March", apr: "April",
          may: "May", jun: "June", jul: "July", aug: "August",
          sep: "September", oct: "October", nov: "November", dec: "December"
        }
      },

      // Cancellation Policy
      cancellation: {
        title: "Cancellation and Refund Policy",
        last_update: "Last updated: June 10, 2026",
        intro: "At Nina Tuk Tours, we want to offer you the best experience on your trip. We understand that plans can change, so we have the following policy to manage cancellations fairly:",
        section1_title: "1. Cancellation Deadlines",
        section1_item1: "More than 48 hours:",
        section1_item1_desc: "100% refund of the amount paid.",
        section1_item2: "Between 48 and 24 hours:",
        section1_item2_desc: "50% refund (management fees and slot blocking).",
        section1_item3: "Less than 24 hours or No-Show:",
        section1_item3_desc: "No refund will be made. The slot is reserved exclusively for you.",
        section2_title: "2. How to request a refund?",
        section2_intro: "To ensure the security of your funds and process the refund correctly, the process is not automatic. It must be coordinated with management:",
        section2_whatsapp: "Official WhatsApp",
        section2_email: "Email",
        section2_item1: "Provide your full name and booking code/ID.",
        section2_item2: "Our team will confirm the deadline and approve the refund manually.",
        section3_title: "3. Refund Times",
        section3_desc: "Once approved through Stripe, the money will be sent back to the same card used. Depending on your international bank, the balance may take 5-10 business days to reflect in your account.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Commitment to Transparency"
      },

      // Terms and Conditions
      terms: {
        title: "Terms and Conditions of Use",
        last_update: "Last updated: June 10, 2026",
        intro: "By booking a tour with Nina Tuk Tours, you accept the terms and conditions detailed below.",
        section1_title: "1. Acceptance of Terms",
        section1_content: "By booking a tour with Nina Tuk Tours, the customer fully accepts these terms and conditions.",
        section2_title: "2. Service Provision",
        section2_content: "Nina Tuk Tours undertakes to provide the agreed tour at the selected date and time. The company reserves the right to modify the itinerary due to force majeure (extreme weather conditions, traffic disruptions, police or safety instructions).",
        section3_title: "3. Passenger Behavior",
        section3_content: "For safety reasons, passengers must remain seated during the journey and follow the driver's instructions. We reserve the right to interrupt the service without refund if the passenger's behavior endangers the safety of the vehicle, driver, or third parties.",
        section4_title: "4. Liability",
        section4_content: "Nina Tuk Tours is not responsible for the loss, theft, or damage to personal items left in the vehicle during or after the tour.",
        section5_title: "5. Prices and Payments",
        section5_content: "All prices include applicable taxes. Payments are processed securely through our payment gateway.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - All rights reserved"
      },

      // Privacy Policy
      privacy: {
        title: "Privacy and Data Protection Policy",
        last_update: "Last updated: June 10, 2026",
        intro: "Your privacy is important to us. At Nina Tuk Tours, we are committed to protecting your personal data safely and responsibly.",
        section1_title: "1. Data Collection",
        section1_content: "To manage your booking, we collect basic personal information: name, email address, and phone number.",
        section2_title: "2. Use of Information",
        section2_item1: "Confirm and manage your booking.",
        section2_item2: "Communicate with you about changes or details of the pickup point.",
        section2_item3: "Comply with legal and tax obligations.",
        section3_title: "3. Sharing Data with Third Parties",
        section3_content: "Nina Tuk Tours DOES NOT sell, rent, or transfer your personal data to third parties for commercial purposes. Your payment data is processed directly by certified secure payment providers (Stripe), and we do not store your credit or debit card numbers.",
        section4_title: "4. Security",
        section4_content: "We implement technical security measures (such as SSL encryption) to protect your information from unauthorized access.",
        section5_title: "5. Your Rights",
        section5_content: "You have the right to access, correct, or request the deletion of your personal data from our database. To exercise these rights, you can contact us through the official channels provided on our website.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Commitment to privacy"
      }
    }
  },
  pl: {
    translation: {
      eslogan: "Madryt najlepiej odkrywa się, gdy ktoś potrafi o nim opowiedzieć",
      carrusel_titulo: "Twoje doświadczenia z nami",
      boton_reservar: "Zarezerwuj teraz",
      seleccionar_idioma: "Język",
      personas: "ludzie",
      persona: "osoba",

      // Features
      features_titulo: "Dlaczego my?",
      features_subtitulo: "Oferujemy najlepszy sposób na odkrycie stolicy Hiszpanii w wygodny i odpowiedzialny sposób.",
      feat_eco_titulo: "100% Ekologiczne",
      feat_eco_desc: "Nasze pojazdy są w pełni elektryczne, ciche i bezemisyjne, w pełni szanując środowisko.",
      feat_guides_titulo: "Certyfikowani Przewodnicy",
      feat_guides_desc: "Lokalni eksperci, którzy podzielą się najlepszymi historiami, tajemnicami i faktami o Madrycie.",
      feat_custom_titulo: "Trasy na życzenie",
      feat_custom_desc: "Dostosowujemy przystanki i czas do Twoich zainteresowań, abyś mógł cieszyć się wycieczką we własnym tempie.",

      // Testimonials
      test_titulo: "Co mówią nasi podróżnicy",
      test_subtitulo: "Odkryj opinie osób, które już zwiedzały Madryt z nami.",
      test_1_autor: "Sophie Martin",
      test_1_pais: "Francja",
      test_1_coment: "To było niesamowite przeżycie! Zobaczyliśmy całe historyczne centrum Madrytu w kilka godzin bez zmęczenia. Nasz przewodnik był bardzo zabawny.",
      test_2_autor: "John Doe",
      test_2_pais: "Wielka Brytania",
      test_2_coment: "Tuk Tour jest bardzo wygodny i cichy. Gorąco polecam wycieczkę o zachodzie słońca, światła miasta są wtedy piękne.",
      test_3_autor: "Katarzyna Kowalska",
      test_3_pais: "Polska",
      test_3_coment: "Doskonała obsługa w wielu językach. Rezerwacja była prosta, a przewodnik zatrzymywał się na piękne zdjęcia. 10 na 10!",

      // FAQ
      faq_titulo: "Najczęściej zadawane pytania",
      faq_subtitulo: "Odpowiadamy na najważniejsze pytania dotyczące naszych wycieczek.",
      faq_q1: "Ile osób mieści się w Tuk Tourze?",
      faq_a1: "Nasze elektryczne pojazdy mogą wygodnie pomieścić do 4 osób. Jeśli Twoja grupa jest większa, możemy zorganizować kilka pojazdów w kolumnie.",
      faq_q2: "Gdzie zaczyna się i kończy wycieczka?",
      faq_a2: "Domyślnie startujemy i kończymy w centralnych punktach w pobliżu głównych zabytków. Oferujemy również odbiór z hoteli w centrum na życzenie.",
      faq_q3: "Co się stanie, jeśli podczas wycieczki zacznie padać deszcz?",
      faq_a3: "Nasze pojazdy Tuk Tour są wyposażone w przezroczyste osłony przeciwdeszczowe i wiatroszczelne, które zapewnią suchość przy zachowaniu pełnej widoczności.",
      faq_q4: "Czy wycieczka jest odpowiednia dla dzieci i seniorów?",
      faq_a4: "Tak, to idealna i bezpieczna aktywność, chociaż ze względów bezpieczeństwa na pokładzie dozwolony jest udział wyłącznie dzieci od 4 roku życia. To doskonała opcja, aby uniknąć długich spacerów i cieszyć się komfortem.",

      // Footer
      footer_contacto: "Kontakt",
      footer_email: "nina.tuks.es@gmail.com",
      footer_tlf: "+34 641 807 779",
      footer_direccion: "Calle Mayor 1, Madryt, Hiszpania",
      footer_derechos: "Wszelkie prawa zastrzeżone. Nina Tuk Tours.",

      // BookingPage
      booking: {
        title: "Rezerwacja wycieczki",
        heading: "Potwierdź i zarezerwuj",
        loading_details: "Ładowanie szczegółów wycieczki...",
        back_to_tours: "Powrót do wycieczek",
        error_no_tour: "Błąd: Wybrana wycieczka nie istnieje.",
        success_title: "Płatność i rezerwacja potwierdzone!",
        success_message: "Dziękujemy, {{name}}. Zarejestrowaliśmy Twoją płatność w wysokości €{{price}} za {{tour}}.",
        code_label: "Kod rezerwacji",
        fecha_label: "Data wycieczki",
        hora_label: "Godzina odjazdu",
        pasajeros_count_label: "Liczba pasażerów",
        gateway_label: "Bramka płatności",
        regresar_inicio: "Powrót do strony głównej",
        personal_data_title: "1. Twoje dane osobowe",
        fecha_hora_title: "2. Data i godzina odjazdu",
        payment_title: "3. Bramka płatności",
        confirm_button: "Potwierdź rezerwację i zapłać €{{price}}",
        processing_payment: "Przetwarzanie bezpiecznej płatności...",
        full_name_label: "Imię i nazwisko",
        email_label: "Adres e-mail",
        phone_label: "Numer telefonu",
        passengers_label: "Liczba pasażerów",
        travel_date_label: "Data podróży",
        departure_time_label: "Godzina odjazdu",
        billing_summary_title: "Podsumowanie płatności",
        tour_duration: "Wycieczka ({{minutes}} minut)",
        management_fees: "Opłaty manipulacyjne",
        free: "ZA DARMO",
        total_to_pay: "Suma do zapłaty",
        card_name_label: "Imię na karcie",
        card_number_label: "Numer karty",
        expiry_label: "Data ważności",
        cvv_label: "CVC / CVV",
        paypal_info: "Płać szybko i bezpiecznie za pomocą konta PayPal",
        paypal_subinfo: "Po potwierdzeniu otworzy się symulowany przepływ PayPal Checkout.",
        day_placeholder: "Dzień",
        month_placeholder: "Miesiąc",
        months: {
          jan: "Styczeń", feb: "Luty", mar: "Marzec", apr: "Kwiecień",
          may: "Maj", jun: "Czerwiec", jul: "Lipiec", aug: "Sierpień",
          sep: "Wrzesień", oct: "Październik", nov: "Listopad", dec: "Grudzień"
        }
      },

      // Cancellation Policy
      cancellation: {
        title: "Polityka anulacji i zwrotów",
        last_update: "Ostatnia aktualizacja: 10 czerwca 2026",
        intro: "W Nina Tuk Tours chcemy zaoferować Ci najlepsze doświadczenie w Twojej podróży. Rozumiemy, że plany mogą się zmienić, dlatego mamy następującą politykę do sprawnego zarządzania anulacjami:",
        section1_title: "1. Terminy anulacji",
        section1_item1: "Więcej niż 48 godzin:",
        section1_item1_desc: "Zwrot 100% zapłaconej kwoty.",
        section1_item2: "Pomiędzy 48 a 24 godzinami:",
        section1_item2_desc: "Zwrot 50% (opłaty manipulacyjne i blokada miejsca).",
        section1_item3: "Mniej niż 24 godziny lub No-Show:",
        section1_item3_desc: "Nie będzie żadnego zwrotu. Miejsce jest zarezerwowane wyłącznie dla Ciebie.",
        section2_title: "2. Jak złożyć wniosek o zwrot?",
        section2_intro: "Aby zapewnić bezpieczeństwo Twoich środków i prawidłowe przetworzenie zwrotu, proces nie jest automatyczny. Należy skontaktować się z zarządem:",
        section2_whatsapp: "Oficjalny WhatsApp",
        section2_email: "E-mail",
        section2_item1: "Podaj imię i nazwisko oraz kod/ID rezerwacji.",
        section2_item2: "Nasz zespół potwierdzi termin i zatwierdzi zwrot ręcznie.",
        section3_title: "3. Czas zwrotu",
        section3_desc: "Po zatwierdzeniu przez Stripe pieniądze zostaną wysłane z powrotem na tę samą kartę. W zależności od Twojej międzynarodowej bankowości saldo może pojawić się na Twoim koncie po 5-10 dniach roboczych.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Zobowiązanie do przejrzystości"
      },

      // Regulamin
      terms: {
        title: "Regulamin Użycia",
        last_update: "Ostatnia aktualizacja: 10 czerwca 2026",
        intro: "Rezerwując wycieczkę w Nina Tuk Tours, akceptujesz regulamin i warunki opisane poniżej.",
        section1_title: "1. Akceptacja Warunków",
        section1_content: "Rezerwując wycieczkę w Nina Tuk Tours, klient w pełni akceptuje niniejszy regulamin i warunki.",
        section2_title: "2. Świadczenie Usług",
        section2_content: "Nina Tuk Tours zobowiązuje się do świadczeń uzgodnionej wycieczki turystycznej w wybranym terminie i godzinie. Firma zastrzega sobie prawo do modyfikacji trasy z przyczyn wyższej mocy (ekstremalne warunki pogodowe, zakłócenia ruchu, polecenia policji lub bezpieczeństwa).",
        section3_title: "3. Zachowanie Pasażera",
        section3_content: "Ze względów bezpieczeństwa pasażerowie muszą pozostać siedziani podczas podróży i postępować zgodnie z instrukcjami kierowcy. Zastrzegamy sobie prawo do przerwania usługi bez prawa do zwrotu, jeśli zachowanie klienta zagraża bezpieczeństwu pojazdu, kierowcy lub osób trzecich.",
        section4_title: "4. Odpowiedzialność",
        section4_content: "Nina Tuk Tours nie ponosi odpowiedzialności za utratę, kradzież lub uszkodzenie przedmiotów osobistych pozostawionych w pojeździe podczas lub po wycieczce.",
        section5_title: "5. Ceny i Płatności",
        section5_content: "Wszystkie ceny obejmują obowiązujące podatki. Płatności są przetwarzane bezpiecznie za pośrednictwem naszej bramki płatniczej.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Wszelkie prawa zastrzeżone"
      },

      // Polityka Prywatności
      privacy: {
        title: "Polityka Prywatności i Ochrony Danych",
        last_update: "Ostatnia aktualizacja: 10 czerwca 2026",
        intro: "Twoja prywatność jest dla nas ważna. W Nina Tuk Tours zobowiązujemy się do bezpiecznego i odpowiedzialnego ochrony Twoich danych osobowych.",
        section1_title: "1. Zbieranie Danych",
        section1_content: "Aby zarządzać Twoją rezerwacją, zbieramy podstawowe dane osobowe: imię i nazwisko, adres e-mail oraz numer telefonu.",
        section2_title: "2. Użycie Informacji",
        section2_item1: "Potwierdzanie i zarządzanie Twoją rezerwacją.",
        section2_item2: "Komunikacja z Tobą w sprawie zmian lub szczegółów dotyczących punktu odbioru.",
        section2_item3: "Spełnienie obowiązków prawnych i podatkowych.",
        section3_title: "3. Udostępnianie Danych Osobom Trzecim",
        section3_content: "Nina Tuk Tours NIE sprzedaje, nie wynajmuje i nie przekazuje Twoich danych osobowych osobom trzecim w celach handlowych. Twoje dane płatnicze są przetwarzane bezpośrednio przez certyfikowanych, bezpiecznych dostawców płatności (Stripe), a my nie przechowujemy numerów Twoich kart kredytowych lub debetowych.",
        section4_title: "4. Bezpieczeństwo",
        section4_content: "Wdrażamy techniczne środki bezpieczeństwa (takie jak szyfrowanie SSL) w celu ochrony Twoich informacji przed nieautoryzowanym dostępem.",
        section5_title: "5. Twoje Prawa",
        section5_content: "Masz prawo dostępu, poprawiania lub żądania usunięcia swoich danych osobowych z naszej bazy danych. Aby skorzystać z tych praw, możesz skontaktować się z nami za pośrednictwem oficjalnych kanałów podanych na naszej stronie internetowej.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Zobowiązanie do prywatności"
      }
    }
  },
  it: {
    translation: {
      eslogan: "Madrid si scopre meglio quando qualcuno sa come raccontarla",
      carrusel_titulo: "Le tue esperienze con noi",
      boton_reservar: "Prenota ora",
      seleccionar_idioma: "Lingua",
      personas: "persone",

      // Features
      features_titulo: "Perché sceglierci?",
      features_subtitulo: "Offriamo la migliore esperienza per visitare la capitale spagnola in modo comodo e responsabile.",
      feat_eco_titulo: "100% Ecologico",
      feat_eco_desc: "I nostri veicoli sono elettrici, silenziosi e a emissioni zero, nel pieno rispetto dell'ambiente.",
      feat_guides_titulo: "Guide Certificate",
      feat_guides_desc: "Esperti locali ti racconteranno le migliori storie, segreti e curiosità di Madrid.",
      feat_custom_titulo: "Itinerari Personalizzati",
      feat_custom_desc: "Adattiamo le soste e i tempi ai tuoi interessi per farti viaggiare al tuo ritmo.",

      // Testimonials
      test_titulo: "Opinioni dei nostri viaggiatori",
      test_subtitulo: "Scopri le esperienze di chi ha già visitato Madrid con noi.",
      test_1_autor: "Sophie Martin",
      test_1_pais: "Francia",
      test_1_coment: "È stata un'esperienza fantastica! Abbiamo visto tutto il centro storico di Madrid in un paio d'ore senza stancarci. La nostra guida era molto divertente.",
      test_2_autor: "John Doe",
      test_2_pais: "Regno Unito",
      test_2_coment: "Il Tuk Tour è super comodo e molto silenzioso. Consiglio vivamente il tour al tramonto, le luci della città sono bellissime.",
      test_3_autor: "Katarzyna Kowalska",
      test_3_pais: "Polonia",
      test_3_coment: "Servizio eccellente in diverse lingue. Prenotare è stato semplicissimo e abbiamo potuto fare delle soste per foto meravigliose. 10 su 10!",

      // FAQ
      faq_titulo: "Domande Frequenti",
      faq_subtitulo: "Risolviamo i tuoi dubbi principali sui nostri tour.",
      faq_q1: "Quante persone possono salire su un Tuk Tour?",
      faq_a1: "I nostri veicoli elettrici ospitano comodamente fino a 4 persone. Se il tuo gruppo è più numeroso, possiamo organizzare una carovana con più veicoli.",
      faq_q2: "Qual è il punto di partenza e di arrivo?",
      faq_a2: "Di norma, iniziamo e finiamo in punti centrali vicino ai monumenti principali. Offriamo anche il servizio di pick-up presso gli hotel del centro su richiesta.",
      faq_q3: "Cosa succede se piove durante il tour?",
      faq_a3: "I nostri Tuk Tour sono dotati di coperture trasparenti per pioggia e vento che ti terranno asciutto mantenendo una visibilità al 100%.",
      faq_q4: "È adatto a bambini e anziani?",
      faq_a4: "Sì, è un'attività ideale e sicura, anche se per norme di sicurezza a bordo sono ammessi solo bambini dai 4 anni in su. È un'ottima opzione per evitare lunghe camminate e godersi il tour in comodità.",

      // Footer
      footer_contacto: "Contatti",
      footer_email: "nina.tuks.es@gmail.com",
      footer_tlf: "+34 641 807 779",
      footer_direccion: "Calle Mayor 1, Madrid, Spagna",
      footer_derechos: "Tutti i diritti riservati. Nina Tuk Tours.",

      // BookingPage
      booking: {
        title: "Prenotazione Tour",
        heading: "Conferma e Prenota",
        loading_details: "Caricamento dettagli tour...",
        back_to_tours: "Torna ai Tour",
        error_no_tour: "Errore: Il tour selezionato non esiste.",
        success_title: "Pagamento e Prenotazione Confermati!",
        success_message: "Grazie, {{name}}. Abbiamo registrato con successo il tuo pagamento di €{{price}} per il {{tour}}.",
        code_label: "Codice Prenotazione",
        fecha_label: "Data del Tour",
        hora_label: "Ora di Partenza",
        pasajeros_count_label: "Numero di Passeggeri",
        gateway_label: "Metodo di Pagamento",
        regresar_inicio: "Torna alla Home",
        personal_data_title: "1. I Tuoi Dati Personali",
        fecha_hora_title: "2. Data e Ora di Partenza",
        payment_title: "3. Metodo di Pagamento",
        confirm_button: "Conferma Prenotazione e Paga €{{price}}",
        processing_payment: "Elaborazione Pagamento Sicuro...",
        full_name_label: "Nome Completo",
        email_label: "Indirizzo Email",
        phone_label: "Numero di Telefono",
        passengers_label: "Numero di Passeggeri",
        travel_date_label: "Data del Viaggio",
        departure_time_label: "Ora di Partenza",
        billing_summary_title: "Riepilogo Fatturazione",
        tour_duration: "Tour ({{minutes}} minuti)",
        management_fees: "Spese di gestione",
        free: "GRATIS",
        total_to_pay: "Totale da Pagare",
        card_name_label: "Nome sulla Carta",
        card_number_label: "Numero della Carta",
        expiry_label: "Scadenza",
        cvv_label: "CVC / CVV",
        paypal_info: "Paga in modo rapido e sicuro con il tuo account PayPal",
        paypal_subinfo: "Dopo la conferma, si aprirà una procedura di pagamento PayPal simulata.",
        day_placeholder: "Giorno",
        month_placeholder: "Mese",
        months: {
          jan: "Gennaio", feb: "Febbraio", mar: "Marzo", apr: "Aprile",
          may: "Maggio", jun: "Giugno", jul: "Luglio", aug: "Agosto",
          sep: "Settembre", oct: "Ottobre", nov: "Novembre", dec: "Dicembre"
        }
      },

      // Cancellation Policy
      cancellation: {
        title: "Politica di cancellazione e rimborso",
        last_update: "Ultimo aggiornamento: 10 giugno 2026",
        intro: "A Nina Tuk Tours, vogliamo offrirti la migliore esperienza nel tuo viaggio. Capiamo che i piani possono cambiare, quindi abbiamo la seguente politica per gestire le cancellazioni in modo equo:",
        section1_title: "1. Termini di cancellazione",
        section1_item1: "Più di 48 ore:",
        section1_item1_desc: "Rimborso del 100% dell'importo pagato.",
        section1_item2: "Tra 48 e 24 ore:",
        section1_item2_desc: "Rimborso del 50% (spese di gestione e blocco posto).",
        section1_item3: "Meno di 24 ore o No-Show:",
        section1_item3_desc: "Non verrà effettuato alcun rimborso. Il posto è riservato esclusivamente per te.",
        section2_title: "2. Come richiedere un rimborso?",
        section2_intro: "Per garantire la sicurezza dei tuoi fondi e processare correttamente il rimborso, il processo non è automatico. Deve essere coordinato con la gestione:",
        section2_whatsapp: "WhatsApp ufficiale",
        section2_email: "E-mail",
        section2_item1: "Fornisci il tuo nome completo e il codice/ID della prenotazione.",
        section2_item2: "Il nostro team confermerà il termine e approverà manualmente il rimborso.",
        section3_title: "3. Tempi di rimborso",
        section3_desc: "Una volta approvato tramite Stripe, il denaro verrà rispedito sulla stessa carta utilizzata. A seconda della tua banca internazionale, il saldo potrebbe richiedere 5-10 giorni lavorativi per riflettersi sul tuo conto.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Impegno per la trasparenza"
      }
    }
  },
  pt: {
    translation: {
      eslogan: "Madrid descobre-se melhor quando alguém sabe contá-la",
      carrusel_titulo: "Suas experiências conosco",
      boton_reservar: "Reservar ahora",
      seleccionar_idioma: "Idioma",
      personas: "pessoas",
      persona: "pessoa",

      // Features
      features_titulo: "Por que escolher-nos?",
      features_subtitulo: "Oferecemos a melhor experiência para conhecer a capital espanhola de forma confortável e responsável.",
      feat_eco_titulo: "100% Ecológico",
      feat_eco_desc: "Nossos veículos são elétricos, silenciosos e com zero emissões, respeitando o meio ambiente.",
      feat_guides_titulo: "Guias Certificados",
      feat_guides_desc: "Especialistas locais contarão as melhores histórias, segredos e curiosidades de Madrid.",
      feat_custom_titulo: "Rotas Personalizadas",
      feat_custom_desc: "Adaptamos as paragens e os tempos aos seus interesses para que desfrute ao seu próprio ritmo.",

      // Testimonials
      test_titulo: "Opiniões dos nossos viajantes",
      test_subtitulo: "Descubra as experiências de quem já conheceu Madrid connosco.",
      test_1_autor: "Sophie Martin",
      test_1_pais: "França",
      test_1_coment: "Foi uma experiência incrível! Vimos todo o centro histórico de Madrid em poucas horas sem nos cansarmos. O nosso guia foi muito divertido.",
      test_2_autor: "John Doe",
      test_2_pais: "Reino Unido",
      test_2_coment: "O Tuk Tour é super confortável e muito silencioso. Recomendo fazer o tour ao pôr do sol, as luzes da cidade são lindas.",
      test_3_autor: "Katarzyna Kowalska",
      test_3_pais: "Polónia",
      test_3_coment: "Excelente serviço em vários idiomas. Reservar foi muito fácil e pudemos fazer paragens para tirar fotos fantásticas. 10 de 10!",

      // FAQ
      faq_titulo: "Perguntas Frequentes",
      faq_subtitulo: "Esclarecemos as suas principais dúvidas sobre os nossos tours.",
      faq_q1: "Quantas pessoas cabem num Tuk Tour?",
      faq_a1: "Os nossos veículos elétricos têm capacidade para até 4 pessoas com total conforto. Se o seu grupo for maior, podemos coordenar vários veículos em caravana.",
      faq_q2: "Qual é o ponto de encontro e de término?",
      faq_a2: "Por defeito, começamos e terminamos em pontos centrais perto dos principais monumentos. Também oferecemos recolha em hotéis do centro sob pedido.",
      faq_q3: "O que acontece se chover durante o tour?",
      faq_a3: "Os nossos Tuk Tours estão equipados com coberturas transparentes contra chuva e vento que o manterão seco sem perder a visibilidade.",
      faq_q4: "É adequado para crianças e idosos?",
      faq_a4: "Sim, é uma atividade ideal e segura, embora por regulamentos de segurança a bordo apenas sejam permitidas crianças a partir dos 4 anos. É uma excelente opção para evitar longas caminhadas e desfrutar com conforto.",

      // Footer
      footer_contacto: "Contacto",
      footer_email: "nina.tuks.es@gmail.com",
      footer_tlf: "+34 641 807 779",
      footer_direccion: "Calle Mayor 1, Madrid, Espanha",
      footer_derechos: "Todos os direitos reservados. Nina Tuk Tours.",

      // BookingPage
      booking: {
        title: "Reserva de Tour",
        heading: "Confirmar e Reservar",
        loading_details: "A carregar detalhes do tour...",
        back_to_tours: "Voltar aos Tours",
        error_no_tour: "Erro: O tour selecionado não existe.",
        success_title: "Pagamento e Reserva Confirmados!",
        success_message: "Obrigado, {{name}}. Registámos com sucesso o seu pagamento de €{{price}} para o {{tour}}.",
        code_label: "Código de Reserva",
        fecha_label: "Data do Tour",
        hora_label: "Hora de Saída",
        pasajeros_count_label: "Número de Passageiros",
        gateway_label: "Método de Pagamento",
        regresar_inicio: "Voltar ao Início",
        personal_data_title: "1. Os Seus Dados Pessoais",
        fecha_hora_title: "2. Data e Hora de Saída",
        payment_title: "3. Método de Pagamento",
        confirm_button: "Confirmar Reserva e Pagar €{{price}}",
        processing_payment: "A processar pagamento seguro...",
        full_name_label: "Nome Completo",
        email_label: "E-mail",
        phone_label: "Telefone",
        passengers_label: "Número de Passageiros",
        travel_date_label: "Data da Viagem",
        departure_time_label: "Hora de Saída",
        billing_summary_title: "Resumo da Faturação",
        tour_duration: "Tour ({{minutes}} minutos)",
        management_fees: "Taxas de gestão",
        free: "GRÁTIS",
        total_to_pay: "Total a Pagar",
        card_name_label: "Nome no Cartão",
        card_number_label: "Número do Cartão",
        expiry_label: "Validade",
        cvv_label: "CVC / CVV",
        paypal_info: "Pague rápido e seguro com a sua conta PayPal",
        paypal_subinfo: "Após a confirmação, abrir-se-á um fluxo de transação PayPal simulado.",
        day_placeholder: "Dia",
        month_placeholder: "Mês",
        months: {
          jan: "Janeiro", feb: "Fevereiro", mar: "Março", apr: "Abril",
          may: "Maio", jun: "Junho", jul: "Julho", aug: "Agosto",
          sep: "Setembro", oct: "Outubro", nov: "Novembro", dec: "Dezembro"
        }
      },

      // Cancellation Policy
      cancellation: {
        title: "Política de cancelamento e reembolso",
        last_update: "Última atualização: 10 de junho de 2026",
        intro: "Na Nina Tuk Tours, queremos oferecer-lhe a melhor experiência na sua viagem. Entendemos que os planos podem mudar, então temos a seguinte política para gerir cancelamentos de forma justa:",
        section1_title: "1. Prazo de cancelamento",
        section1_item1: "Mais de 48 horas:",
        section1_item1_desc: "Reembolso de 100% do valor pago.",
        section1_item2: "Entre 48 e 24 horas:",
        section1_item2_desc: "Reembolso de 50% (taxas de gestão e bloqueio de vaga).",
        section1_item3: "Menos de 24 horas ou No-Show:",
        section1_item3_desc: "Nenhum reembolso será feito. A vaga é reservada exclusivamente para si.",
        section2_title: "2. Como solicitar um reembolso?",
        section2_intro: "Para garantir a segurança dos seus fundos e processar o reembolso corretamente, o processo não é automático. Deve ser coordenado com a gestão:",
        section2_whatsapp: "WhatsApp oficial",
        section2_email: "E-mail",
        section2_item1: "Forneça o seu nome completo e o código/ID da reserva.",
        section2_item2: "A nossa equipa confirmará o prazo e aprovará o reembolso manualmente.",
        section3_title: "3. Tempo de reembolso",
        section3_desc: "Depois de aprovado pelo Stripe, o dinheiro será devolvido à mesma cartão utilizada. Dependendo do seu banco internacional, o saldo pode demorar de 5 a 10 dias úteis para aparecer na sua conta.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Compromisso com a transparência"
      }
    }
  },
  fr: {
    translation: {
      eslogan: "Madrid se découvre mieux quand quelqu'un sait la raconter",
      carrusel_titulo: "Vos expériences avec nous",
      boton_reservar: "Réserver maintenant",
      seleccionar_idioma: "Langue",
      personas: "personnes",
      persona: "personne",

      // Features
      features_titulo: "Pourquoi nous choisir ?",
      features_subtitulo: "Nous offrons la meilleure expérience pour parcourir la capitale espagnole de manière confortable et responsable.",
      feat_eco_titulo: "100% Écologique",
      feat_eco_desc: "Nos véhicules sont électriques, silencieux et zéro émission, dans le respect de l'environnement.",
      feat_guides_titulo: "Guides Certifiés",
      feat_guides_desc: "Des experts locaux vous raconteront les meilleures anecdotes, secrets et curiosités de Madrid.",
      feat_custom_titulo: "Routages Personnalisés",
      feat_custom_desc: "Nous adaptons les arrêts et la durée selon vos intérêts pour que vous profitiez à votre rythme.",

      // Testimonials
      test_titulo: "Avis de nos voyageurs",
      test_subtitulo: "Découvrez les témoignages de ceux qui ont visité Madrid avec nous.",
      test_1_autor: "Sophie Martin",
      test_1_pais: "France",
      test_1_coment: "Ce fut une expérience incroyable ! Nous avons vu tout le centre historique de Madrid en quelques heures sans nous fatiguer. Notre guide était très drôle.",
      test_2_autor: "John Doe",
      test_2_pais: "Royaume-Uni",
      test_2_coment: "Le Tuk Tour est très confortable et très silencieux. Je recommande vivement le tour au coucher du soleil, les lumières de la ville sont magnifiques.",
      test_3_autor: "Katarzyna Kowalska",
      test_3_pais: "Pologne",
      test_3_coment: "Excellent service en plusieurs langues. La réservation a été très simple et nous avons pu faire des arrêts pour de superbes photos. 10 sur 10 !",

      // FAQ
      faq_titulo: "Questions Fréquentes",
      faq_subtitulo: "Nous répondons à vos principales questions concernant nos visites.",
      faq_q1: "Combien de personnes peuvent monter dans un Tuk Tour ?",
      faq_a1: "Nos véhicules électriques accueillent confortablement jusqu'à 4 personnes. Si votre groupe est plus grand, nous pouvons organiser un convoi de plusieurs véhicules.",
      faq_q2: "Quel est le point de départ et d'arrivée ?",
      faq_a2: "Par défaut, nous commençons et terminons dans des points centraux près des monuments principaux. Nous proposons également un service de prise en charge à votre hôtel sur demande.",
      faq_q3: "Que se passe-t-il s'il pleut pendant la visite ?",
      faq_a3: "Nos Tuk Tours sont équipés de protections transparentes contre le vent et la pluie, vous gardant au sec tout en conservant une visibilité totale.",
      faq_q4: "Est-ce adapté aux enfants et aux personnes âgées ?",
      faq_a4: "Oui, c'est une activité idéale et sûre, bien que pour des raisons de sécurité à bord, seuls les enfants de 4 ans et plus soient autorisés. C'est une excellente option pour éviter les longues marches et profiter confortablement.",

      // Footer
      footer_contacto: "Contact",
      footer_email: "nina.tuks.es@gmail.com",
      footer_tlf: "+34 641 807 779",
      footer_direccion: "Calle Mayor 1, Madrid, Espagne",
      footer_derechos: "Tous droits réservés. Nina Tuk Tours.",

      // BookingPage
      booking: {
        title: "Réservation de Tour",
        heading: "Confirmer et Réserver",
        loading_details: "Chargement des détails du tour...",
        back_to_tours: "Retour aux Tours",
        error_no_tour: "Erreur : Le tour sélectionné n'existe pas.",
        success_title: "Paiement et Réservation Confirmés !",
        success_message: "Merci, {{name}}. Nous avons enregistré avec succès votre paiement de €{{price}} pour le {{tour}}.",
        code_label: "Code de Réservation",
        fecha_label: "Date du Tour",
        hora_label: "Heure de Départ",
        pasajeros_count_label: "Nombre de Passagers",
        gateway_label: "Méthode de Paiement",
        regresar_inicio: "Retour à l'Accueil",
        personal_data_title: "1. Vos Coordonnées Personnelles",
        fecha_hora_title: "2. Date et Heure de Départ",
        payment_title: "3. Méthode de Paiement",
        confirm_button: "Confirmer la Réservation et Payer €{{price}}",
        processing_payment: "Traitement du paiement sécurisé...",
        full_name_label: "Nom Complet",
        email_label: "Adresse E-mail",
        phone_label: "Téléphone",
        passengers_label: "Nombre de Passagers",
        travel_date_label: "Date du Voyage",
        departure_time_label: "Heure de Départ",
        billing_summary_title: "Résumé de la Facturation",
        tour_duration: "Tour ({{minutes}} minutes)",
        management_fees: "Frais de gestion",
        free: "GRATUIT",
        total_to_pay: "Total à Payer",
        card_name_label: "Nom sur la Carte",
        card_number_label: "Numéro de Carte",
        expiry_label: "Expiration",
        cvv_label: "CVC / CVV",
        paypal_info: "Payez rapidement et en toute sécurité avec votre compte PayPal",
        paypal_subinfo: "Après confirmation, un flux de transaction PayPal simulé s'ouvrira.",
        day_placeholder: "Jour",
        month_placeholder: "Mois",
        months: {
          jan: "Janvier", feb: "Février", mar: "Mars", apr: "Avril",
          may: "Mai", jun: "Juin", jul: "Juillet", aug: "Août",
          sep: "Septembre", oct: "Octobre", nov: "Novembre", dec: "Décembre"
        }
      },

      // Cancellation Policy
      cancellation: {
        title: "Politique d'annulation et de remboursement",
        last_update: "Dernière mise à jour : 10 juin 2026",
        intro: "Chez Nina Tuk Tours, nous voulons vous offrir la meilleure expérience lors de votre voyage. Nous comprenons que les plans peuvent changer, donc nous avons la politique suivante pour gérer les annulations équitablement :",
        section1_title: "1. Délais d'annulation",
        section1_item1: "Plus de 48 heures :",
        section1_item1_desc: "Remboursement à 100 % du montant payé.",
        section1_item2: "Entre 48 et 24 heures :",
        section1_item2_desc: "Remboursement à 50 % (frais de gestion et réservation de la place).",
        section1_item3: "Moins de 24 heures ou No-Show :",
        section1_item3_desc: "Aucun remboursement ne sera effectué. La place est réservée exclusivement pour vous.",
        section2_title: "2. Comment demander un remboursement ?",
        section2_intro: "Pour garantir la sécurité de vos fonds et traiter le remboursement correctement, le processus n'est pas automatique. Il doit être coordonné avec la direction :",
        section2_whatsapp: "WhatsApp officiel",
        section2_email: "E-mail",
        section2_item1: "Fournissez votre nom complet et le code/ID de réservation.",
        section2_item2: "Notre équipe confirmera le délai et approuvera le remboursement manuellement.",
        section3_title: "3. Délais de remboursement",
        section3_desc: "Une fois approuvé par Stripe, l'argent sera renvoyé sur la même carte utilisée. Selon votre banque internationale, le solde peut prendre de 5 à 10 jours ouvrables pour apparaître sur votre compte.",
        footer_text: "Nina Tuk Tours &copy; {{year}} - Engagement de transparence"
      }
    }
  }
};

// 2. Auto-detect browser language helper
const getBrowserLanguage = (): string => {
  if (typeof navigator === 'undefined') return 'es';
  const code = (navigator.language || 'es').split('-')[0].toLowerCase();
  const supported = ['es', 'en', 'pl', 'it', 'pt', 'fr'];
  return supported.includes(code) ? code : 'es';
};

const defaultLanguage = getBrowserLanguage();

// 3. Initialize i18next
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'es', // Fallback to Spanish if key is missing
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

export default i18n;
