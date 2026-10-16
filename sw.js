const CACHE_NAME = 'solar-blog-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './articles.json',
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

// استراتيجية الجلب: محاولة جلب التحديث من الشبكة أولاً، وإن فشل (انقطع النت) يتم جلب النسخة المخزنة
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // إذا كانت الاستجابة سليمة، نقوم بتحديث الكاش الخاص بها اختيارياً
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
