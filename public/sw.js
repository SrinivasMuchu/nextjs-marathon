
  // sw.js
self.addEventListener('push', function (event) {
    const data = event.data.json();
    const options = {
        body: data.message || 'Your CAD file is ready.',
        icon: 'https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png',
        // badge: 'https://marathon-web-assets.s3.ap-south-1.amazonaws.com/badge.png',
        data: {
            url: data.url || '/',
        },
        actions: [
            { action: 'view', title: 'Open File' },
            { action: 'close', title: 'Close' },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const url = event.notification.data.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

  