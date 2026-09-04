const C='fish-v52';
const CORE=['./','./index.html','./manifest.webmanifest','./favicon.ico','./favicon-32.png','./favicon-16.png','./apple-touch-icon.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{let rc=r.clone();caches.open(C).then(c=>c.put(e.request,rc));return r}).catch(()=>caches.match(e.request)))});
