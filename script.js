/* =========================================
   KHD STUDIO - JAVASCRIPT LOGIC
   ========================================= */

// 1. Dictionaries for Localization (AR/EN)
const translations = {
    en: {
        page_title: "KHALED MOHAMED | Modern Web Development Studio",
        nav_services: "Services",
        nav_portfolio: "Portfolio",
        nav_process: "Process",
        hero_badge: "✨ Premium Developer Studio",
        hero_title: "Modern Websites Built for <span class='gradient-text'>Speed</span>, <span class='gradient-text'>Performance</span>, and <span class='gradient-text'>Growth</span>",
        hero_subtitle: "I design and develop fast, modern, and scalable websites for individuals, startups, and businesses.",
        btn_view_work: "View My Work",
        btn_start_project: "Contact Us",
        tech_subtitle: "Powered by modern technologies",
        tech_perf: "Performance Optimization",
        tech_responsive: "Responsive Design",
        services_title: "My Services",
        services_desc: "Tailored digital solutions to elevate your online presence.",
        srv_landing_title: "Landing Page Development",
        srv_landing_desc: "High-converting landing pages for products and businesses.",
        srv_cv_title: "Portfolio & CV Websites",
        srv_cv_desc: "Clean personal websites for freelancers and professionals.",
        srv_business_title: "Business Websites",
        srv_business_desc: "Modern, scalable websites for startups and companies.",
        srv_custom_title: "Custom Web Development",
        srv_custom_desc: "Fully customized web applications with unique functionality.",
        portfolio_title: "Selected Work",
        portfolio_desc: "A showcase of recent premium web projects.",
        btn_live_site: "View Live Site <i class='fa-solid fa-arrow-up-right-from-square' style='margin-left:5px'></i>",
        proj_shaimaa_desc: "A clean, professional multi-lingual resume and portfolio website.",
        proj_study_desc: "An educational platform interface for generating and tracking study plans.",
        proj_pharmacy_desc: "Modern brand identity and web presence for a medical pharmacy.",
        proj_ghada_title: "Ghada Portfolio",
        proj_ghada_desc: "A professional multi-lingual portfolio for a Quran and Tajweed educator.",
        process_title: "How I Work",
        process_desc: "A streamlined, professional development process.",
        step_1_title: "Project Discussion",
        step_1_desc: "Understanding your goals, target audience, and project requirements.",
        step_2_title: "Planning & Structure",
        step_2_desc: "Creating wireframes and establishing the core architecture.",
        step_3_title: "Design & Development",
        step_3_desc: "Crafting the visual identity and writing clean, scalable code.",
        step_4_title: "Testing & Optimization",
        step_4_desc: "Rigorous cross-browser testing and performance optimization.",
        step_5_title: "Final Delivery",
        step_5_desc: "Deploying the project and handing over the final product to you.",
        why_title: "Why Choose KHALED MOHAMED?",
        why_desc: "I am committed to delivering excellence. Every line of code is written with purpose, and every design decision is made to maximize user engagement and business growth.",
        why_1: "Ultra-fast loading speeds",
        why_2: "Modern, premium aesthetics",
        why_3: "Responsive & accessible on all devices",
        why_4: "Clean, maintainable source code",
        footer_slogan: "Building Modern High-Performance Websites",
        footer_rights: "All Rights Reserved."
    },
    ar: {
        page_title: "KHALED MOHAMED | استوديو تطوير مواقع حديث",
        nav_services: "الخدمات",
        nav_portfolio: "أعمالي",
        nav_process: "خطوات العمل",
        hero_badge: "✨ استوديو تطوير مواقع احترافي",
        hero_title: "مواقع حديثة مبنية من أجل <span class='gradient-text'>السرعة</span>، <span class='gradient-text'>الأداء</span>، و <span class='gradient-text'>النمو</span>",
        hero_subtitle: "أقوم بتصميم وتطوير مواقع سريعة وحديثة وقابلة للتوسع للأفراد والشركات الناشئة والمؤسسات.",
        btn_view_work: "شاهد أعمالي",
        btn_start_project: "تواصل معنا",
        tech_subtitle: "مبني باستخدام أحدث التقنيات",
        tech_perf: "تحسين الأداء",
        tech_responsive: "تصميم متجاوب",
        services_title: "خدماتي",
        services_desc: "حلول رقمية مخصصة للارتقاء بحضورك على الإنترنت.",
        srv_landing_title: "تطوير صفحات الهبوط",
        srv_landing_desc: "صفحات هبوط عالية التحويل للمنتجات والشركات.",
        srv_cv_title: "مواقع السيرة الذاتية (Portfolio)",
        srv_cv_desc: "مواقع شخصية بتصميم نظيف للمستقلين والمحترفين.",
        srv_business_title: "مواقع الشركات",
        srv_business_desc: "مواقع حديثة وقابلة للتوسع للشركات الناشئة والمؤسسات.",
        srv_custom_title: "تطوير ويب مخصص",
        srv_custom_desc: "تطبيقات ويب مخصصة بالكامل بخصائص فريدة.",
        portfolio_title: "أعمال مختارة",
        portfolio_desc: "مجموعة من أحدث المشاريع المميزة.",
        btn_live_site: "زيارة الموقع <i class='fa-solid fa-arrow-up-right-from-square' style='margin-right:5px'></i>",
        proj_shaimaa_desc: "موقع سيرة ذاتية احترافي متعدد اللغات.",
        proj_study_desc: "واجهة منصة تعليمية لإنشاء وتتبع خطط الدراسة.",
        proj_pharmacy_desc: "هوية علامة تجارية حديثة وحضور رقمي لصيدلية طبية.",
        proj_ghada_title: "السيرة الذاتية لغادة",
        proj_ghada_desc: "موقع تعريفي احترافي لمعلمة قرآن وتجويد، متعدد اللغات.",
        process_title: "كيف أعمل",
        process_desc: "عملية تطوير احترافية وميسرة.",
        step_1_title: "مناقشة المشروع",
        step_1_desc: "فهم أهدافك، والجمهور المستهدف، ومتطلبات المشروع.",
        step_2_title: "التخطيط والهيكلة",
        step_2_desc: "إنشاء المخططات الأولية وتحديد البنية الأساسية.",
        step_3_title: "التصميم والتطوير",
        step_3_desc: "صياغة الهوية البصرية وكتابة أكواد نظيفة وقابلة للتطوير.",
        step_4_title: "الاختبار والتحسين",
        step_4_desc: "اختبار شامل على مختلف المتصفحات وتحسين الأداء.",
        step_5_title: "التسليم النهائي",
        step_5_desc: "إطلاق المشروع وتسليم المنتج النهائي إليك.",
        why_title: "لماذا تختار KHALED MOHAMED؟",
        why_desc: "أنا ملتزم بتقديم التميز. كل سطر من الكود مكتوب بهدف، وكل قرار تصميم يُتخذ لزيادة تفاعل المستخدمين ونمو الأعمال.",
        why_1: "سرعات تحميل فائقة",
        why_2: "جماليات حديثة وعالية الجودة",
        why_3: "متجاوب مع جميع الأجهزة",
        why_4: "أكواد مصدرية نظيفة وقابلة للصيانة",
        footer_slogan: "نبني مواقع حديثة وعالية الأداء",
        footer_rights: "جميع الحقوق محفوظة."
    }
};

