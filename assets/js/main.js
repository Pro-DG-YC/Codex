(function () {
  const root = document.documentElement;
  const header = document.querySelector('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinksList = navLinks ? navLinks.querySelectorAll('a') : [];
  const langToggle = document.querySelector('.lang-toggle');
  const form = document.querySelector('#contact-form');
  const formStatus = form ? form.querySelector('.form-status') : null;
  function setCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }
  const testimonialSlider = document.querySelector('.testimonial-slider');
  const testimonialTrack = testimonialSlider ? testimonialSlider.querySelector('.testimonial-track') : null;
  const testimonialItems = testimonialTrack ? Array.from(testimonialTrack.children) : [];
  const sliderPrev = testimonialSlider ? testimonialSlider.querySelector('.slider-prev') : null;
  const sliderNext = testimonialSlider ? testimonialSlider.querySelector('.slider-next') : null;
  const sliderDotsContainer = testimonialSlider ? testimonialSlider.querySelector('.slider-dots') : null;
  const tabList = document.querySelector('.tabs[role="tablist"]');
  const tabs = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];
  const tabPanels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls') || ''));
  const accordion = document.querySelector('[data-accordion]');

  setCurrentYear();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateNavToggleLabel() {
    if (!navToggle) return;
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    const attr = isExpanded ? 'data-i18n-aria-label-close' : 'data-i18n-aria-label-open';
    const key = navToggle.getAttribute(attr);
    const lang = root.getAttribute('lang') || 'es';
    const dict = translations[lang] || translations.es;
    if (key && dict[key]) {
      navToggle.setAttribute('aria-label', dict[key]);
    }
  }

  function toggleNav(forceState) {
    if (!navToggle || !navLinks) return;
    const isOpen = forceState != null ? forceState : navToggle.getAttribute('aria-expanded') === 'true';
    const nextState = forceState != null ? forceState : !isOpen;
    navToggle.setAttribute('aria-expanded', String(nextState));
    navLinks.classList.toggle('open', nextState);
    if (header) {
      header.classList.toggle('menu-open', nextState);
    }
    updateNavToggleLabel();
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => toggleNav());
    navToggle.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        toggleNav(false);
        navToggle.focus();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle && navLinks) {
      if (navToggle.getAttribute('aria-expanded') === 'true') {
        toggleNav(false);
        navToggle.focus();
      }
    }
  });

  const desktopMediaQuery = window.matchMedia('(min-width: 769px)');
  desktopMediaQuery.addEventListener('change', (event) => {
    if (event.matches) {
      toggleNav(false);
    }
  });

  if (navLinksList.length) {
    navLinksList.forEach((link) => {
      link.addEventListener('click', () => toggleNav(false));
    });
  }

  const translations = {
    es: {
      'meta.title': 'Pro-DG | Agencia de marketing digital y media buying',
      'meta.description': 'Agencia de marketing digital y media buying en Nicaragua y Estados Unidos. Estrategias bilingües que generan crecimiento real.',
      'meta.ogTitle': 'Pro-DG | Marketing digital y media buying',
      'meta.ogDescription': 'Agencia bilingüe que combina creatividad, tecnología y medios pagados para crecer en Nicaragua y Estados Unidos.',
      'meta.twitterTitle': 'Pro-DG | Marketing digital y media buying',
      'meta.twitterDescription': 'Agencia bilingüe con foco en resultados reales para NI y USA.',
      'brand.name': 'Pro-DG',
      'nav.services': 'Servicios',
      'nav.results': 'Casos',
      'nav.process': 'Proceso',
      'nav.portfolio': 'Portfolio',
      'nav.testimonials': 'Testimonios',
      'nav.contact': 'Contacto',
      'nav.language': 'ES / EN',
      'nav.languageLabel': 'Cambiar idioma',
      'nav.cta': 'Solicitar cotización',
      'nav.toggle.open': 'Abrir navegación',
      'nav.toggle.close': 'Cerrar navegación',
      'hero.badge': 'Agencia full-service',
      'hero.title': 'Marketing que impulsa resultados reales.',
      'hero.subtitle': 'Media Buying, creatividad y tecnología para crecer en Nicaragua y Estados Unidos.',
      'hero.ctaPrimary': 'Ver servicios',
      'hero.ctaSecondary': 'Solicitar cotización',
      'hero.metric1': '+150 campañas optimizadas',
      'hero.metric1Desc': 'Performance para marcas en NI & USA',
      'hero.metric2': 'Equipo bilingüe senior',
      'hero.metric2Desc': 'Media buyers, creativos y analistas',
      'services.kicker': 'Qué hacemos',
      'services.title': 'Servicios integrales',
      'services.description': 'Combinamos creatividad, data y medios pagados para entregar crecimiento sostenible.',
      'services.design.title': 'Diseño gráfico',
      'services.design.copy': 'Identidades visuales, branding y piezas que conectan con audiencias bilingües.',
      'services.photo.title': 'Sesión de fotos y video',
      'services.photo.copy': 'Producción onsite y en estudio para captar historias que venden productos y servicios.',
      'services.production.title': 'Producción audiovisual',
      'services.production.copy': 'Campañas 360° con guión, locución, motion graphics y edición enfocada en resultados.',
      'services.web.title': 'Sitios web',
      'services.web.copy': 'Experiencias rápidas y medibles integradas con CRM y automatizaciones.',
      'services.meta.title': 'Meta / Google Ads',
      'services.meta.copy': 'Optimización continua, audiencias personalizadas y reporting claro para stakeholders.',
      'services.ppc.title': 'PPC Campaigns / Media Buying',
      'services.ppc.copy': 'Planes multicanal con foco en ROAS, atribución y escalabilidad en dos mercados.',
      'services.cta': 'Más detalles',
      'services.note': '*Todos los servicios incluyen estrategia, medición y soporte bilingüe.',
      'results.kicker': 'Resultados',
      'results.title': 'Casos de éxito recientes',
      'results.case1.title': 'E-commerce retail',
      'results.case1.copy': '↑230% ROAS en 90 días combinando paid social, search y automatizaciones.',
      'results.case2.title': 'Educación superior',
      'results.case2.copy': '↓45% CPA con funnels bilingües para leads internacionales.',
      'results.case3.title': 'Servicios financieros',
      'results.case3.copy': '↑120% leads calificados gracias a campañas de performance y CRO.',
      'process.kicker': 'Cómo trabajamos',
      'process.title': 'Proceso probado en 4 etapas',
      'process.step1.title': 'Descubrimiento',
      'process.step1.copy': 'Workshops para mapear objetivos, audiencias y datos disponibles.',
      'process.step2.title': 'Estrategia',
      'process.step2.copy': 'Roadmap multicanal, budget allocation y KPI claros.',
      'process.step3.title': 'Producción',
      'process.step3.copy': 'Creatividades, landing pages y automatizaciones listas para lanzar.',
      'process.step4.title': 'Optimización',
      'process.step4.copy': 'Testing continuo, reporting transparente y escalamientos seguros.',
      'approach.kicker': 'Enfoque',
      'approach.title': 'Estrategia conectada end-to-end',
      'approach.description': 'Activamos un stack integrado de medios, creatividad y datos para impactar todo el funnel.',
      'approach.chip1': 'Performance first',
      'approach.chip2': 'Creatividad data-driven',
      'approach.chip3': 'Automatización',
      'approach.chip4': 'Analytics en vivo',
      'approach.tabs.label': 'Áreas clave',
      'approach.tabs.media': 'Paid Media',
      'approach.tabs.mediaCopy': 'Planeación, compra y optimización continua con dashboards de ROAS y atribución.',
      'approach.tabs.creative': 'Creatividad',
      'approach.tabs.creativeCopy': 'Conceptos, contenido y storytelling que se adaptan al contexto cultural de NI y USA.',
      'approach.tabs.tech': 'Tecnología',
      'approach.tabs.techCopy': 'Implementación de tracking, automatizaciones CRM y experimentación ágil.',
      'approach.accordion.qa1Title': '¿Cómo miden el impacto?',
      'approach.accordion.qa1Copy': 'Integramos tus fuentes de datos, definimos KPIs y entregamos reportes accionables cada semana.',
      'approach.accordion.qa2Title': '¿Trabajan con equipos internos?',
      'approach.accordion.qa2Copy': 'Sí, colaboramos con tu equipo para acelerar producción, transferir conocimiento y asegurar adopción.',
      'portfolio.kicker': 'Portfolio',
      'portfolio.title': 'Trabajos destacados',
      'portfolio.description': 'Reemplaza los placeholders en /assets/img/ con proyectos reales, GIFs o capturas.',
      'portfolio.item1': 'Campaña de awareness para fintech regional.',
      'portfolio.item2': 'Sitio web responsive para cadena hotelera.',
      'portfolio.item3': 'Producción audiovisual para e-commerce.',
      'portfolio.item4': 'Estrategia PPC para expansión en USA.',
      'portfolio.video': 'Reemplaza el video con tu reel oficial desde Vimeo o YouTube.',
      'testimonials.kicker': 'Confianza',
      'testimonials.title': 'Lo que dicen nuestros clientes',
      'testimonials.item1.quote': '“Pro-DG transformó nuestros canales digitales y hoy vendemos el doble en dos países.”',
      'testimonials.item1.name': 'Laura G., Directora de Marketing',
      'testimonials.item1.company': 'Retail Nicaragua',
      'testimonials.item2.quote': '“Equipo senior, reportes claros y foco constante en resultados medibles.”',
      'testimonials.item2.name': 'Michael S., VP Growth',
      'testimonials.item2.company': 'Tech Startup USA',
      'testimonials.item3.quote': '“Encontramos un aliado creativo y estratégico para lanzar campañas bilingües complejas.”',
      'testimonials.item3.name': 'Ana R., CMO',
      'testimonials.item3.company': 'Educación Superior',
      'testimonials.prev': 'Anterior',
      'testimonials.next': 'Siguiente',
      'pricing.kicker': 'Paquetes',
      'pricing.title': 'Planes base flexibles',
      'pricing.starter.title': 'Starter',
      'pricing.starter.price': 'Desde $950/mes',
      'pricing.starter.item1': 'Campañas Meta Ads',
      'pricing.starter.item2': 'Creatividades estáticas',
      'pricing.starter.item3': 'Reportes quincenales',
      'pricing.growth.title': 'Growth',
      'pricing.growth.price': 'Desde $1,800/mes',
      'pricing.growth.item1': 'Paid Social + Search',
      'pricing.growth.item2': 'Landing pages optimizadas',
      'pricing.growth.item3': 'Reporting en vivo',
      'pricing.scale.title': 'Scale',
      'pricing.scale.price': 'Desde $3,500/mes',
      'pricing.scale.item1': 'Media buying multicanal',
      'pricing.scale.item2': 'Producción audiovisual premium',
      'pricing.scale.item3': 'Equipo dedicado & BI',
      'pricing.cta': 'Solicitar propuesta',
      'pricing.badge': 'Popular',
      'about.kicker': 'Sobre Pro-DG',
      'about.title': 'Equipo bilingüe con presencia en Nicaragua y Estados Unidos',
      'about.mission.title': 'Nuestra misión',
      'about.mission.copy': 'Impulsar negocios con estrategias creativas, medibles y éticas.',
      'about.vision.title': 'Nuestra visión',
      'about.vision.copy': 'Ser la agencia latinoamericana referencia en performance bilingüe.',
      'about.team.title': 'Equipo senior',
      'about.team.copy': 'Media buyers certificados, estrategas de contenido, desarrolladores y analistas.',
      'contact.kicker': 'Contacto',
      'contact.title': 'Hablemos de tu próximo objetivo',
      'contact.description': 'Completa el formulario y agenda una reunión bilingüe con nuestro equipo.',
      'contact.form.nameLabel': 'Nombre',
      'contact.form.namePlaceholder': 'Andrea López',
      'contact.form.emailLabel': 'Email',
      'contact.form.emailPlaceholder': 'hola@empresa.com',
      'contact.form.phoneLabel': 'Teléfono',
      'contact.form.phonePlaceholder': '+505 8888-0000',
      'contact.form.companyLabel': 'Empresa',
      'contact.form.companyPlaceholder': 'Nombre de la empresa',
      'contact.form.serviceLabel': 'Servicio de interés',
      'contact.form.servicePlaceholder': 'Selecciona una opción',
      'contact.form.serviceOption': 'Selecciona una opción',
      'contact.form.serviceMedia': 'Media Buying',
      'contact.form.serviceCreative': 'Creatividad & producción',
      'contact.form.serviceWeb': 'Sitios web y funnels',
      'contact.form.serviceConsulting': 'Consultoría',
      'contact.form.messageLabel': 'Mensaje',
      'contact.form.messagePlaceholder': 'Cuéntanos sobre tu proyecto.',
      'contact.form.privacy': 'Acepto la política de privacidad.',
      'contact.form.submit': 'Enviar',
      'contact.form.statusIdle': '',
      'contact.form.statusSending': 'Enviando…',
      'contact.form.statusSuccess': '¡Gracias! Te contactaremos muy pronto.',
      'contact.form.statusError': 'Ocurrió un error. Intenta nuevamente.',
      'contact.aside.title': 'Respuestas en menos de 24 horas',
      'contact.aside.copy': 'También puedes escribirnos por los siguientes canales:',
      'contact.aside.whatsapp': 'WhatsApp',
      'contact.aside.call': 'Llamar',
      'contact.aside.email': 'Email',
      'contact.info.niTitle': 'Oficina Nicaragua',
      'contact.info.niAddress': 'Managua, Nicaragua · +505 0000 0000',
      'contact.info.usTitle': 'Oficina USA',
      'contact.info.usAddress': 'Miami, FL · +1 (305) 000-0000',
      'footer.tagline': 'Marketing digital, creatividad y media buying sin fronteras.',
      'footer.links': 'Links rápidos',
      'footer.social': 'Síguenos',
      'footer.copy': '© <span id="current-year"></span> Pro-DG. Todos los derechos reservados.',
      'footer.credit': 'Site by Pro-DG'
    },
    en: {
      'meta.title': 'Pro-DG | Digital marketing & media buying agency',
      'meta.description': 'Digital marketing and media buying agency across Nicaragua and the United States. Bilingual strategies that unlock real growth.',
      'meta.ogTitle': 'Pro-DG | Digital marketing & media buying',
      'meta.ogDescription': 'Bilingual agency blending creativity, technology and paid media to scale brands in Nicaragua and the U.S.',
      'meta.twitterTitle': 'Pro-DG | Digital marketing & media buying',
      'meta.twitterDescription': 'Bilingual agency focused on measurable growth for NI and the USA.',
      'brand.name': 'Pro-DG',
      'nav.services': 'Services',
      'nav.results': 'Case studies',
      'nav.process': 'Process',
      'nav.portfolio': 'Portfolio',
      'nav.testimonials': 'Testimonials',
      'nav.contact': 'Contact',
      'nav.language': 'EN / ES',
      'nav.languageLabel': 'Change language',
      'nav.cta': 'Get a quote',
      'nav.toggle.open': 'Open navigation',
      'nav.toggle.close': 'Close navigation',
      'hero.badge': 'Full-service agency',
      'hero.title': 'Marketing that drives real results.',
      'hero.subtitle': 'Media buying, creative and technology to grow in Nicaragua and the United States.',
      'hero.ctaPrimary': 'See services',
      'hero.ctaSecondary': 'Get a quote',
      'hero.metric1': '+150 optimized campaigns',
      'hero.metric1Desc': 'Performance for NI & US brands',
      'hero.metric2': 'Senior bilingual team',
      'hero.metric2Desc': 'Media buyers, creatives and analysts',
      'services.kicker': 'What we do',
      'services.title': 'Integrated services',
      'services.description': 'We merge creativity, data and paid media to deliver sustainable growth.',
      'services.design.title': 'Graphic design',
      'services.design.copy': 'Visual identities, branding and assets that resonate with bilingual audiences.',
      'services.photo.title': 'Photo & video shoots',
      'services.photo.copy': 'On-site and studio production to capture stories that sell products and services.',
      'services.production.title': 'Audiovisual production',
      'services.production.copy': '360° campaigns with scripting, voiceover, motion graphics and performance editing.',
      'services.web.title': 'Websites',
      'services.web.copy': 'Fast, measurable experiences integrated with CRM and automation.',
      'services.meta.title': 'Meta / Google Ads',
      'services.meta.copy': 'Continuous optimization, custom audiences and clear reporting for stakeholders.',
      'services.ppc.title': 'PPC Campaigns / Media Buying',
      'services.ppc.copy': 'Multichannel plans focused on ROAS, attribution and scalability in two markets.',
      'services.cta': 'More details',
      'services.note': '*All services include strategy, measurement and bilingual support.',
      'results.kicker': 'Results',
      'results.title': 'Recent success stories',
      'results.case1.title': 'Retail e-commerce',
      'results.case1.copy': '↑230% ROAS in 90 days through paid social, search and automations.',
      'results.case2.title': 'Higher education',
      'results.case2.copy': '↓45% CPA with bilingual funnels for international leads.',
      'results.case3.title': 'Financial services',
      'results.case3.copy': '↑120% qualified leads via performance campaigns and CRO.',
      'process.kicker': 'How we work',
      'process.title': 'Proven four-step framework',
      'process.step1.title': 'Discovery',
      'process.step1.copy': 'Workshops to map objectives, audiences and available data.',
      'process.step2.title': 'Strategy',
      'process.step2.copy': 'Multichannel roadmap, budget allocation and clear KPIs.',
      'process.step3.title': 'Production',
      'process.step3.copy': 'Creatives, landing pages and automations ready to launch.',
      'process.step4.title': 'Optimization',
      'process.step4.copy': 'Ongoing testing, transparent reporting and confident scaling.',
      'approach.kicker': 'Approach',
      'approach.title': 'End-to-end connected strategy',
      'approach.description': 'We activate an integrated stack of media, creativity and data to influence the entire funnel.',
      'approach.chip1': 'Performance first',
      'approach.chip2': 'Data-driven creativity',
      'approach.chip3': 'Automation',
      'approach.chip4': 'Live analytics',
      'approach.tabs.label': 'Key focus areas',
      'approach.tabs.media': 'Paid Media',
      'approach.tabs.mediaCopy': 'Planning, buying and continuous optimization with ROAS and attribution dashboards.',
      'approach.tabs.creative': 'Creative',
      'approach.tabs.creativeCopy': 'Concepts, content and storytelling tailored to NI and US market contexts.',
      'approach.tabs.tech': 'Technology',
      'approach.tabs.techCopy': 'Tracking implementation, CRM automation and agile experimentation.',
      'approach.accordion.qa1Title': 'How do you measure impact?',
      'approach.accordion.qa1Copy': 'We connect your data sources, define KPIs and deliver actionable weekly reports.',
      'approach.accordion.qa2Title': 'Do you work with internal teams?',
      'approach.accordion.qa2Copy': 'Yes, we collaborate with your crew to accelerate production, transfer knowledge and drive adoption.',
      'portfolio.kicker': 'Portfolio',
      'portfolio.title': 'Featured work',
      'portfolio.description': 'Replace the placeholders in /assets/img/ with real projects, GIFs or screenshots.',
      'portfolio.item1': 'Awareness campaign for a regional fintech.',
      'portfolio.item2': 'Responsive website for a hotel group.',
      'portfolio.item3': 'Audiovisual production for ecommerce launches.',
      'portfolio.item4': 'PPC strategy to expand across the US.',
      'portfolio.video': 'Swap this embed with your official reel from Vimeo or YouTube.',
      'testimonials.kicker': 'Trust',
      'testimonials.title': 'What our clients say',
      'testimonials.item1.quote': '“Pro-DG transformed our digital channels and doubled sales across both countries.”',
      'testimonials.item1.name': 'Laura G., Marketing Director',
      'testimonials.item1.company': 'Retail Nicaragua',
      'testimonials.item2.quote': '“Senior team, clear reporting and relentless focus on measurable outcomes.”',
      'testimonials.item2.name': 'Michael S., VP Growth',
      'testimonials.item2.company': 'Tech Startup USA',
      'testimonials.item3.quote': '“We found a creative and strategic partner to launch complex bilingual campaigns.”',
      'testimonials.item3.name': 'Ana R., CMO',
      'testimonials.item3.company': 'Higher Education',
      'testimonials.prev': 'Previous',
      'testimonials.next': 'Next',
      'pricing.kicker': 'Packages',
      'pricing.title': 'Flexible starter plans',
      'pricing.starter.title': 'Starter',
      'pricing.starter.price': 'From $950/mo',
      'pricing.starter.item1': 'Meta Ads campaigns',
      'pricing.starter.item2': 'Static creatives',
      'pricing.starter.item3': 'Bi-weekly reports',
      'pricing.growth.title': 'Growth',
      'pricing.growth.price': 'From $1,800/mo',
      'pricing.growth.item1': 'Paid Social + Search',
      'pricing.growth.item2': 'Optimized landing pages',
      'pricing.growth.item3': 'Live reporting',
      'pricing.scale.title': 'Scale',
      'pricing.scale.price': 'From $3,500/mo',
      'pricing.scale.item1': 'Multichannel media buying',
      'pricing.scale.item2': 'Premium audiovisual production',
      'pricing.scale.item3': 'Dedicated team & BI',
      'pricing.cta': 'Request proposal',
      'pricing.badge': 'Popular',
      'about.kicker': 'About Pro-DG',
      'about.title': 'Bilingual team with presence in Nicaragua and the United States',
      'about.mission.title': 'Our mission',
      'about.mission.copy': 'Empower businesses through creative, measurable and ethical strategies.',
      'about.vision.title': 'Our vision',
      'about.vision.copy': 'Become the Latin American benchmark for bilingual performance.',
      'about.team.title': 'Senior team',
      'about.team.copy': 'Certified media buyers, content strategists, developers and analysts.',
      'contact.kicker': 'Contact',
      'contact.title': 'Let’s talk about your next goal',
      'contact.description': 'Fill out the form and schedule a bilingual meeting with our team.',
      'contact.form.nameLabel': 'Name',
      'contact.form.namePlaceholder': 'Andrea Lopez',
      'contact.form.emailLabel': 'Email',
      'contact.form.emailPlaceholder': 'hello@company.com',
      'contact.form.phoneLabel': 'Phone',
      'contact.form.phonePlaceholder': '+1 305 000 0000',
      'contact.form.companyLabel': 'Company',
      'contact.form.companyPlaceholder': 'Company name',
      'contact.form.serviceLabel': 'Interested service',
      'contact.form.servicePlaceholder': 'Choose an option',
      'contact.form.serviceOption': 'Choose an option',
      'contact.form.serviceMedia': 'Media Buying',
      'contact.form.serviceCreative': 'Creative & production',
      'contact.form.serviceWeb': 'Websites & funnels',
      'contact.form.serviceConsulting': 'Consulting',
      'contact.form.messageLabel': 'Message',
      'contact.form.messagePlaceholder': 'Tell us about your project.',
      'contact.form.privacy': 'I accept the privacy policy.',
      'contact.form.submit': 'Send',
      'contact.form.statusIdle': '',
      'contact.form.statusSending': 'Sending…',
      'contact.form.statusSuccess': 'Thanks! We will be in touch shortly.',
      'contact.form.statusError': 'Something went wrong. Please try again.',
      'contact.aside.title': 'Replies in under 24 hours',
      'contact.aside.copy': 'You can also reach us through these channels:',
      'contact.aside.whatsapp': 'WhatsApp',
      'contact.aside.call': 'Call',
      'contact.aside.email': 'Email',
      'contact.info.niTitle': 'Nicaragua office',
      'contact.info.niAddress': 'Managua, Nicaragua · +505 0000 0000',
      'contact.info.usTitle': 'USA office',
      'contact.info.usAddress': 'Miami, FL · +1 (305) 000-0000',
      'footer.tagline': 'Digital marketing, creativity and media buying without borders.',
      'footer.links': 'Quick links',
      'footer.social': 'Follow us',
      'footer.copy': '© <span id="current-year"></span> Pro-DG. All rights reserved.',
      'footer.credit': 'Site by Pro-DG'
    }
  };

  function updateContent(lang) {
    const dict = translations[lang] || translations.es;
    root.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && dict[key] != null) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && dict[key] != null) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (key && dict[key] != null) {
        el.setAttribute('aria-label', dict[key]);
      }
    });

    if (navToggle) {
      const attr = navToggle.getAttribute('aria-expanded') === 'true'
        ? 'data-i18n-aria-label-close'
        : 'data-i18n-aria-label-open';
      const key = navToggle.getAttribute(attr);
      if (key && dict[key]) {
        navToggle.setAttribute('aria-label', dict[key]);
      }
    }

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (el.tagName === 'OPTION') {
        const key = el.getAttribute('data-i18n');
        if (key && dict[key] != null) {
          el.textContent = dict[key];
        }
      }
    });

    const metaMappings = [
      { selector: 'title[data-i18n="meta.title"]', attr: 'text' },
      { selector: 'meta[name="description"][data-i18n="meta.description"]', attr: 'content' },
      { selector: 'meta[property="og:title"][data-i18n="meta.ogTitle"]', attr: 'content' },
      { selector: 'meta[property="og:description"][data-i18n="meta.ogDescription"]', attr: 'content' },
      { selector: 'meta[name="twitter:title"][data-i18n="meta.twitterTitle"]', attr: 'content' },
      { selector: 'meta[name="twitter:description"][data-i18n="meta.twitterDescription"]', attr: 'content' }
    ];

    metaMappings.forEach(({ selector, attr }) => {
      const element = document.querySelector(selector);
      const key = element ? element.getAttribute('data-i18n') : null;
      if (!element || !key) return;
      const value = dict[key];
      if (value == null) return;
      if (attr === 'text') {
        element.textContent = value;
      } else {
        element.setAttribute(attr, value);
      }
    });

    const schema = document.getElementById('schema-organization');
    if (schema) {
      try {
        const data = JSON.parse(schema.textContent);
        if (lang === 'en') {
          data.description = translations.en['meta.description'];
        } else {
          data.description = translations.es['meta.description'];
        }
        schema.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Schema JSON update failed', error);
      }
    }

    if (langToggle) {
      langToggle.textContent = dict['nav.language'];
    }

    if (formStatus) {
      const statusKey = formStatus.getAttribute('data-status');
      if (statusKey && dict[statusKey]) {
        formStatus.textContent = dict[statusKey];
      }
    }

    setCurrentYear();
  }

  function setLanguage(lang) {
    const nextLang = translations[lang] ? lang : 'es';
    localStorage.setItem('prodg-lang', nextLang);
    updateContent(nextLang);
    updateNavToggleLabel();
  }

  const storedLang = localStorage.getItem('prodg-lang');
  setLanguage(storedLang || 'es');

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const currentLang = root.getAttribute('lang') === 'en' ? 'en' : 'es';
      const nextLang = currentLang === 'es' ? 'en' : 'es';
      setLanguage(nextLang);
    });
  }

  function createSliderDots() {
    if (!sliderDotsContainer || !testimonialItems.length) return;
    sliderDotsContainer.innerHTML = '';
    testimonialItems.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `${index + 1}`);
      dot.dataset.index = String(index);
      sliderDotsContainer.appendChild(dot);
    });
  }

  let activeSlide = 0;

  function updateSlider(index) {
    if (!testimonialTrack || !testimonialItems.length) return;
    activeSlide = (index + testimonialItems.length) % testimonialItems.length;
    const offset = -activeSlide * 100;
    testimonialTrack.style.transform = `translateX(${offset}%)`;
    if (prefersReducedMotion) {
      testimonialTrack.style.transition = 'none';
    } else {
      testimonialTrack.style.transition = 'transform 450ms ease';
    }

    if (sliderDotsContainer) {
      sliderDotsContainer.querySelectorAll('.slider-dot').forEach((dot) => {
        const isActive = Number(dot.dataset.index) === activeSlide;
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }
  }

  if (testimonialSlider) {
    createSliderDots();
    updateSlider(0);

    if (sliderDotsContainer) {
      sliderDotsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const index = target.dataset.index;
        if (index != null) {
          updateSlider(Number(index));
        }
      });
    }

    if (sliderPrev) {
      sliderPrev.addEventListener('click', () => updateSlider(activeSlide - 1));
    }

    if (sliderNext) {
      sliderNext.addEventListener('click', () => updateSlider(activeSlide + 1));
    }

    testimonialSlider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        updateSlider(activeSlide - 1);
      }
      if (event.key === 'ArrowRight') {
        updateSlider(activeSlide + 1);
      }
    });

    let autoSlide;
    if (!prefersReducedMotion) {
      autoSlide = setInterval(() => updateSlider(activeSlide + 1), 7000);
      testimonialSlider.addEventListener('mouseenter', () => clearInterval(autoSlide));
      testimonialSlider.addEventListener('focusin', () => clearInterval(autoSlide));
      testimonialSlider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => updateSlider(activeSlide + 1), 7000);
      });
    }
  }

  function activateTab(targetTab) {
    if (!tabs.length) return;
    tabs.forEach((tab, index) => {
      const isActive = tab === targetTab;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
      const panel = tabPanels[index];
      if (panel) {
        panel.toggleAttribute('hidden', !isActive);
        panel.classList.toggle('is-active', isActive);
      }
    });
  }

  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.setAttribute('tabindex', tab.classList.contains('is-active') ? '0' : '-1');
      tab.addEventListener('click', () => activateTab(tab));
    });

    tabList.addEventListener('keydown', (event) => {
      const currentIndex = tabs.findIndex((tab) => tab.classList.contains('is-active'));
      if (currentIndex === -1) return;
      let nextIndex = currentIndex;
      if (event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }
      event.preventDefault();
      const nextTab = tabs[nextIndex];
      activateTab(nextTab);
      nextTab.focus();
    });
  }

  if (accordion) {
    accordion.addEventListener('click', (event) => {
      const trigger = event.target instanceof HTMLElement ? event.target.closest('.accordion-trigger') : null;
      if (!trigger || !(trigger instanceof HTMLElement)) return;
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      panel.toggleAttribute('hidden', expanded);
    });
  }

  function serializeForm(formElement) {
    const formData = new FormData(formElement);
    return Object.fromEntries(formData.entries());
  }

  function setFormStatus(key) {
    if (!formStatus) return;
    formStatus.setAttribute('data-status', key);
    const lang = root.getAttribute('lang') || 'es';
    const dict = translations[lang] || translations.es;
    formStatus.textContent = dict[key] || '';
  }

  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      setFormStatus('contact.form.statusSending');
      const endpoint = form.dataset.endpoint;
      try {
        if (!endpoint) {
          throw new Error('Missing endpoint');
        }
        const payload = serializeForm(form);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        form.reset();
        setFormStatus('contact.form.statusSuccess');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Form submission failed', error);
        setFormStatus('contact.form.statusError');
      }
    });
  }
})();
