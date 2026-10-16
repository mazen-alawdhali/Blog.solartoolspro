const CACHE_NAME = 'solar-blog-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    // تم حذف './articles.json' من هنا تماماً لضمان عدم تخزينه مؤقتاً
    './site.webmanifest',
    './favicon-96x96.png',
    './favicon.ico',
    './favicon.svg',
    './apple-touch-icon.png'
];

// تثبيت الخدمة وتخزين الملفات الأساسية مؤقتاً[span_2](start_span)[span_2](end_span)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// تفعيل الخدمة وتنظيف الكاش القديم إن وجد[span_3](start_span)[span_3](end_span)
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

// استراتيجية الجلب المخصصة لملف articles.json[span_4](start_span)[span_4](end_span)
self.addEventListener('fetch', (event) => {
    // 🌟 إذا كان الطلب يخص ملف articles.json، يتم جلبه من الشبكة حصرياً لتظهر التحديثات والحذف فوراً
    if (event.request.url.includes('articles.json')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // باقي ملفات الموقع تعمل بالطريقة العادية
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
