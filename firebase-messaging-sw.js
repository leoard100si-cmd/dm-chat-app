// Service Worker do Firebase Cloud Messaging.
// Este arquivo precisa ficar hospedado na MESMA pasta que o dm-chat.html
// (mesmo nível/URL), senão o navegador não encontra.
//
// Se você trocar de projeto Firebase, atualize os valores abaixo para
// ficarem IGUAIS aos do FIREBASE_CONFIG dentro do dm-chat.html.

importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAdAakO6RWmVkgNUQReXUFvEGWzYFPjUuk",
  authDomain: "dmchat-8a532.firebaseapp.com",
  databaseURL: "https://dmchat-8a532-default-rtdb.firebaseio.com",
  projectId: "dmchat-8a532",
  messagingSenderId: "40634164639",
  appId: "1:40634164639:web:905f15e695c27c136a09aa"
});

const messaging = firebase.messaging();

// Mostra a notificação quando a mensagem chega com o app fechado/minimizado.
// Título/corpo vêm em payload.data (não em payload.notification) de propósito:
// mandar os dois juntos faz o navegador exibir a notificação sozinho, duplicando.
messaging.onBackgroundMessage(payload => {
  const title = (payload.data && payload.data.title) || "Đ.M";
  const body = (payload.data && payload.data.body) || "Nova mensagem";

  self.registration.showNotification(title, {
    body,
    icon: "icon.png",
    badge: "badge.png",
    tag: (payload.data && payload.data.chat) || "dm-chat",
    data: payload.data || {}
  });
});

// Ao tocar na notificação, abre (ou foca) a aba do chat.
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("./");
    })
  );
});
