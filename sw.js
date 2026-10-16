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

// تفعيل الخدمة وتنظيف الكاش القديم فوراً
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

// إدارة طلبات الشبكة (جلب المقالات من السيرفر مباشرة أولاً لضمان ظهور المنشورات الجديدة فوراً)
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('articles.json')) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request);
            })
        );
    }
});
