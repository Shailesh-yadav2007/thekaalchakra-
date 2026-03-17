self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    data = {};
  }
  const title = data.title || "TheKaalchakra";
  const options = {
    body: data.body || "New article published!",
    icon: "/kaalchakra_favicon.png",
    badge: "/kaalchakra_favicon.png",
    data: { url: data.url || "/english" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/english";
  event.waitUntil(clients.openWindow(url));
});
