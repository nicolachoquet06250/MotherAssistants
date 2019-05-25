const CACHE_NAME = 'V1';
const STATIC_CACHE_URLS = ['/', '/home', '/account/signin', '/account/signon', '/stylesheets/style.css'];

self.addEventListener('install', event => {
	console.log('Service Worker installing.');
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_CACHE_URLS))
	)
});

self.addEventListener('activate', event => {
	// delete any unexpected caches
	event.waitUntil(
		caches.keys()
			.then(keys => keys.filter(key => key !== CACHE_NAME))
			.then(keys => Promise.all(keys.map(key => {
				console.log(`Deleting cache ${key}`);
				return caches.delete(key)
			})))
	);
});


self.addEventListener('fetch', event => {
	// Stratégie Cache-First
	event.respondWith(
		caches.match(event.request) // On vérifie si la requête a déjà été mise en cache
			.then(cached => cached || fetch(event.request)) // sinon on requête le réseau
	);
});
