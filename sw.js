const CACHE = 'taxi-meter-v1';
const STATIC = ['./manifest.json', './icon.svg'];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll([...STATIC, './taxi.html', './index.html']))
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // 匯率 API 一律走網路（不快取），失敗時由頁面自行處理
    if (url.hostname.includes('currency-api') || url.hostname.includes('er-api') || url.hostname.includes('jsdelivr')) {
        return; // 交給瀏覽器預設處理
    }

    // HTML 走網路優先，離線時回退快取
    if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
        e.respondWith(
            fetch(e.request)
                .then(res => {
                    caches.open(CACHE).then(c => c.put(e.request, res.clone()));
                    return res;
                })
                .catch(() => caches.match(e.request))
        );
        return;
    }

    // 其他靜態資源:快取優先
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
});
