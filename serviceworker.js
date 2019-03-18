var CACHE_NAME = 'my-pwa-cache-v1';

var urlToCache = [
    '/',
    '/css/main.css',
    '/css/bootstrap.min.css',
    '/js/jquery.min.js',
    '/js/main.js',
    '/images/ugm.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(
            function(cache) {
                console.log('service worker do install...', cache);
                return cache.addAll(urlToCache);
            }
            // function(err){
            //     console.log('err : ', err);
            // }
        )
    )
});

self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    return cacheName !== CACHE_NAME;
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            )
        })
    )
}); 

self.addEventListener('fetch', function(event){
    var request = event.request;
    var url = new URL(request.url);

    //Misahin caches file dengan cache API
    if(url.origin === location.origin){
        event.respondWith(
            caches.match(request).then(function(response){
                return response || fetch(request);
            })
        )
    } else {
        event.respondWith(
            caches.open('list-mahasiswa-cache-v1').then(async function(cache){
                try {
                    const liveRequest = await fetch(request);
                    cache.put(request, liveRequest.clone());
                    return liveRequest;
                }
                catch (e) {
                    const response = await caches.match(request);
                    if (response)
                        return response;
                    return caches.match('/fallback.json');
                }
            })
        )
    }

    // event.respondWith(
    //     caches.match(event.request).then(function(response){
    //         console.log(response);
    //         if(response){
    //             return response;
    //         }
    //         return fetch(event.request);
    //     })
    // )
});

if(navigator.serviceWorker){
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('/serviceworker.js').then(function(reg){
            console.log('SW regis sukses dgn skop', reg.scope);
        }, function(err){
            console.log("SW regis failed", err);
        });
    });
}

self.addEventListener('notificationclick', function(e){
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    console.log(primaryKey);

    if (action === 'close'){
        notification.close();
    }else {
        clients.openWindow('http://google.com');
        notification.close();
    }
});