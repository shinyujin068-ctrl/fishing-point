const C='fish-v69';
const CORE=['./','./index.html'];
const OPTIONAL=['./manifest.webmanifest','./favicon.ico','./favicon-32.png','./favicon-16.png','./apple-touch-icon.png','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil((async()=>{
    const cache=await caches.open(C);
    for(const url of [...CORE,...OPTIONAL]){
      try{
        const r=await fetch(url,{cache:'reload'});
        if(r.ok)await cache.put(url,r.clone());
      }catch(_){ }
    }
  })());
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;
  e.respondWith((async()=>{
    try{
      const r=await fetch(e.request);
      if(r&&r.ok){const cache=await caches.open(C);cache.put(e.request,r.clone()).catch(()=>{});}
      return r;
    }catch(_){
      return (await caches.match(e.request)) || (e.request.mode==='navigate' ? await caches.match('./index.html') : Response.error());
    }
  })());
});
