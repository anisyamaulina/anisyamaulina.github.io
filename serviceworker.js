var CACHE_NAME = 'my-pwa-cache-v1';

var urlsToCache = [
   '/',
   '/css/main.css',
   'images/ugm.png',
   '/js/jquery.min.js',
   '/js/main.js',
   '/fallback.json'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(
            function (cache) {
                console.log('service worker do install..',cache);
                return cache.addAll(urlsToCache);
            },
            // function (err) {
            //     console.log('err : ' , err);
            // }
        )
    )
});


self.addEventListener('active', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.filter(function(cacheNames){
                    return cacheNames !== CACHE_NAME;
                }).map(function(cacheNames){
                    return caches.delete(cacheNames);
                })
            );
        })
    );
});


/* FETCH CHACE */
self.addEventListener('fetch', function(event){
    var request = event.request;
    var url = new URL(request.url);

    // Memisahkan cache file dengan cache data API
    if(url.origin === location.origin){
        event.respondWith(
            caches.match(request).then(function(response){
                return response || fetch(request);
            })
        )
    }else{
        event.respondWith(
            caches.open('list-mahasiswa-cache-v1')
            .then(function(cache){
                return fetch(request).then(function(liveRequest){
                    cache.put(request, liveRequest.clone());
                    return liveRequest;
                }).catch(function(){
                    return caches.match(request)
                    .then(function(request){
                        if (response) return response;
                        return caches.match('fallback.json');
                    })
                })
            })
        )
    }
    /* event.respondWith(
        caches.match(event.request)
            .then(function(response){
                console.log(response);
                if (response){
                    return response;
                }
                return fetch(event.request);
            })
    );
    */
});