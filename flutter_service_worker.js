'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "659f0968c9adfa580c5b3f3a21acca81",
"index.html": "6538daa2c10b372b918d61fc26634bbb",
"/": "6538daa2c10b372b918d61fc26634bbb",
"main.dart.js": "42ffe2655f8542a28c41c09d58e7fa55",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "d5beef0205610ce7921e01a0eb042fa6",
"assets/AssetManifest.json": "4016f1a57d27e1eb1750c566cf21f106",
"assets/NOTICES": "46c0d1a7cd12c85c1f0797037d52511e",
"assets/FontManifest.json": "50b0775a2b5a8a63d62cbec0bac03ffa",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/Rockwell.ttc": "7f22e4928b358740c3734063317d6cb9",
"assets/fonts/PTSans.ttc": "b9f92f62fa08ec2b9795148c6f3722b3",
"assets/fonts/Nunito-Regular.ttf": "ee871891d96eae03cd9092a5f6ef7dcb",
"assets/fonts/Nunito-Bold.ttf": "ce2557158c6267735ef6c4012401bf59",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/Seafood%2520Udon.jpeg": "7ae21543eaeb3b1b55888ac2f16ce163",
"assets/assets/Avocado%2520Roll.jpeg": "702dd09b247eaef9f0c3a2244c7d7419",
"assets/assets/Beef%2520Teriyaki.jpeg": "c4562f4b1b31f33006ef0e2ca2f6ccb1",
"assets/assets/Spider%2520Roll.jpeg": "17c1da9b1d308b787871c738f187a1ff",
"assets/assets/Tempura%2520Udon.jpeg": "2709937573b696e2483dc58392c1b23f",
"assets/assets/Edamame.jpeg": "0999a48c0492b2b0d57d8d3838bd005e",
"assets/assets/Sashimi%2520Appetizer.jpeg": "c620b489a37194ca58da9b90c6332dd8",
"assets/assets/Heh%2520Dup%2520Bap.jpeg": "26414c7d189d2f3b0a60619d95c97bd0",
"assets/assets/Hawaiian%2520Roll.jpeg": "0bf8d8fc0b2e34765c12a55bfa313dce",
"assets/assets/California%2520Roll.jpeg": "d455ebc11b4bd9b20be70d888056f87f",
"assets/assets/Chicken%2520Donburi.jpeg": "7b0def7eb6a0ac18ab93f3f946e45ace",
"assets/assets/Sashimi%2520and%2520Rolls.jpeg": "7e9dfc818c7f25eab829614f3168b34f",
"assets/assets/Agedashi%2520Tofu.jpeg": "156d99eb1e7adbc3ba11d44760e2fbd7",
"assets/assets/Dynamite%2520Roll.jpeg": "dec27622f7f7d12f4afcf09b93c9297c",
"assets/assets/logo.png": "61a8373443294489f47b8cf8bff96404",
"assets/assets/Cucumber%2520Roll.jpeg": "2f8bbc7e0018a1ebce21234b55d2eede",
"assets/assets/Tempura%2520Mix.jpeg": "f866e0e5bf4d51b5be0f25505aa97e1c",
"assets/assets/Shrimp%2520Tempura.jpeg": "06befe9031e8e87212ac9e031a3a9467",
"assets/assets/Sashimi%2520and%2520Sushi.jpeg": "1991c5817da03bec82c4dc47b7d51ac9",
"assets/assets/Sushi%2520Appetizer.jpeg": "00140acc4b99e82d24606dc3615b2fb1",
"assets/assets/Red%2520Dragon.jpeg": "fab2d1cdb8940c2303855bf342584012",
"assets/assets/Bulgogi%2520Lunch%2520Box.jpeg": "f2e4e9b7a71a0d4eae512812be78b235",
"assets/assets/Spicy%2520Salmon%2520Roll.jpeg": "32c36a668a0b50b697186593e8605324",
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
