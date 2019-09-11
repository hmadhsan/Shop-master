const cacheName = 'olx-cachess';
const staticAssets = [
    './',

    './Style.css',
    './index.html',
    './App.js',

    './Images/pic.jpg',
    './Images/OLX.png',


    './materialize/css/materialize.min.css',
    

    './materialize/js/materialize.min.js',

   

    './Pages/Ads/Ads.html',
    './Pages/Ads/Ads.css',
    './Pages/Ads/Ads.js',

    './Pages/Auth/Auth.html',
    './Pages/Auth/Auth.css',
    './Pages/Auth/Auth.js',

    './Pages/Chat/Chat.html',
    './Pages/Chat/Chat.css',
    './Pages/Chat/Chat.js',

    './Pages/ChatPage/ChatPage.html',
    './Pages/ChatPage/ChatPage.css',
    './Pages/ChatPage/ChatPage.js',

    './Pages/Display/Display.html',
    './Pages/Display/Display.css',
    './Pages/Display/Display.js',

    './Pages/MyAds/MyAds.html',
    './Pages/MyAds/MyAds.css',
    './Pages/MyAds/MyAds.js',

    './Pages/SubAdd/SubAdd.html',
    './Pages/SubAdd/SubAdd.css',
    './Pages/SubAdd/SubAdd.js'

    
]

// cahing install event


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
          console.log('[ServiceWorker] Caching app shell');
          return cache.addAll(staticAssets);
        })
      );
})


 //   fetching cache

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req))
    } else {
        event.respondWith(networkFirst(req))
    }
})

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const res = await fetch(req);
        cache.put(req, res.clone())
        return res;
    } catch (error) {
        return await cache.match(req)
    }
}

//   activating cache
self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
  });



  
// /* ======================== PUSH NOTIFICATION ======================== */
// /* ============================== START ============================== */

// importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/5.8.2/firebase-messaging.js');
// // Initialize the Firebase app in the service worker by passing in the
// importScripts('/__/firebase/init.js');
// // firebase.initializeApp({
// //     messagingSenderId: '174271760047'
// // });

// // messagingSenderId.
// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();
