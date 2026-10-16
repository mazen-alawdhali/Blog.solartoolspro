const CACHE_NAME = 'solar-blog-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './admin.html', // 🌟 إضافة لوحة التحكم هنا لكي تدعم التثبيت والعمل أوفلاين
    // تم حذف './articles.json' من هنا تماماً لضمان عدم تخزينه مؤقتاً
    './site.webmanifest',
    './favicon-96x96.png',
    './favicon.ico',
    './favicon.svg',
    './apple-touch-icon.png'
];

// تثبيت الخدمة وتخزين الملفات الأساسية مؤقتاً
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// تفعيل الخدمة وتنظيف الكاش القديم إن وجد
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// استراتيجية الجلب المخصصة
self.addEventListener('fetch', (event) => {
    // 🌟 إذا كان الطلب يخص ملف articles.json، يتم جلبه من الشبكة حصرياً لتظهر التحديثات والحذف فوراً
    if (event.request.url.includes('articles.json')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // باقي ملفات الموقع ولوحة التحكم تعمل بنظام الشبكة أولاً مع العودة للكاش عند انقطاع الإنترنت
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
