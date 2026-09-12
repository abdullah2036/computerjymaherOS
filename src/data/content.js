/* ============================================================
   كمبيوترجي ماهر · THE DIGITAL WORKSHOP
   Mock brand. Every action opens WhatsApp.

   Both languages are written, not translated. Where Arabic has an
   idiom the English gets its own idiom rather than a literal copy,
   and whichever script is selected is set as the primary voice.
   ============================================================ */

export const WHATSAPP = '966555972970';
export const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

export const i18n = {
  ar: {
    dir: 'rtl',
    /* --- identity --- */
    wordmark: 'كمبيوترجي',
    wordmark_alt: 'COMPUTERJY',
    tagline: 'ورشة رقمية',
    tagline_alt: 'DIGITAL WORKSHOP',
    est: 'جدة · منذ ٢٠١٦',
    greeting: 'جِيت تصلّح؟',

    loading: 'جارٍ فتح الورشة',
    enterBtn: 'ادخل',

    /* --- chrome --- */
    nav_services: 'الخدمات',
    nav_crt: 'آلية العمل',
    nav_work: 'الأعمال',
    nav_bench: 'العتاد',
    nav_reviews: 'الآراء',
    nav_contact: 'تواصل',
    nav_cta: 'احجز',
    scrollcue: 'مرّر',

    /* --- cursor verbs --- */
    cur_open: 'افتح',
    cur_inspect: 'افحص',
    cur_view: 'اعرض',
    cur_contact: 'تواصل',
    cur_turn: 'أدِر',

    /* --- acts --- */
    enter_body: 'استوديو تقني على طاولة واحدة — استشارة، بناء واجهات، أنظمة متكاملة، وتأمين سيبراني.',

    services_title: 'كل خدمة<br>لها أداتها.',
    services_body: 'على الطاولة أربع أدوات. مرّر فوق أي واحدة منها.',
    s1_t: 'استشارة تقنية', s1_d: 'نشخّص قبل ما نلمس شيء: مراجعة الكود أو البنية، واختيار المسار الصحيح.', s1_p: '١٠٠ ﷼', s1_u: '/ الجلسة', s1_obj: 'جهاز القياس',
    s2_t: 'بناء واجهات أمامية', s2_d: 'واجهات إنتاجية سريعة ومتجاوبة بحركات نظيفة — من التصميم إلى كود جاهز للنشر.', s2_p: '١٥٠ ﷼', s2_u: '/ المشروع', s2_obj: 'لوحة المفاتيح',
    s3_t: 'تطوير متكامل', s3_d: 'من الواجهة إلى الخادم: واجهات برمجية، قواعد بيانات، مصادقة، ونشر.', s3_p: '٣٠٠ ﷼', s3_u: '/ المشروع', s3_obj: 'الجهاز كامل',
    s4_t: 'تأمين واختبار سيبراني', s4_d: 'فحص بأسلوب اختبار الاختراق، مراجعة الثغرات، وتقرير تقوية عملي.', s4_p: '١٠٠ ﷼', s4_u: '/ الفحص', s4_obj: 'الراوتر',
    book: 'احجز',

    crt_title: 'الشاشة<br>هي الباب.',
    crt_body: 'أربع خطوات قبل ما ندخل.',
    p1_t: 'حدّد النطاق', p1_d: 'نتفق على ما يجب إنجازه بالضبط.',
    p2_t: 'نتفق على الخطة', p2_d: 'جدول واضح وتكلفة ثابتة قبل أن نبدأ.',
    p3_t: 'نبدأ التنفيذ', p3_d: 'بناء تدريجي مع معاينات حيّة.',
    p4_t: 'التسليم والمتابعة', p4_d: 'نشر نهائي، كود مُوثّق، ومتابعة.',

    work_title: 'أعمال<br>على الهواء.',
    work_body: 'مشاريع حقيقية تم تطويرها ونشرها.',
    visit: 'زيارة الموقع ↗',
    preview: 'معاينة',
    close: 'إغلاق',

    bench_title: 'العتاد الذي<br>أعتمد عليه.',
    bench_body: 'قطع مُجرَّبة على الطاولة. اسحب لتدويرها.',
    order: 'اطلب',

    reviews_title: 'موثوق من<br>عملاء حقيقيين.',

    contact_title: 'وش خربان؟',
    contact_body: 'ابعث لي المشكلة على واتساب — الرد خلال ساعات.',
    cta_btn: 'افتح واتساب',
    stat1_n: '+٢٤٠', stat1_l: 'مشروع ومهمة',
    stat2_n: '٤٫٩', stat2_l: 'تقييم متوسط',
    stat3_n: '٩+', stat3_l: 'سنوات خبرة',
    footer: '© ٢٠٧٧ كمبيوترجي ماهر — نموذج تصميمي لأغراض العرض فقط.',
  },

  en: {
    dir: 'ltr',
    wordmark: 'COMPUTERJY',
    wordmark_alt: 'كمبيوترجي',
    tagline: 'DIGITAL WORKSHOP',
    tagline_alt: 'ورشة رقمية',
    est: 'JEDDAH · EST. 2016',
    greeting: 'What’s broken?',

    loading: 'Opening the workshop',
    enterBtn: 'Enter',

    nav_services: 'Services',
    nav_crt: 'Process',
    nav_work: 'Work',
    nav_bench: 'Bench',
    nav_reviews: 'Reviews',
    nav_contact: 'Contact',
    nav_cta: 'Book',
    scrollcue: 'Scroll',

    cur_open: 'Open',
    cur_inspect: 'Inspect',
    cur_view: 'View',
    cur_contact: 'Contact',
    cur_turn: 'Turn',

    enter_body: 'A tech studio that fits on one bench — consulting, frontend builds, full-stack systems, and security testing.',

    services_title: 'Every service<br>has its tool.',
    services_body: 'Four tools on the bench. Hover any of them.',
    s1_t: 'Consulting', s1_d: 'Diagnose before touching anything: review the code or the architecture, then pick the right path.', s1_p: 'SAR 100', s1_u: '/ session', s1_obj: 'the multimeter',
    s2_t: 'Frontend Building', s2_d: 'Fast, responsive production interfaces with clean motion — design through to deploy-ready code.', s2_p: 'SAR 150', s2_u: '/ project', s2_obj: 'the keyboard',
    s3_t: 'Full-Stack Development', s3_d: 'Front to back: APIs, databases, auth, and deployment.', s3_p: 'SAR 300', s3_u: '/ project', s3_obj: 'the whole machine',
    s4_t: 'Securing & Testing', s4_d: 'A pentest-style pass over common vulnerabilities, with a practical hardening report.', s4_p: 'SAR 100', s4_u: '/ scan', s4_obj: 'the router',
    book: 'Book',

    crt_title: 'The screen<br>is the way in.',
    crt_body: 'Four steps before we go through.',
    p1_t: 'Define the scope', p1_d: 'We agree exactly what gets built.',
    p2_t: 'Agree the plan', p2_d: 'A clear schedule and a fixed price up front.',
    p3_t: 'Start building', p3_d: 'Incremental work with live previews.',
    p4_t: 'Ship & follow up', p4_d: 'Final deploy, documented code, follow-up.',

    work_title: 'Work<br>that’s live.',
    work_body: 'Real projects, built and deployed.',
    visit: 'Visit site ↗',
    preview: 'Preview',
    close: 'Close',

    bench_title: 'The gear<br>I rely on.',
    bench_body: 'Bench-tested parts. Drag to turn.',
    order: 'Order',

    reviews_title: 'Trusted by<br>real clients.',

    contact_title: 'What’s broken?',
    contact_body: 'Send me the problem on WhatsApp — reply within hours.',
    cta_btn: 'Open WhatsApp',
    stat1_n: '240+', stat1_l: 'projects & tasks',
    stat2_n: '4.9', stat2_l: 'average rating',
    stat3_n: '9+', stat3_l: 'years experience',
    footer: '© 2077 Computerjy Maher — a design concept, for demo purposes only.',
  },
};

