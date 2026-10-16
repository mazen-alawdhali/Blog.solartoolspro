// كود الغاء تفعيل الخدمة وتنظيف كافة الذاكرة المؤقتة نهائياً
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => caches.delete(key))
            );
        }).then(() => {
            return self.clients.claim();
        }).then(() => {
            return self.clients.matchAll({ type: 'window' }).then((clients) => {
                clients.forEach((client) => client.navigate(client.url));
            });
        })
    );
});
