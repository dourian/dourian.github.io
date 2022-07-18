'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "659f0968c9adfa580c5b3f3a21acca81",
"index.html": "ec6562e60fcc2cde2ed73147226b6d20",
"/": "ec6562e60fcc2cde2ed73147226b6d20",
"main.dart.js": "5dc153cff5417db34e4bba2c8f752277",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "d5beef0205610ce7921e01a0eb042fa6",
"assets/AssetManifest.json": "b59d0ac065b96f23b5d6152b3d003203",
"assets/NOTICES": "46c0d1a7cd12c85c1f0797037d52511e",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/Seafood%2520Udon.jpeg": "cf109bea0db67e3e7a6b3cac1a3bcd8e",
"assets/assets/Avocado%2520Roll.jpeg": "3638221364f9776b2204b050dc4dccc1",
"assets/assets/Beef%2520Teriyaki.jpeg": "dc7f356ef1acb986be7655834b49deeb",
"assets/assets/Spider%2520Roll.jpeg": "c6af3cd5402d949b1648ea72912ee257",
"assets/assets/Tempura%2520Udon.jpeg": "e832b2a74c3f21a80a8cef0a4f8aa408",
"assets/assets/Edamame.jpeg": "c27dc97fc66a7cc9b374aff425f20f4a",
"assets/assets/Sashimi%2520Appetizer.jpeg": "52186b628bdc68f440801842f6560661",
"assets/assets/Heh%2520Dup%2520Bap.jpeg": "857edcbf9bca350611714e469e931174",
"assets/assets/Hawaiian%2520Roll.jpeg": "8cbb1881a33f3fbdce7ef075f1a96227",
"assets/assets/California%2520Roll.jpeg": "3d34a76ca9cbe8609375ed7fc33d619c",
"assets/assets/Chicken%2520Donburi.jpeg": "3726756a4d192b9b92c1a84af5e34561",
"assets/assets/Sashimi%2520and%2520Rolls.jpeg": "6dce8cc70ae6a97d72be71a5dbcbae3a",
"assets/assets/Agedashi%2520Tofu.jpeg": "221e1113751f6f29522663fe3832756d",
"assets/assets/Dynamite%2520Roll.jpeg": "0b4a9209d332e0c4b62054ba7ef45f4f",
"assets/assets/logo.png": "61a8373443294489f47b8cf8bff96404",
"assets/assets/Cucumber%2520Roll.jpeg": "1164a6cfaad5bebb1201f9b531815136",
"assets/assets/Tempura%2520Mix.jpeg": "eb7a1e89fa83c39412258bbd7332804a",
"assets/assets/Shrimp%2520Tempura.jpeg": "333f098429bbf6ab9e2874e3f70e22d2",
"assets/assets/Sashimi%2520and%2520Sushi.jpeg": "3f4f3854c29c36aac78ec4f8f95df967",
"assets/assets/Sushi%2520Appetizer.jpeg": "d1f94275da2935f54ff6a408dce11e3b",
"assets/assets/Red%2520Dragon.jpeg": "19b49216efd550b101381a77f0931a74",
"assets/assets/Bulgogi%2520Lunch%2520Box.jpeg": "3a06826b79ba9d329b1fe1270dd956da",
"assets/assets/Spicy%2520Salmon%2520Roll.jpeg": "b9e8a5c90de572753d34285c59648bf5",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