/* each service is the tool of its trade, sitting on the bench */
export const SERVICES = [
  { id: 's1', key: 's1', obj: 'multimeter', msg: { ar: 'أرغب في حجز جلسة استشارة تقنية.', en: 'I’d like to book a consulting session.' } },
  { id: 's2', key: 's2', obj: 'keyboard',   msg: { ar: 'أرغب في خدمة بناء واجهات أمامية.', en: 'I’m interested in the frontend building service.' } },
  { id: 's3', key: 's3', obj: 'tower',      msg: { ar: 'أرغب في مشروع تطوير متكامل.', en: 'I’d like a full-stack development project.' } },
  { id: 's4', key: 's4', obj: 'router',     msg: { ar: 'أرغب في فحص وتأمين سيبراني.', en: 'I’d like a cybersecurity test & hardening.' } },
];

export const PROCESS = ['p1', 'p2', 'p3', 'p4'];

export const PRODUCTS = [
  { id: 'p1', glyph: '🔌', ar: 'كابل HDMI 4K', en: 'HDMI 4K Cable', price_ar: '٤٥ ﷼', price_en: 'SAR 45' },
  { id: 'p2', glyph: '🔗', ar: 'محول USB-C إلى HDMI', en: 'USB-C to HDMI', price_ar: '٦٠ ﷼', price_en: 'SAR 60' },
  { id: 'p3', glyph: '📱', ar: 'كابل USB-C إلى Lightning', en: 'USB-C to Lightning', price_ar: '٥٥ ﷼', price_en: 'SAR 55' },
  { id: 'p4', glyph: '🧩', ar: 'هَب USB-C متعدد المنافذ', en: 'USB-C Multiport Hub', price_ar: '١٣٠ ﷼', price_en: 'SAR 130' },
  { id: 'p5', glyph: '🖱️', ar: 'ماوس لاسلكي', en: 'Wireless Mouse', price_ar: '٧٠ ﷼', price_en: 'SAR 70' },
  { id: 'p6', glyph: '⌨️', ar: 'لوحة مفاتيح ميكانيكية', en: 'Mechanical Keyboard', price_ar: '٢٢٠ ﷼', price_en: 'SAR 220' },
];

