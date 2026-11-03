const CACHE='mategenio-v2-1';
const FILES=['./','./index.html','./src/styles.css','./src/app.js','./src/engine.js','./src/storage.js','./assets/forest.svg','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./manifest.webmanifest','./practica.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mategenio-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));});
