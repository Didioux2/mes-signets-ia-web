const CACHE_NAME = "mes-signets-ia-v1";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (
    request.method === "POST" &&
    new URL(request.url).pathname.endsWith("/share-target")
  ) {
    event.respondWith(handleShareTarget(request));
  }
});

async function handleShareTarget(request) {
  const formData = await request.formData();

  const title =
    String(formData.get("title") || "").trim();

  const raw =
    String(
      formData.get("url") ||
      formData.get("text") ||
      ""
    ).trim();

  let sharedUrl = "";

  try {
    sharedUrl = new URL(raw).href;
  } catch {
    const match = raw.match(
      /https?:\/\/[^\s]+/
    );

    if (match) {
      sharedUrl = match[0];
    }
  }

  const redirectUrl =
    new URL("./", request.url);

  if (sharedUrl) {
    redirectUrl.searchParams.set(
      "shared_url",
      sharedUrl
    );
  }

  if (title) {
    redirectUrl.searchParams.set(
      "shared_title",
      title
    );
  }

  return Response.redirect(
    redirectUrl.href,
    303
  );
}
