import { getAssetFromKV, mapRequestToAsset } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    return await getAssetFromKV(event, {
      mapRequestToAsset: (req) => {
        let defaultAssetKey = mapRequestToAsset(req);
        let url = new URL(defaultAssetKey.url);
        if (url.pathname.endsWith("/")) {
          return new Request(`${defaultAssetKey.url}index.html`, defaultAssetKey);
        }
        return defaultAssetKey;
      },
    });
  } catch (e) {
    if (e.message.match(/^could not find/)) {
      return new Response("Not Found", { status: 404 });
    }
    return new Response("Internal Error", { status: 500 });
  }
}