export const PROJECTS = [
  {
    id: 'eloria',
    url: 'https://abdullah2036.github.io/eloriaproject',
    img: new URL('../assets/img/eloria.png', import.meta.url).href,
    ar: { title: 'مشروع إيلوريا', cat: 'مكتبة رقمية', desc: 'منصة ومكتبة تفاعلية للقصص والروايات والاقتباسات، بتصميم بصري وظيفي ودعم لوضع الكاتبة.' },
    en: { title: 'Eloria Project', cat: 'Digital Library', desc: 'An interactive library and platform for stories, web novels and literary quotes, with a custom author mode.' },
    stack: ['HTML5', 'CSS3', 'JavaScript', 'SPA Engine'],
  },
  {
    id: 'maheren',
    url: 'https://abdullah2036.github.io/maheren',
    img: new URL('../assets/img/maheren.png', import.meta.url).href,
    ar: { title: 'بوابة مؤسسة الماهرين', cat: 'بوابة إلكترونية', desc: 'بوابة تفاعلية بصرياً تجمع المشاريع العائلية والمنصات التقنية في واجهة دخول مبتكرة.' },
    en: { title: 'Al-Maheren Portal', cat: 'Web Portal', desc: 'A visually interactive portal gathering family projects and small tech platforms behind an inventive gate.' },
    stack: ['HTML5', 'Cyber CSS', 'JS FX', 'Interactive UI'],
  },
];

export const REVIEWS = [
  { ar: { q: 'سلّم الواجهة خلال أيام، كود نظيف وشرح واضح لكل قرار.', n: 'سارة العتيبي', r: 'صاحبة عمل صغير' }, en: { q: 'Delivered the frontend in days — clean code, and a clear reason for every call.', n: 'Sarah Al-Otaibi', r: 'Small business owner' } },
  { ar: { q: 'بنى لنا نظام حجوزات كامل، ثابت وسريع من أول يوم.', n: 'فهد القحطاني', r: 'مدير مكتب' }, en: { q: 'Built us a full booking system — stable and fast from day one.', n: 'Fahad Al-Qahtani', r: 'Office manager' } },
  { ar: { q: 'راجع أمان الموقع وطلّع تقرير واضح بالثغرات وكيف نسدّها.', n: 'نورة الحربي', r: 'مصممة جرافيك' }, en: { q: 'Reviewed our security and gave a clear report of the gaps and how to close them.', n: 'Noura Al-Harbi', r: 'Graphic designer' } },
  { ar: { q: 'اشتغل على موقعين في وقت قياسي وأتمّهما بنجاح.', n: 'رئيسة موقع إيلوريا', r: 'كاتبة' }, en: { q: 'Took on two sites in record time and landed both.', n: 'Eloria site lead', r: 'Writer' } },
];