// 2. State Management
let currentLang = localStorage.getItem('khd_lang') || 'en';
let currentTheme = localStorage.getItem('khd_theme') || 'dark';

// DOM Elements
const body = document.body;
const html = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const langToggleBtn = document.getElementById('lang-toggle');
const currentLangSpan = document.getElementById('current-lang');
const menuToggleBtn = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

// 3. Theme Toggle Functionality
function initTheme() {
    if (currentTheme === 'dark') {
        body.classList.add('dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        body.classList.remove('dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    
    // Enable transitions after initial load
    setTimeout(() => {
        body.classList.remove('disable-transitions');
    }, 100);
}

themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        currentTheme = 'light';
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        body.classList.add('dark');
        currentTheme = 'dark';
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    localStorage.setItem('khd_theme', currentTheme);
});

// 4. Language Translation Functionality
function applyLanguage(lang) {
    const isRtl = lang === 'ar';
    html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang);
    currentLangSpan.innerText = isRtl ? 'English' : 'العربية';

    // Apply translations
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
}

langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('khd_lang', currentLang);
    
    // temporarily disable transitions for instant layout flip
    body.classList.add('disable-transitions');
    applyLanguage(currentLang);
    
    setTimeout(() => {
        body.classList.remove('disable-transitions');
    }, 50);
});

// 5. Mobile Menu Toggle
menuToggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenu.classList.contains('active') ? 'fa-xmark' : 'fa-bars';
    menuToggleBtn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
});

const mobileLinks = document.querySelectorAll('.mobile-link');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

// 6. Scroll Reveal Animation using Intersection Observer
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Stop observing once revealed
        }
    });
};

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// 7. Navbar Scroll Effect (blur and shrink)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = 'none';
    }
});

// 8. Dynamic Copyright Year
document.getElementById('year').textContent = new Date().getFullYear();

// 9. PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    applyLanguage(currentLang);
});
