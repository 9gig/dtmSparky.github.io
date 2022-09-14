'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "a583bb48fc7d4999fafb4c18f36b9d83",
"assets/assets/BTS.jpeg": "b57beb8fa5f191bf0a1d7b900d5d90f5",
"assets/assets/BTS@.jpeg": "74c8aeb9b38073bf7269d906e14a940b",
"assets/assets/djv.jpeg": "394e2e7c3502ae522eea96f62aa3fbaf",
"assets/assets/DMT.jpeg": "bf177d0e26971cda98c56e421d65b07a",
"assets/assets/hd.mp4": "dc2b0abbd514c0b0d053e20066408e8b",
"assets/assets/images/anyH.png": "ba96335127b6110ec2961a130e29e832",
"assets/assets/images/atm.jpeg": "4b1d1ffe09094a49a30d67a9d632fe74",
"assets/assets/images/BlT.jpeg": "894e7c894604fa7a7acdf40711a7ac60",
"assets/assets/images/dm.jpg": "a5a6fe4205c9e8e45d888e7f8f5097c7",
"assets/assets/images/dnm.png": "d24f2a19319356fe345cf827ceac6dd3",
"assets/assets/images/dtm-fil.png": "42a5b7e18b5ebb7c159dd5b815143066",
"assets/assets/images/favicon.png": "846353bb0f26e2f32d034e4b4c850fee",
"assets/assets/images/fsh.png": "ce725bf1166bbf8de46675d76bd70d93",
"assets/assets/images/pd.jpg": "801ee7a5d1a151d4f5a3038b4999549b",
"assets/assets/images/vidi.jpg": "b35bd1548980a0d466d746a2160f9efd",
"assets/assets/images/wave.png": "6adf4e6e58576b299660fda98b6f49b9",
"assets/assets/images/wev.jpg": "66b57e8d4fe5d396d8200c17b875071e",
"assets/assets/LIT.jpeg": "6da0954b2269ff1386fa7a4a84d5381b",
"assets/assets/svg/github.svg": "2f55debd98b4040009b3ab545969577d",
"assets/assets/svg/insta.svg": "ac26d95bf0a8fd4b110a73ad0f556c42",
"assets/assets/XER.jpeg": "fa162b5e660fed24aea6d7fa7424eccb",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "1b791a92d9cc41d9a667935d7d7ff8eb",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "846353bb0f26e2f32d034e4b4c850fee",
"flutter.js": "eb2682e33f25cd8f1fc59011497c35f8",
"icons/favicon.png": "846353bb0f26e2f32d034e4b4c850fee",
"icons/Icon-192.png": "ada1b664a070f9166f4be67329ec56dd",
"icons/Icon-512.png": "e52e9a17f1c145410a734edef24a5aa4",
"icons/Icon-maskable-192.png": "ada1b664a070f9166f4be67329ec56dd",
"icons/Icon-maskable-512.png": "e52e9a17f1c145410a734edef24a5aa4",
"index.html": "cc80846eea137078a6fa7c13ca2b3595",
"/": "cc80846eea137078a6fa7c13ca2b3595",
"main.dart.js": "7d65f785e2f606e670dfe7f629b2aa95",
"manifest.json": "a34a9fe920349efe331f39f5cac95acd",
"version.json": "968c20323974d9615727cbdc440a67bb"
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
