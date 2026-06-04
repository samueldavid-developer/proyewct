import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Define your translations
const resources = {
  es: {
    translation: {
      eslogan: "Descubre Madrid de una forma única y ecológica",
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
      faq_a4: "Sí, es una actividad ideal y segura para todas las edades. Evita las largas caminatas y el cansancio, permitiendo a todos disfrutar por igual.",

      // Footer
      footer_contacto: "Contacto",
      footer_email: "info@ninatuktours.com",
      footer_tlf: "+34 600 000 000",
      footer_direccion: "Calle Mayor 1, Madrid, España",
      footer_derechos: "Todos los derechos reservados. Nina Tuk Tours."
    }
  },
  en: {
    translation: {
      eslogan: "Discover Madrid in a unique and eco-friendly way",
      boton_reservar: "Book now",
      seleccionar_idioma: "Language",
      personas: "people",

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
      faq_a4: "Yes, it is an ideal and safe activity for all ages. It avoids long walks and physical strain, allowing everyone to enjoy equally.",

      // Footer
      footer_contacto: "Contact",
      footer_email: "info@ninatuktours.com",
      footer_tlf: "+34 600 000 000",
      footer_direccion: "Calle Mayor 1, Madrid, Spain",
      footer_derechos: "All rights reserved. Nina Tuk Tours."
    }
  },
  pl: {
    translation: {
      eslogan: "Odkryj Madryt w wyjątkowy i ekologiczny sposób",
      boton_reservar: "Zarezerwuj teraz",
      seleccionar_idioma: "Język",
      personas: "ludzie",

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
      faq_a4: "Tak, to idealna i bezpieczna aktywność dla osób w każdym wieku. Pozwala uniknąć długich spacerów i zmęczenia fizycznego, gwarantując radość wszystkim.",

      // Footer
      footer_contacto: "Kontakt",
      footer_email: "info@ninatuktours.com",
      footer_tlf: "+34 600 000 000",
      footer_direccion: "Calle Mayor 1, Madryt, Hiszpania",
      footer_derechos: "Wszelkie prawa zastrzeżone. Nina Tuk Tours."
    }
  },
  it: {
    translation: {
      eslogan: "Scopri Madrid in modo unico ed ecologico",
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
      faq_a4: "Sì, è un'attività ideale e sicura per tutte le età. Evita lunghe camminate e sforzi fisici, permettendo a tutti di godersi il tour.",

      // Footer
      footer_contacto: "Contatti",
      footer_email: "info@ninatuktours.com",
      footer_tlf: "+34 600 000 000",
      footer_direccion: "Calle Mayor 1, Madrid, Spagna",
      footer_derechos: "Tutti i diritti riservati. Nina Tuk Tours."
    }
  },
  pt: {
    translation: {
      eslogan: "Descubra Madrid de uma forma única e ecológica",
      boton_reservar: "Reservar agora",
      seleccionar_idioma: "Idioma",
      personas: "pessoas",
      
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
      faq_titulo: "Perguntas Frecuentes",
      faq_subtitulo: "Esclarecemos as suas principais dúvidas sobre os nossos tours.",
      faq_q1: "Quantas pessoas cabem num Tuk Tour?",
      faq_a1: "Os nossos veículos elétricos têm capacidade para até 4 pessoas com total conforto. Se o seu grupo for maior, podemos coordenar vários veículos em caravana.",
      faq_q2: "Qual é o ponto de encontro e de término?",
      faq_a2: "Por defeito, começamos e terminamos em pontos centrais perto dos principais monumentos. Também oferecemos recolha em hotéis do centro sob pedido.",
      faq_q3: "O que acontece se chover durante o tour?",
      faq_a3: "Os nossos Tuk Tours estão equipados com coberturas transparentes contra chuva e vento que o manterão seco sem perder a visibilidade.",
      faq_q4: "É adequado para crianças e idosos?",
      faq_a4: "Sim, é uma atividade ideal e segura para todas as idades. Evita longas caminhadas e cansaço, permitindo que todos se divirtam igualmente.",

      // Footer
      footer_contacto: "Contacto",
      footer_email: "info@ninatuktours.com",
      footer_tlf: "+34 600 000 000",
      footer_direccion: "Calle Mayor 1, Madrid, Espanha",
      footer_derechos: "Todos os direitos reservados. Nina Tuk Tours."
    }
  },
  fr: {
    translation: {
      eslogan: "Découvrez Madrid de manière unique et écologique",
      boton_reservar: "Réserver maintenant",
      seleccionar_idioma: "Langue",
      personas: "personnes",
      
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
      faq_a4: "Oui, c'est une activité idéale et sûre pour tous les âges. Elle évite les longues marches et la fatigue, permettant à chacun de profiter pleinement.",

      // Footer
      footer_contacto: "Contact",
      footer_email: "info@ninatuktours.com",
      footer_tlf: "+34 600 000 000",
      footer_direccion: "Calle Mayor 1, Madrid, Espagne",
      footer_derechos: "Tous droits réservés. Nina Tuk Tours."
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